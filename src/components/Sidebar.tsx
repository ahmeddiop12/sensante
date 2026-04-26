"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const liens = [
  { nom: "Accueil",       href: "/",              icone: "H" },
  { nom: "Patients",      href: "/patients",      icone: "P" },
  { nom: "Consultations", href: "/consultations", icone: "C" },
  { nom: "Dashboard",     href: "/dashboard",     icone: "D" },
  { nom: "Profil",        href: "/profil",        icone: "U" },
  { nom: "IA",            href: "/ia",            icone: "A" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-teal-800 text-white min-h-screen p-4">
      <div className="mb-6 px-4">
        <h2 className="text-lg font-bold tracking-wide text-teal-200">
          SénSanté
        </h2>
        <p className="text-xs text-teal-400">Navigation</p>
      </div>

      <nav className="space-y-2">
        {liens.map((lien) => {
          const actif = pathname === lien.href;
          return (
            <Link
              key={lien.href}
              href={lien.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${actif
                  ? "bg-teal-600 font-bold shadow-md"
                  : "hover:bg-teal-700 text-teal-100"
                }`}
            >
              <span className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                {lien.icone}
              </span>
              <span>{lien.nom}</span>
              {actif && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}