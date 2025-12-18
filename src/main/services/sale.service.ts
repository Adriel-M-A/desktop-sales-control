import { db } from '../database/client'

export const SaleService = {
  // Crear una venta completa utilizando una transacción de SQLite
  createSale: (sale: { paymentMethod: string; items: any[]; total: number }) => {
    const createTransaction = db.transaction(() => {
      // Insertar la cabecera de la venta con hora local
      const result = db
        .prepare(
          `INSERT INTO sales (total_amount, payment_method, created_at) 
           VALUES (@total, @method, datetime('now', 'localtime'))`
        )
        .run({ total: sale.total, method: sale.paymentMethod })

      const saleId = result.lastInsertRowid

      // Preparar el statement para los ítems
      const insertItem = db.prepare(`
        INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, subtotal)
        VALUES (@saleId, @productId, @name, @qty, @price, @subtotal)
      `)

      // Insertar cada producto de la venta
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
  },

  // Obtener el historial de ventas con sus ítems
  getSales: (limit = 50, offset = 0, startDate?: string, endDate?: string) => {
    let query = 'SELECT * FROM sales'
    const params: any = { limit, offset }

    if (startDate && endDate) {
      query += ' WHERE created_at >= @start AND created_at <= @end'
      params.start = `${startDate} 00:00:00`
      params.end = `${endDate} 23:59:59`
    }

    query += ' ORDER BY created_at DESC LIMIT @limit OFFSET @offset'

    const sales = db.prepare(query).all(params) as any[]

    // Adjuntar los ítems a cada venta encontrada
    return sales.map((sale) => {
      const items = db.prepare(`SELECT * FROM sale_items WHERE sale_id = ?`).all(sale.id)
      return {
        ...sale,
        items,
        timestamp: sale.created_at
      }
    })
  },

  // Cambiar estado a cancelado
  cancelSale: (id: number) => {
    return db.prepare(`UPDATE sales SET status = 'cancelled' WHERE id = ?`).run(id)
  },

  // Restaurar una venta cancelada
  restoreSale: (id: number) => {
    return db.prepare(`UPDATE sales SET status = 'completed' WHERE id = ?`).run(id)
  }
}
