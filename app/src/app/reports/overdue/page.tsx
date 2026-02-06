import { query } from '@/lib/db';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default async function OverduePage({
  searchParams,
}: {
  searchParams: { min_days?: string };
}) {
  const minDays = Number(searchParams.min_days) || 0;

  const sql = `
    SELECT * FROM vw_overdue_loans 
    WHERE dias_atraso >= $1 
    ORDER BY dias_atraso DESC
  `;
  const res = await query(sql, [minDays]);
  const reports = res.rows;

  const totalMultas = reports.reduce((acc: number, curr: any) => acc + Number(curr.multa_sugerida), 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/" className="text-sm text-blue-600 hover:underline">← Volver al Dashboard</Link>
      
      <h1 className="text-3xl font-bold mt-4">Préstamos Vencidos</h1>
      <p className="text-gray-600 mb-8">Análisis de morosidad y multas proyectadas.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700 text-sm font-bold uppercase">Casos Detectados</p>
          <p className="text-3xl font-black text-red-900">{reports.length}</p>
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
          <p className="text-amber-700 text-sm font-bold uppercase">Multas Proyectadas</p>
          <p className="text-3xl font-black text-amber-900">${totalMultas.toFixed(2)}</p>
        </div>
      </div>

      <form className="mb-6 flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
        <label className="font-medium text-gray-700">Mínimo de días de atraso:</label>
        <input 
          type="number" 
          name="min_days" 
          defaultValue={minDays}
          className="border p-2 rounded w-24"
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Filtrar
        </button>
      </form>

      <div className="overflow-hidden border rounded-lg shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Socio</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Libro</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Días Atraso</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Multa Sugerida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((row: any) => (
              <tr key={row.loan_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{row.socio}</td>
                <td className="px-4 py-3">{row.libro}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${row.dias_atraso > 15 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {row.dias_atraso} días
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-900">${row.multa_sugerida}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {reports.length === 0 && (
          <p className="text-center py-10 text-gray-500">No se encontraron préstamos vencidos con ese criterio.</p>
        )}
      </div>
    </div>
  );
}