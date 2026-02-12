export const dynamic = 'force-dynamic';
import { getFinesData } from "@/services/reports";
import Link from 'next/link';

export default async function FinesPage({ searchParams }: any) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const currentYear = resolvedSearchParams.year || new Date().getFullYear().toString();
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const limit = 5;

  // Llamada al servicio 
  const { data: fines, total } = await getFinesData(currentYear, limit, (currentPage - 1) * limit);
  const totalPages = Math.ceil(total / limit);
  const totalRecaudado = fines.reduce((acc: number, curr: any) => acc + Number(curr.total_monto), 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold mt-4">Resumen de Multas</h1>
      <p className="text-gray-600 mb-8">Informe mensual de ingresos y efectividad de cobro.</p>

      <form className="mb-6 flex gap-2">
        <input type="number" name="year" placeholder="Filtrar por año" defaultValue={currentYear} className="border p-2 rounded w-full md:w-60" />
        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black">Filtrar</button>
      </form>

      <div className="bg-amber-500 text-white p-5 rounded-lg shadow mb-6 inline-block">
        <p className="text-xs uppercase font-bold opacity-80">Monto Total en Multas ({currentYear})</p>
        <p className="text-2xl font-black">${totalRecaudado.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fines.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No hay multas para el año {currentYear}.</p>
        ) : (
          fines.map((f: any) => (
            <div key={f.mes_reporte} className="p-4 border rounded-lg bg-white shadow-sm">
              <h3 className="font-bold text-gray-800 border-b pb-2 mb-2">{f.mes_reporte}</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Monto:</span>
                <span className="font-bold text-gray-900">${f.total_monto}</span>
              </div>
              <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${f.porcentaje_pagado}%` }}></div>
              </div>
              <p className="text-[10px] text-right mt-1 text-gray-400">Eficiencia de cobro: {f.porcentaje_pagado}%</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">Página {currentPage} de {totalPages}</p>
        <div className="flex gap-2">
          {currentPage > 1 && <Link href={`?page=${currentPage - 1}&year=${currentYear}`} className="px-4 py-2 border rounded hover:bg-gray-100">Anterior</Link>}
          {currentPage < totalPages && <Link href={`?page=${currentPage + 1}&year=${currentYear}`} className="px-4 py-2 border rounded hover:bg-gray-100">Siguiente</Link>}
        </div>
      </div>
    </div>
  );
}