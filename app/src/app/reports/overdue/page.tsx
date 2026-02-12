export const dynamic = 'force-dynamic';
import { getOverdueData } from "@/services/reports";
import Link from 'next/link';

export default async function OverduePage({ searchParams }: any) {
  const resolvedParams = await Promise.resolve(searchParams);
  const minDays = Number(resolvedParams.min_days) || 0;
  const page = Number(resolvedParams.page) || 1;
  const { data: reports } = await getOverdueData(minDays, 5, (page - 1) * 5);
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
        <label className="font-medium">Mínimo días de atraso:</label>
        <input type="number" name="min_days" defaultValue={minDays} className="border p-2 rounded w-24" />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Filtrar</button>
      </form>

      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr><th className="p-3 text-left">Socio</th><th className="p-3 text-left">Libro</th><th className="p-3 text-center">Atraso</th><th className="p-3 text-right">Multa</th></tr>
        </thead>
        <tbody className="divide-y">
          {reports.map((row: any) => (
            <tr key={row.loan_id} className="hover:bg-gray-50 text-sm">
              <td className="p-3 font-medium">{row.socio}</td>
              <td className="p-3">{row.libro}</td>
              <td className="p-3 text-center">
                <span className={`px-2 py-1 rounded-full ${row.dias_atraso > 15 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {row.dias_atraso} días
                </span>
              </td>
              <td className="p-3 text-right font-mono">${row.multa_sugerida}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex gap-2 justify-center">
        {page > 1 && <Link href={`?page=${page - 1}&min_days=${minDays}`} className="px-3 py-1 border rounded">Anterior</Link>}
        <Link href={`?page=${page + 1}&min_days=${minDays}`} className="px-3 py-1 border rounded">Siguiente</Link>
      </div>
    </div>
  );
}