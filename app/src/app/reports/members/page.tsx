import { query } from '@/lib/db';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default async function MembersPage({ searchParams }: { searchParams: { page?: string } }) {
  const limit = 5;
  const page = Number(searchParams.page) || 1;
  const offset = (page - 1) * limit;

  const res = await query('SELECT * FROM vw_member_activity LIMIT $1 OFFSET $2', [limit, offset]);
  const members = res.rows;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold mt-4">Actividad de Socios</h1>
      <p className="text-gray-600 mb-8">Análisis del compromiso y uso de la biblioteca por parte de los socios.</p>

      <div className="bg-blue-600 text-white p-5 rounded-lg shadow mb-6 inline-block">
        <p className="text-xs uppercase font-bold opacity-80">Socio más frecuente</p>
        <p className="text-xl font-black">{members[0]?.nombre_socio || 'N/A'}</p>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Préstamos</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Estatus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((m: any) => (
              <tr key={m.nombre_socio}>
                <td className="px-6 py-4 font-medium">{m.nombre_socio}</td>
                <td className="px-6 py-4 text-gray-500">{m.tipo}</td>
                <td className="px-6 py-4 text-center">{m.total_prestamos}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${m.estatus_actividad === 'Muy Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {m.estatus_actividad}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-2 justify-center">
        {page > 1 && <Link href={`?page=${page - 1}`} className="px-3 py-1 bg-white border rounded hover:bg-gray-50">Anterior</Link>}
        <Link href={`?page=${page + 1}`} className="px-3 py-1 bg-white border rounded hover:bg-gray-50">Siguiente</Link>
      </div>
    </div>
  );
}