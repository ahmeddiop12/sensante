import { Users, ClipboardList, AlertTriangle, Brain } from "lucide-react";

interface StatCardProps {
  titre: string;
  valeur: number;
  unite: string;
  couleur?: string;
}

export default function StatCard({ titre, valeur, unite }: StatCardProps) {
  // Déterminer le thème de la carte dynamiquement selon le titre
  const getTheme = () => {
    const t = titre.toLowerCase();
    if (t.includes("patient")) {
      return {
        icon: Users,
        bgColor: "bg-teal-50 text-teal-700 border-teal-100",
        bgHover: "hover:border-teal-300",
        glow: "shadow-teal-100/40 hover:shadow-teal-200/50",
      };
    }
    if (t.includes("consultation")) {
      return {
        icon: ClipboardList,
        bgColor: "bg-amber-50 text-amber-700 border-amber-100",
        bgHover: "hover:border-amber-300",
        glow: "shadow-amber-100/40 hover:shadow-amber-200/50",
      };
    }
    if (t.includes("alerte")) {
      return {
        icon: AlertTriangle,
        bgColor: "bg-rose-50 text-rose-700 border-rose-100",
        bgHover: "hover:border-rose-300",
        glow: "shadow-rose-100/45 hover:shadow-rose-200/50",
        animate: "animate-pulse-slow",
      };
    }
    return {
      icon: Brain,
      bgColor: "bg-purple-50 text-purple-700 border-purple-100",
      bgHover: "hover:border-purple-300",
      glow: "shadow-purple-100/40 hover:shadow-purple-200/50",
    };
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <div className={`glass-card rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${theme.bgHover} ${theme.glow}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {titre}
          </p>
          <p className="text-4xl font-extrabold text-slate-800 tracking-tight mt-2">
            {valeur}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${theme.bgColor}`}>
          <Icon className={`w-6 h-6 ${theme.animate || ""}`} />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-4">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <p className="text-xs font-semibold text-slate-500">{unite}</p>
      </div>
    </div>
  );
}