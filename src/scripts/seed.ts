import Database from 'better-sqlite3'
import { join } from 'path'
import fs from 'fs'

// 1. Conectar a la Base de Datos
const dbPath = join(process.cwd(), 'sales-system.db')

console.log(`🔌 Conectando a la base de datos en: ${dbPath}`)

if (!fs.existsSync(dbPath)) {
  console.error(
    '❌ No se encontró el archivo de base de datos. Ejecuta la app primero para crearlo.'
  )
  process.exit(1)
}

const db = new Database(dbPath)

const seed = () => {
  console.log('🌱 Iniciando proceso de Seed...')

  // DATOS DE PRUEBA: 10 Productos
  const products = [
    { code: 'PROD001', name: 'Café Espresso', price: 1500 },
    { code: 'PROD002', name: 'Café con Leche', price: 1800 },
    { code: 'PROD003', name: 'Medialuna de Manteca', price: 600 },
    { code: 'PROD004', name: 'Tostado Jamón y Queso', price: 3500 },
    { code: 'PROD005', name: 'Jugo de Naranja', price: 2000 },
    { code: 'PROD006', name: 'Agua Mineral', price: 1200 },
    { code: 'PROD007', name: 'Gaseosa Cola', price: 1500 },
    { code: 'PROD008', name: 'Alfajor de Chocolate', price: 1000 },
    { code: 'PROD009', name: 'Brownie con Nuez', price: 2200 },
    { code: 'PROD010', name: 'Té Clásico', price: 1200 }
  ]

  const methods = ['Efectivo', 'Tarjeta', 'Transferencia']

  // TRANSACCIÓN
  const runTransaction = db.transaction(() => {
    // A. Limpiar tablas
    console.log('🧹 Limpiando datos antiguos...')

    // Verificamos si las tablas existen antes de borrar para evitar errores
    try {
      db.prepare('DELETE FROM sale_items').run()
      db.prepare('DELETE FROM sales').run()

      // CORRECCIÓN AQUÍ: Usamos comillas simples ('sales') para el texto
      db.prepare("DELETE FROM sqlite_sequence WHERE name='sales' OR name='sale_items'").run()
    } catch (error) {
      console.log(
        '⚠️ Aviso: No se pudieron limpiar algunas tablas (quizás están vacías), continuando...'
      )
    }

    // B. Insertar Productos
    console.log('📦 Insertando productos...')
    const insertProd = db.prepare(`
      INSERT INTO products (code, name, price, created_at) 
      VALUES (@code, @name, @price, datetime('now', 'localtime'))
      ON CONFLICT(code) DO UPDATE SET price=excluded.price
    `)
    products.forEach((p) => insertProd.run(p))

    const dbProducts = db.prepare('SELECT id, name, price FROM products').all() as any[]

    // C. Generar 1000 Ventas Random para 2025
    console.log('💰 Generando 1000 ventas ficticias para el año 2025...')

    const insertSale = db.prepare(`
      INSERT INTO sales (total_amount, payment_method, created_at) 
      VALUES (@total, @method, @date)
    `)

    const insertItem = db.prepare(`
      INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, subtotal)
      VALUES (@saleId, @productId, @name, @qty, @price, @subtotal)
    `)

    for (let i = 0; i < 1000; i++) {
      // 1. Generar Fecha Random (Enero a Diciembre 2025)
      const start = new Date(2025, 0, 1).getTime()
      const end = new Date(2025, 11, 31).getTime()

      const randomTime = start + Math.random() * (end - start)
      const dateObj = new Date(randomTime)

      // Horario comercial (08:00 a 22:00)
      dateObj.setHours(8 + Math.floor(Math.random() * 14))
      dateObj.setMinutes(Math.floor(Math.random() * 60))

      const y = dateObj.getFullYear()
      const m = String(dateObj.getMonth() + 1).padStart(2, '0')
      const d = String(dateObj.getDate()).padStart(2, '0')
      const h = String(dateObj.getHours()).padStart(2, '0')
      const min = String(dateObj.getMinutes()).padStart(2, '0')
      const s = String(dateObj.getSeconds()).padStart(2, '0')
      const dateString = `${y}-${m}-${d} ${h}:${min}:${s}`

      // 2. Elegir items
      const itemsCount = Math.floor(Math.random() * 4) + 1
      let saleTotal = 0
      const saleItems: any[] = []

      for (let j = 0; j < itemsCount; j++) {
        const randomProd = dbProducts[Math.floor(Math.random() * dbProducts.length)]
        const qty = Math.floor(Math.random() * 3) + 1
        const subtotal = randomProd.price * qty

        saleTotal += subtotal
        saleItems.push({ ...randomProd, qty, subtotal })
      }

      // 3. Insertar Venta
      const method = methods[Math.floor(Math.random() * methods.length)]
      const result = insertSale.run({ total: saleTotal, method, date: dateString })
      const saleId = result.lastInsertRowid

      // 4. Insertar Items
      saleItems.forEach((item) => {
        insertItem.run({
          saleId,
          productId: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          subtotal: item.subtotal
        })
      })

      if (i % 100 === 0) process.stdout.write('.')
    }
  })

  runTransaction()
  console.log('\n\n✅ ¡Seed completado con éxito!')
  console.log(
    '🚀 IMPORTANTE: Ejecuta ahora "npx electron-builder install-app-deps" antes de iniciar la app.'
  )
}

try {
  seed()
} catch (error) {
  console.error('\n❌ Error durante el seeding:', error)
}
