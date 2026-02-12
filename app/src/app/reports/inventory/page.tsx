export const dynamic = 'force-dynamic';
import { getInventoryData } from "@/services/reports";
import Link from 'next/link';

export default async function InventoryPage({ searchParams }: any) {
  const resolvedParams = await Promise.resolve(searchParams);
  const categoria = resolvedParams.categoria || '';
  const currentPage = Number(resolvedParams.page) || 1;
  const limit = 5;

  const { data } = await getInventoryData(categoria, limit, (currentPage - 1) * limit);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/" className="text-sm text-blue-600 hover:underline">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold mt-4">Salud de Inventario</h1>
      <p className="text-gray-600 mb-8">Disponibilidad de ejemplares por categoría bibliográfica.</p>

      <form className="mb-8 flex gap-4 items-center">
        <input type="text" name="categoria" placeholder="Filtrar por categoría" defaultValue={categoria} className="p-2 border rounded-md" />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Aplicar Filtro</button>
      </form>

      <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-md mb-8 inline-block">
        <p className="text-emerald-100 text-sm font-medium uppercase">Categoría más disponible</p>
        <h2 className="text-2xl font-bold">{data[0]?.categoria || 'N/A'}</h2>
        <p className="mt-1">{data[0]?.porcentaje_disponibilidad || 0}% de stock listo</p>
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
              <div className="bg-emerald-500 h-4 rounded-full" style={{ width: `${row.porcentaje_disponibilidad}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2 justify-center">
        {currentPage > 1 && <Link href={`?page=${currentPage - 1}${categoria ? `&categoria=${categoria}` : ''}`} className="px-3 py-1 border rounded hover:bg-gray-50">Anterior</Link>}
        <Link href={`?page=${currentPage + 1}${categoria ? `&categoria=${categoria}` : ''}`} className="px-3 py-1 border rounded hover:bg-gray-50">Siguiente</Link>
      </div>
    </div>
  );
}