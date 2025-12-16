import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

const dbPath = is.dev
  ? join(process.cwd(), 'sales-system.db')
  : join(app.getPath('userData'), 'sales-system.db')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

export function initDB(): void {
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

  db.exec(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT DEFAULT 'completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

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
}

export const getProducts = (search = '', includeInactive = false) => {
  let query = 'SELECT * FROM products'
  const conditions: string[] = []
  const params: any = {}

  if (search) {
    conditions.push('(name LIKE @s OR code LIKE @s)')
    params.s = `%${search}%`
  }

  if (!includeInactive) {
    conditions.push('is_active = 1')
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }

  query += ' ORDER BY created_at DESC'

  return db.prepare(query).all(params)
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

export const toggleProductStatus = (id: number, isActive: boolean) => {
  const status = isActive ? 1 : 0
  return db.prepare(`UPDATE products SET is_active = @status WHERE id = @id`).run({ status, id })
}

export const createSale = (sale: { paymentMethod: string; items: any[]; total: number }) => {
  const createTransaction = db.transaction(() => {
    const result = db
      .prepare(
        `
      INSERT INTO sales (total_amount, payment_method) VALUES (@total, @method)
    `
      )
      .run({ total: sale.total, method: sale.paymentMethod })

    const saleId = result.lastInsertRowid

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

export const getSales = (limit = 50, offset = 0, startDate?: string, endDate?: string) => {
  let query = 'SELECT * FROM sales'
  const params: any = { limit, offset }

  if (startDate && endDate) {
    query += ' WHERE created_at >= @start AND created_at <= @end'
    params.start = `${startDate} 00:00:00`
    params.end = `${endDate} 23:59:59`
  }

  query += ' ORDER BY created_at DESC LIMIT @limit OFFSET @offset'

  const sales = db.prepare(query).all(params)

  const salesWithItems = sales.map((sale: any) => {
    const items = db.prepare(`SELECT * FROM sale_items WHERE sale_id = ?`).all(sale.id)
    return { ...sale, items, timestamp: sale.created_at }
  })

  return salesWithItems
}

export const cancelSale = (id: number) => {
  return db.prepare(`UPDATE sales SET status = 'cancelled' WHERE id = ?`).run(id)
}

// NUEVA FUNCIÓN: Restaurar venta
export const restoreSale = (id: number) => {
  return db.prepare(`UPDATE sales SET status = 'completed' WHERE id = ?`).run(id)
}

export const getDashboardStats = (startDate: string, endDate: string) => {
  const start = `${startDate} 00:00:00`
  const end = `${endDate} 23:59:59`
  const queryBase = `FROM sales WHERE created_at >= @start AND created_at <= @end`

  const income = db
    .prepare(`SELECT SUM(total_amount) as total ${queryBase} AND status = 'completed'`)
    .get({ start, end }) as any

  const count = db
    .prepare(`SELECT COUNT(*) as total ${queryBase} AND status = 'completed'`)
    .get({ start, end }) as any

  const cancelled = db
    .prepare(
      `SELECT COUNT(*) as count, SUM(total_amount) as amount ${queryBase} AND status = 'cancelled'`
    )
    .get({ start, end }) as any

  const average = count.total > 0 ? income.total / count.total : 0

  return {
    totalIncome: income.total || 0,
    totalSales: count.total || 0,
    averageTicket: average,
    cancelledCount: cancelled.count || 0,
    cancelledAmount: cancelled.amount || 0
  }
}

export const getTopProducts = (startDate: string, endDate: string) => {
  const start = `${startDate} 00:00:00`
  const end = `${endDate} 23:59:59`

  return db
    .prepare(
      `
    SELECT product_name as name, SUM(quantity) as sold, SUM(subtotal) as revenue
    FROM sale_items
    JOIN sales ON sales.id = sale_items.sale_id
    WHERE sales.status = 'completed'
    AND sales.created_at >= @start AND sales.created_at <= @end
    GROUP BY product_id
    ORDER BY sold DESC
    LIMIT 10
  `
    )
    .all({ start, end })
}

export const getSalesChart = (startDate: string, endDate: string) => {
  const start = `${startDate} 00:00:00`
  const end = `${endDate} 23:59:59`

  return db
    .prepare(
      `
    SELECT strftime('%Y-%m-%d', created_at) as date, SUM(total_amount) as total
    FROM sales
    WHERE status = 'completed'
    AND created_at >= @start AND created_at <= @end
    GROUP BY date
    ORDER BY date ASC
  `
    )
    .all({ start, end })
}
