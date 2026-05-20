import { Sparkles, AlertOctagon, AlertTriangle, ShieldCheck } from "lucide-react";

interface AlerteIAProps {
  diagnostic: string;
  confiance: number;
  niveau: "faible" | "moyen" | "urgent";
}

export default function AlerteIA({
  diagnostic,
  confiance,
  niveau
}: AlerteIAProps) {
  const getTheme = () => {
    switch (niveau) {
      case "urgent":
        return {
          wrapper: "border-rose-200 bg-rose-50/50 shadow-rose-100/40 animate-glow-red",
          icon: AlertOctagon,
          iconColor: "text-rose-600",
          badge: "bg-rose-100 text-rose-700 border-rose-200",
          barColor: "bg-rose-500",
          title: "Alerte Urgence IA",
        };
      case "moyen":
        return {
          wrapper: "border-amber-200 bg-amber-50/40 shadow-amber-100/40",
          icon: AlertTriangle,
          iconColor: "text-amber-600",
          badge: "bg-amber-100 text-amber-700 border-amber-200",
          barColor: "bg-amber-500",
          title: "Vigilance Recommandée",
        };
      case "faible":
      default:
        return {
          wrapper: "border-teal-200 bg-teal-50/30 shadow-teal-100/30",
          icon: ShieldCheck,
          iconColor: "text-teal-600",
          badge: "bg-teal-100 text-teal-700 border-teal-200",
          barColor: "bg-teal-500",
          title: "Analyse Stable",
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <div className={`glass-card rounded-2xl p-6 border shadow-sm transition-all duration-300 ${theme.wrapper}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border shadow-sm shrink-0">
            <Icon className={`w-5 h-5 ${theme.iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-base">{theme.title}</h3>
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>IA</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Analyse prédictive algorithmique</p>
          </div>
        </div>

        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${theme.badge}`}>
          {niveau}
        </span>
      </div>

      <div className="mt-4 bg-white/60 p-4 rounded-xl border border-white/80">
        <p className="text-sm text-slate-700 leading-relaxed font-medium">{diagnostic}</p>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5">
          <span className="font-medium">Indice de confiance</span>
          <span className="font-bold text-slate-700">{confiance}%</span>
        </div>
        <div className="w-full bg-slate-200/60 rounded-full h-2">
          <div className={`h-2 rounded-full transition-all duration-500 ${theme.barColor}`} style={{ width: `${confiance}%` }} />
        </div>
      </div>

      <p className="text-[10px] text-slate-500 italic mt-4 text-center">
        Note : Ceci est une assistance d'aide à la décision clinique et ne constitue pas un avis médical définitif.
      </p>
    </div>
  );
}
