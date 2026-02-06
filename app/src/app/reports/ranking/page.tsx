import { query } from '@/lib/db';
import Link from 'next/link';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const searchParamsSchema = z.object({
  q: z.string().optional(),
  page: z.string().optional(),
});

export default async function RankingPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string } | Promise<{ q?: string; page?: string }>;
}) {
  // Asegurarse de que searchParams sea un objeto plano, no una Promise
  const resolvedSearchParams = await Promise.resolve(searchParams);

  console.log('RankingPage: searchParams resueltos:', resolvedSearchParams); // <-- Añadido para depuración

  const { q, page } = searchParamsSchema.parse(resolvedSearchParams);
  const limit = 5;
  const currentPage = Number(page) || 1;
  const offset = (currentPage - 1) * limit;
  const searchTerm = q || '';

  console.log('RankingPage: currentPage:', currentPage, 'offset:', offset, 'searchTerm:', searchTerm); // <-- Añadido para depuración

  const sql = `
    SELECT * FROM vw_most_borrowed_books 
    WHERE titulo_libro ILIKE $1 OR autor_libro ILIKE $1
    LIMIT $2 OFFSET $3
  `;
  
  const res = await query(sql, [`%${searchTerm}%`, limit, offset]);
  const reports = res.rows;

  const totalRes = await query(
    `SELECT COUNT(*) FROM vw_most_borrowed_books WHERE titulo_libro ILIKE $1 OR autor_libro ILIKE $1`,
    [`%${searchTerm}%`]
  );
  const totalReports = totalRes.rows[0].count;
  const totalPages = Math.ceil(totalReports / limit);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline">← Volver al Dashboard</Link>
      
      <h1 className="text-3xl font-bold mt-4">Ranking de Libros</h1>
      <p className="text-gray-600 mb-8">Análisis de popularidad basado en préstamos históricos.</p>

      <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-md mb-8 inline-block min-w-[250px]">
        <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Libro más solicitado</p>
        <h2 className="text-2xl font-bold">{reports[0]?.titulo_libro || 'Sin datos'}</h2>
        <p className="mt-2 text-indigo-200">{reports[0]?.total_prestamos || 0} préstamos totales</p>
      </div>

      <form className="mb-6 flex gap-2">
        <input 
          type="text" 
          name="q" 
          placeholder="Buscar por título o autor..." 
          defaultValue={searchTerm}
          className="border p-2 rounded w-full md:w-80"
        />
        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black">
          Buscar
        </button>
      </form>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posición</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Préstamos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((row) => (
              <tr key={row.titulo_libro} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-indigo-600">#{row.posicion_ranking}</td>
                <td className="px-6 py-4">{row.titulo_libro}</td>
                <td className="px-6 py-4 text-gray-500">{row.autor_libro}</td>
                <td className="px-6 py-4 text-center">{row.total_prestamos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">Mostrando página {currentPage} de {totalPages}</p>
        <div className="flex gap-2">
          {currentPage > 1 && (
            <Link href={`?page=${currentPage - 1}${searchTerm ? `&q=${searchTerm}` : ''}`} className="px-4 py-2 border rounded hover:bg-gray-100">
              Anterior
            </Link>
          )}
          {currentPage < totalPages && (
            <Link href={`?page=${currentPage + 1}${searchTerm ? `&q=${searchTerm}` : ''}`} className="px-4 py-2 border rounded hover:bg-gray-100">
              Siguiente
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}