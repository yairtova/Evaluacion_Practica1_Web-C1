import { query } from '@/lib/db';

// 1. Ranking de Libros
export async function getRankingData(searchTerm: string, limit: number, offset: number) {
  const sql = `SELECT * FROM vw_most_borrowed_books WHERE titulo_libro ILIKE $1 OR autor_libro ILIKE $1 LIMIT $2 OFFSET $3`;
  const res = await query(sql, [`%${searchTerm}%`, limit, offset]);
  
  const totalRes = await query(`SELECT COUNT(*) FROM vw_most_borrowed_books WHERE titulo_libro ILIKE $1 OR autor_libro ILIKE $1`, [`%${searchTerm}%`]);
  
  return { data: res.rows, total: parseInt(totalRes.rows[0].count) };
}

// 2. Préstamos Vencidos
export async function getOverdueData(minDays: number, limit: number, offset: number) {
  const sql = `SELECT * FROM vw_overdue_loans WHERE dias_atraso >= $1 ORDER BY dias_atraso DESC LIMIT $2 OFFSET $3`;
  const res = await query(sql, [minDays, limit, offset]);
  return { data: res.rows };
}

// 3. Resumen de Multas
export async function getFinesData(year: string, limit: number, offset: number) {
  const sql = `SELECT * FROM vw_fines_summary WHERE mes_reporte LIKE $1 || '-%' ORDER BY mes_reporte DESC LIMIT $2 OFFSET $3`;
  const res = await query(sql, [year, limit, offset]);
  
  const totalRes = await query(`SELECT COUNT(*) FROM vw_fines_summary WHERE mes_reporte LIKE $1 || '-%'`, [year]);
  
  return { data: res.rows, total: parseInt(totalRes.rows[0].count) };
}

// 4. Actividad de Socios
export async function getMembersData(name: string, limit: number, offset: number) {
  const sql = `SELECT * FROM vw_member_activity WHERE nombre_socio ILIKE $1 LIMIT $2 OFFSET $3`;
  const res = await query(sql, [`%${name}%`, limit, offset]);
  return { data: res.rows };
}

// 5. Salud de Inventario
export async function getInventoryData(cat: string, limit: number, offset: number) {
  const sql = cat 
    ? `SELECT * FROM vw_inventory_health WHERE categoria ILIKE $1 LIMIT $2 OFFSET $3`
    : `SELECT * FROM vw_inventory_health LIMIT $1 OFFSET $2`;
  
  const values = cat ? [`%${cat}%`, limit, offset] : [limit, offset];
  const res = await query(sql, values);
  return { data: res.rows };
}