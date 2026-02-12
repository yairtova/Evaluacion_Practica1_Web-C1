export const dynamic = 'force-dynamic';
import { getMembersData } from "@/services/reports";
import Link from 'next/link';

export default async function MembersPage({ searchParams }: any) {
  const resolvedParams = await Promise.resolve(searchParams);
  const nombre = resolvedParams.nombre_socio || '';
  const page = Number(resolvedParams.page) || 1;
  const { data: members } = await getMembersData(nombre, 5, (page - 1) * 5);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold mt-4">Actividad de Socios</h1>
      <p className="text-gray-600 mb-8">Análisis del compromiso y uso de la biblioteca.</p>

      <form className="mb-8 flex gap-4 items-center">
        <input type="text" name="nombre_socio" placeholder="Nombre de socio" defaultValue={nombre} className="p-2 border rounded-md" />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Aplicar Filtro</button>
      </form>

      <div className="bg-blue-600 text-white p-5 rounded-lg shadow mb-6 inline-block">
        <p className="text-xs uppercase font-bold opacity-80">Socio más frecuente</p>
        <p className="text-xl font-black">{members[0]?.nombre_socio || 'N/A'}</p>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Préstamos</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Estatus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((m: any) => (
              <tr key={m.nombre_socio}>
                <td className="px-6 py-4 font-medium">{m.nombre_socio}</td>
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
        {page > 1 && <Link href={`?page=${page - 1}${nombre ? `&nombre_socio=${nombre}` : ''}`} className="px-3 py-1 border rounded">Anterior</Link>}
        <Link href={`?page=${page + 1}${nombre ? `&nombre_socio=${nombre}` : ''}`} className="px-3 py-1 border rounded">Siguiente</Link>
      </div>
    </div>
  );
}