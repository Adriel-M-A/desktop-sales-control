import { db } from '../database/client'

export const StatsService = {
  // Obtener estadísticas generales para los cuadros del dashboard
  getDashboardStats: (startDate: string, endDate: string) => {
    const start = `${startDate} 00:00:00`
    const end = `${endDate} 23:59:59`
    const queryBase = `FROM sales WHERE created_at >= @start AND created_at <= @end`

    // Ingresos totales de ventas completadas
    const income = db
      .prepare(`SELECT SUM(total_amount) as total ${queryBase} AND status = 'completed'`)
      .get({ start, end }) as any

    // Cantidad de ventas completadas
    const count = db
      .prepare(`SELECT COUNT(*) as total ${queryBase} AND status = 'completed'`)
      .get({ start, end }) as any

    // Estadísticas de ventas canceladas
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
  },

  // Obtener los productos más vendidos en un periodo
  getTopProducts: (startDate: string, endDate: string) => {
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
  },

  // Generar datos para el gráfico de ventas (agrupados por hora, día o mes)
  getSalesChart: (startDate: string, endDate: string) => {
    const [sy, sm, sd] = startDate.split('-').map(Number)
    const [ey, em, ed] = endDate.split('-').map(Number)

    const start = new Date(sy, sm - 1, sd, 0, 0, 0, 0)
    const end = new Date(ey, em - 1, ed, 23, 59, 59, 999)

    const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    let groupBy = ''
    let step: 'hour' | 'day' | 'month' = 'day'

    if (diffDays <= 2) {
      step = 'hour'
      groupBy = `strftime('%Y-%m-%d %H', created_at)`
    } else if (diffDays <= 90) {
      step = 'day'
      groupBy = `strftime('%Y-%m-%d', created_at)`
    } else {
      step = 'month'
      groupBy = `strftime('%Y-%m', created_at)`
    }

    const rows = db
      .prepare(
        `
      SELECT ${groupBy} as dateKey, SUM(total_amount) as total
      FROM sales
      WHERE status = 'completed'
      AND created_at >= @startStr AND created_at <= @endStr
      GROUP BY dateKey
      ORDER BY dateKey ASC
    `
      )
      .all({
        startStr: `${startDate} 00:00:00`,
        endStr: `${endDate} 23:59:59`
      }) as any[]

    // Lógica de llenado de huecos para que el gráfico sea continuo
    const filledData: any[] = []
    const current = new Date(start)

    while (current <= end) {
      let key = ''
      let label = ''

      const y = current.getFullYear()
      const m = String(current.getMonth() + 1).padStart(2, '0')
      const d = String(current.getDate()).padStart(2, '0')
      const h = String(current.getHours()).padStart(2, '0')

      if (step === 'hour') {
        key = `${y}-${m}-${d} ${h}`
        label = `${h}:00`
        current.setHours(current.getHours() + 1)
      } else if (step === 'day') {
        key = `${y}-${m}-${d}`
        label = `${d}/${m}`
        current.setDate(current.getDate() + 1)
      } else {
        key = `${y}-${m}`
        const months = [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic'
        ]
        label = `${months[current.getMonth()]} ${y}`
        current.setMonth(current.getMonth() + 1)
        current.setDate(1)
      }

      const found = rows.find((r) => r.dateKey === key)
      filledData.push({ date: label, originalDate: key, total: found ? found.total : 0 })
    }

    return filledData
  }
}
