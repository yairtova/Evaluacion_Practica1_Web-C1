import Link from 'next/link';

export default function Dashboard() {
  const reports = [
    { name: 'Ranking de Libros', path: '/reports/ranking', desc: 'Más prestados' },
    { name: 'Morosidad', path: '/reports/overdue', desc: 'Préstamos vencidos' },
    { name: 'Multas', path: '/reports/fines', desc: 'Resumen mensual' },
    { name: 'Actividad de Socios', path: '/reports/members', desc: 'Uso de biblioteca' },
    { name: 'Inventario', path: '/reports/inventory', desc: 'Salud de stock' },
  ];

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-2 text-indigo-900">Biblioteca Central</h1>
      <p className="text-gray-600 mb-10">Panel de Administración y Reportes SQL</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Link key={report.path} href={report.path} 
                className="p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600">{report.name}</h2>
            <p className="text-gray-500 text-sm mt-2">{report.desc}</p>
            <div className="mt-4 text-indigo-500 font-medium text-sm">Ver reporte →</div>
          </Link>
        ))}
      </div>
    </main>
  );
}