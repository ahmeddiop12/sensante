"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, ClipboardList, Activity, User } from "lucide-react";

const liens = [
  { nom: "Accueil", href: "/", icone: Home },
  { nom: "Patients", href: "/patients", icone: Users },
  { nom: "Consultations", href: "/consultations", icone: ClipboardList },
  { nom: "Dashboard", href: "/dashboard", icone: Activity },
  { nom: "Profil", href: "/profil", icone: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-sidebar min-h-[calc(100vh-73px)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-4 py-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-teal-200/60">
            Navigation principale
          </p>
        </div>

        <nav className="space-y-1.5">
          {liens.map((lien) => {
            const actif = pathname === lien.href;
            const Icon = lien.icone;
            return (
              <Link
                key={lien.href}
                href={lien.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${actif
                    ? "bg-white/10 text-white font-semibold border-l-4 border-teal-300 shadow-sm"
                    : "hover:bg-white/5 text-teal-100/90 hover:text-white"
                  }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105
                  ${actif ? "text-teal-300" : "text-teal-200/80 group-hover:text-teal-100"}`} 
                />
                <span className="text-sm tracking-wide">{lien.nom}</span>
                {actif && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="text-xs text-teal-200/80 font-medium">Assistant Connecté</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <p className="text-[10px] text-teal-300 font-semibold uppercase tracking-wider">Service Actif</p>
        </div>
      </div>
    </aside>
  );
}