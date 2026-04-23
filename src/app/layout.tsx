import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SénSanté",
  description: "Assistant de santé communautaire avec IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">

          {/* Header permanent en haut */}
          <Header />

          <div className="flex flex-1">

            {/* Sidebar permanente à gauche */}
            <Sidebar />

            {/* Contenu de la page — change à chaque navigation */}
            <main className="flex-1 bg-gray-50 p-8 overflow-y-auto">
              {children}
            </main>

          </div>
        </div>
      </body>
    </html>
  );
}