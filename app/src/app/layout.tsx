import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de Biblioteca | Evaluación C1",
  description: "Gestión de reportes avanzados de biblioteca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.className} antialiased bg-gray-50`}>
        <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">🏠</span>
              <span className="font-bold text-lg tracking-tight">Biblioteca Dashboard</span>
            </Link>
            
            <div className="flex gap-6 text-sm font-medium">
              <Link href="/reports/ranking" className="hover:text-blue-400 transition-colors">Ranking</Link>
              <Link href="/reports/overdue" className="hover:text-red-400 transition-colors">Vencidos</Link>
              <Link href="/reports/fines" className="hover:text-green-400 transition-colors">Multas</Link>
              <Link href="/reports/members" className="hover:text-purple-400 transition-colors">Socios</Link>
              <Link href="/reports/inventory" className="hover:text-amber-400 transition-colors">Inventario</Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}