import { db } from '../database/client'

// Definimos la lógica de base de datos para productos
export const ProductService = {
  // Obtener lista de productos con filtros
  getProducts: (search = '', includeInactive = false) => {
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
  },

  // Crear un nuevo producto con fecha local
  createProduct: (product: { code: string; name: string; price: number }) => {
    const stmt = db.prepare(`
      INSERT INTO products (code, name, price, created_at) 
      VALUES (@code, @name, @price, datetime('now', 'localtime'))
    `)
    return stmt.run(product)
  },

  // Actualizar datos básicos
  updateProduct: (id: number, product: { name: string; price: number }) => {
    const stmt = db.prepare(`UPDATE products SET name = @name, price = @price WHERE id = @id`)
    return stmt.run({ ...product, id })
  },

  // Eliminación lógica (desactivar)
  deleteProduct: (id: number) => {
    return db.prepare(`UPDATE products SET is_active = 0 WHERE id = ?`).run(id)
  },

  // Cambiar estado de activación
  toggleProductStatus: (id: number, isActive: boolean) => {
    const status = isActive ? 1 : 0
    return db.prepare(`UPDATE products SET is_active = @status WHERE id = @id`).run({ status, id })
  },

  // Buscar por código exacto (útil para escáneres)
  getProductByCode: (code: string) => {
    return db.prepare('SELECT * FROM products WHERE code = ? AND is_active = 1').get(code)
  }
}
