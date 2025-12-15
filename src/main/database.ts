import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils' // <--- 1. Importamos esto

// 2. Lógica Condicional de Ruta
// En DEV: Se guarda en la raíz de tu proyecto (donde está package.json)
// En PROD: Se guarda en la carpeta segura de usuario (AppData/Library)
const dbPath = is.dev
  ? join(process.cwd(), 'sales-system.db')
  : join(app.getPath('userData'), 'sales-system.db')

const db = new Database(dbPath)

// Habilitar modo WAL para mejor rendimiento
db.pragma('journal_mode = WAL')

export function initDB(): void {
  // 1. TABLA PRODUCTOS
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // 2. TABLA VENTAS
  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT DEFAULT 'completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // 3. TABLA ITEMS DE VENTA
  db.exec(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `)

  // Log útil para saber dónde está tu DB en este momento
  console.log('📦 Base de datos conectada en:', dbPath)
}

// --- API DE PRODUCTOS ---

export const getProducts = (search = '') => {
  const query = search
    ? `SELECT * FROM products WHERE (name LIKE @s OR code LIKE @s) AND is_active = 1 ORDER BY created_at DESC`
    : `SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC`

  return db.prepare(query).all(search ? { s: `%${search}%` } : {})
}

export const createProduct = (product: { code: string; name: string; price: number }) => {
  const stmt = db.prepare(`INSERT INTO products (code, name, price) VALUES (@code, @name, @price)`)
  return stmt.run(product)
}

export const updateProduct = (id: number, product: { name: string; price: number }) => {
  const stmt = db.prepare(`UPDATE products SET name = @name, price = @price WHERE id = @id`)
  return stmt.run({ ...product, id })
}

export const deleteProduct = (id: number) => {
  return db.prepare(`UPDATE products SET is_active = 0 WHERE id = ?`).run(id)
}

// --- API DE VENTAS ---

export const createSale = (sale: { paymentMethod: string; items: any[]; total: number }) => {
  const createTransaction = db.transaction(() => {
    // 1. Insertar Venta
    const result = db
      .prepare(
        `
      INSERT INTO sales (total_amount, payment_method) VALUES (@total, @method)
    `
      )
      .run({ total: sale.total, method: sale.paymentMethod })

    const saleId = result.lastInsertRowid

    // 2. Insertar Items
    const insertItem = db.prepare(`
      INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, subtotal)
      VALUES (@saleId, @productId, @name, @qty, @price, @subtotal)
    `)

    for (const item of sale.items) {
      insertItem.run({
        saleId,
        productId: item.id,
        name: item.name,
        qty: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })
    }

    return { success: true, saleId }
  })

  return createTransaction()
}

export const getSales = (limit = 50, offset = 0) => {
  const sales = db
    .prepare(
      `
    SELECT * FROM sales ORDER BY created_at DESC LIMIT @limit OFFSET @offset
  `
    )
    .all({ limit, offset })

  const salesWithItems = sales.map((sale: any) => {
    const items = db.prepare(`SELECT * FROM sale_items WHERE sale_id = ?`).all(sale.id)
    return { ...sale, items, timestamp: sale.created_at }
  })

  return salesWithItems
}

export const cancelSale = (id: number) => {
  return db.prepare(`UPDATE sales SET status = 'cancelled' WHERE id = ?`).run(id)
}

// --- API DE REPORTES ---

export const getDashboardStats = () => {
  const income = db
    .prepare(`SELECT SUM(total_amount) as total FROM sales WHERE status = 'completed'`)
    .get() as any
  const count = db
    .prepare(`SELECT COUNT(*) as total FROM sales WHERE status = 'completed'`)
    .get() as any
  const cancelled = db
    .prepare(
      `SELECT COUNT(*) as count, SUM(total_amount) as amount FROM sales WHERE status = 'cancelled'`
    )
    .get() as any
  const average = count.total > 0 ? income.total / count.total : 0

  return {
    totalIncome: income.total || 0,
    totalSales: count.total || 0,
    averageTicket: average,
    cancelledCount: cancelled.count || 0,
    cancelledAmount: cancelled.amount || 0
  }
}

export const getTopProducts = () => {
  return db
    .prepare(
      `
    SELECT product_name as name, SUM(quantity) as sold, SUM(subtotal) as revenue
    FROM sale_items
    JOIN sales ON sales.id = sale_items.sale_id
    WHERE sales.status = 'completed'
    GROUP BY product_id
    ORDER BY sold DESC
    LIMIT 5
  `
    )
    .all()
}

export const getSalesChart = () => {
  return db
    .prepare(
      `
    SELECT strftime('%Y-%m-%d', created_at) as date, SUM(total_amount) as total
    FROM sales
    WHERE status = 'completed' AND created_at >= date('now', '-6 days')
    GROUP BY date
    ORDER BY date ASC
  `
    )
    .all()
}
