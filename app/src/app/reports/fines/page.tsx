import { query } from '@/lib/db';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default async function FinesPage() {
  const res = await query('SELECT * FROM vw_fines_summary');
  const fines = res.rows;

  const totalRecaudado = fines.reduce((acc: number, curr: any) => acc + Number(curr.total_monto), 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold mt-4">Resumen de Multas</h1>
      <p className="text-gray-600 mb-8">Informe mensual de ingresos y efectividad de cobro.</p>

      <div className="bg-amber-500 text-white p-5 rounded-lg shadow mb-6 inline-block">
        <p className="text-xs uppercase font-bold opacity-80">Monto Total en Multas</p>
        <p className="text-2xl font-black">${totalRecaudado.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fines.map((f: any) => (
          <div key={f.mes_reporte} className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="font-bold text-gray-800 border-b pb-2 mb-2">{f.mes_reporte}</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Monto:</span>
              <span className="font-bold text-gray-900">${f.total_monto}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Multas:</span>
              <span>{f.total_multas}</span>
            </div>
            <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${f.porcentaje_pagado}%` }}></div>
            </div>
            <p className="text-[10px] text-right mt-1 text-gray-400">Eficiencia de cobro: {f.porcentaje_pagado}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}