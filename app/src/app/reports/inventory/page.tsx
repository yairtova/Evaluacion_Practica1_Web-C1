import { query } from '@/lib/db';
import Link from 'next/link';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const searchParamsSchema = z.object({
  page: z.string().optional(),
  categoria: z.string().optional(),
});

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { page?: string; categoria?: string } | Promise<{ page?: string; categoria?: string }>;
}) {
  // Asegurarse de que searchParams sea un objeto plano, no una Promise
  const resolvedSearchParams = await Promise.resolve(searchParams);

  console.log('InventoryPage: searchParams resueltos:', resolvedSearchParams); // <-- Añadido para depuración

  const { page, categoria } = searchParamsSchema.parse(resolvedSearchParams);
  const limit = 5;
  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * limit;

  let sql = 'SELECT * FROM vw_inventory_health';
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (categoria) {
    sql += ` WHERE categoria ILIKE $${paramIndex}`;
    params.push(`%${categoria}%`);
    paramIndex++;
  }

  sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const res = await query(sql, params);
  const data = res.rows;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/" className="text-sm text-blue-600 hover:underline">← Volver al Dashboard</Link>
      
      <h1 className="text-3xl font-bold mt-4">Salud de Inventario</h1>
      <p className="text-gray-600 mb-8">Disponibilidad de ejemplares por categoría bibliográfica.</p>

      <form method="GET" className="mb-8 flex gap-4 items-center">
        <input
          type="text"
          name="categoria"
          placeholder="Filtrar por categoría"
          defaultValue={categoria || ''}
          className="p-2 border rounded-md"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Aplicar Filtro
        </button>
      </form>

      <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-md mb-8 inline-block">
        <p className="text-emerald-100 text-sm font-medium uppercase">Categoría más disponible</p>
        <h2 className="text-2xl font-bold">{data[0]?.categoria || 'N/A'}</h2>
        <p className="mt-1">{data[0]?.porcentaje_disponibilidad}% de stock listo</p>
      </div>

      <div className="grid gap-6">
        {data.map((row: any) => (
          <div key={row.categoria} className="border p-6 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{row.categoria}</h3>
                <p className="text-gray-500">Total: {row.stock_total} ejemplares</p>
              </div>
              <span className="text-2xl font-black text-emerald-600">{row.porcentaje_disponibilidad}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-emerald-500 h-4 rounded-full transition-all" 
                style={{ width: `${row.porcentaje_disponibilidad}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">Basado en COALESCE para valores nulos</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2 justify-center">
        {currentPage > 1 && <Link href={`?page=${currentPage - 1}${categoria ? `&categoria=${categoria}` : ''}`} className="px-3 py-1 bg-white border rounded hover:bg-gray-50">Anterior</Link>}
        <Link href={`?page=${currentPage + 1}${categoria ? `&categoria=${categoria}` : ''}`} className="px-3 py-1 bg-white border rounded hover:bg-gray-50">Siguiente</Link>
      </div>
    </div>
  );
}