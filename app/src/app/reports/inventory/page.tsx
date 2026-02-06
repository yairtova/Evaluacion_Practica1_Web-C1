import { query } from '@/lib/db';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const res = await query('SELECT * FROM vw_inventory_health');
  const data = res.rows;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/" className="text-sm text-blue-600 hover:underline">← Volver al Dashboard</Link>
      
      <h1 className="text-3xl font-bold mt-4">Salud de Inventario</h1>
      <p className="text-gray-600 mb-8">Disponibilidad de ejemplares por categoría bibliográfica.</p>

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
    </div>
  );
}