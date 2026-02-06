import { query } from '@/lib/db';
import Link from 'next/link';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const searchParamsSchema = z.object({
  page: z.string().optional(),
  nombre_socio: z.string().optional(),
});

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { page?: string; nombre_socio?: string } | Promise<{ page?: string; nombre_socio?: string }>;
}) {
  // Asegurarse de que searchParams sea un objeto plano, no una Promise
  const resolvedSearchParams = await Promise.resolve(searchParams);

  console.log('MembersPage: searchParams resueltos:', resolvedSearchParams); // <-- Añadido para depuración

  const { page, nombre_socio } = searchParamsSchema.parse(resolvedSearchParams);
  const limit = 5;
  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * limit;

  let sql = 'SELECT * FROM vw_member_activity';
  const params: (string | number)[] = [];
  let paramIndex = 1;

  if (nombre_socio) {
    sql += ` WHERE nombre_socio ILIKE $${paramIndex}`;
    params.push(`%${nombre_socio}%`);
    paramIndex++;
  }

  sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const res = await query(sql, params);
  const members = res.rows;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold mt-4">Actividad de Socios</h1>
      <p className="text-gray-600 mb-8">Análisis del compromiso y uso de la biblioteca por parte de los socios.</p>

      <form method="GET" className="mb-8 flex gap-4 items-center">
        <input
          type="text"
          name="nombre_socio"
          placeholder="Filtrar por nombre de socio"
          defaultValue={nombre_socio || ''}
          className="p-2 border rounded-md"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Aplicar Filtro
        </button>
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
        {currentPage > 1 && <Link href={`?page=${currentPage - 1}${nombre_socio ? `&nombre_socio=${nombre_socio}` : ''}`} className="px-3 py-1 bg-white border rounded hover:bg-gray-50">Anterior</Link>}
        <Link href={`?page=${currentPage + 1}${nombre_socio ? `&nombre_socio=${nombre_socio}` : ''}`} className="px-3 py-1 bg-white border rounded hover:bg-gray-50">Siguiente</Link>
      </div>
    </div>
  );
}