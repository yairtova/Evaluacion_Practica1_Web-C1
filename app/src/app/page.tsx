import Link from 'next/link';

export default function Dashboard() {
  const reportes = [
    { title: "Ranking de Libros", desc: "Los más pedidos (Window Functions)", link: "/reports/ranking", icon: "🏆", color: "bg-blue-500" },
    { title: "Préstamos Vencidos", desc: "Cálculo de multas (CTE + CASE)", link: "/reports/overdue", icon: "⏰", color: "bg-red-500" },
    { title: "Resumen de Multas", desc: "Recaudación mensual (HAVING)", link: "/reports/fines", icon: "💰", color: "bg-green-500" },
    { title: "Actividad de Socios", desc: "Estatus de usuarios (COALESCE)", link: "/reports/members", icon: "👥", color: "bg-purple-500" },
    { title: "Salud de Inventario", desc: "Disponibilidad (CASE)", link: "/reports/inventory", icon: "📚", color: "bg-amber-500" },
  ];

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-800">Sistema de Gestión Bibliotecaria</h1>
        <p className="text-gray-500 mt-2">Panel de Control de Reportes - Evaluación C1</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportes.map((rep) => (
          <Link key={rep.link} href={rep.link} className="block transition-transform hover:scale-105">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 h-full">
              <div className={`${rep.color} text-white p-4 rounded-xl text-2xl`}>
                {rep.icon}
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-800">{rep.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{rep.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <footer className="mt-20 border-t pt-6 text-center text-gray-400 text-xs">
        UPCHIAPAS - Cesar Yair Toledo Villarreal - Ingeniería en Software
      </footer>
    </main>
  );
}