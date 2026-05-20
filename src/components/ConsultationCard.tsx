import { Calendar, User, CheckCircle2, AlertCircle } from "lucide-react";

interface ConsultationCardProps {
  patient: string;
  date: string;
  symptomes: string;
  statut: "en_attente" | "termine";
}

export default function ConsultationCard({
  patient,
  date,
  symptomes,
  statut
}: ConsultationCardProps) {
  const isTerminated = statut === "termine";
  const badgesList = symptomes.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-inner">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">{patient}</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{date}</span>
            </div>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
          isTerminated 
            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
            : "bg-amber-50 text-amber-700 border-amber-200"
        }`}>
          {isTerminated ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Terminé</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>En attente</span>
            </>
          )}
        </span>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100/60">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Symptômes signalés</p>
        <div className="flex flex-wrap gap-1.5">
          {badgesList.map((badge, idx) => (
            <span key={idx} className="bg-slate-100/70 text-slate-700 text-xs px-2.5 py-1 rounded-lg border border-slate-200/50">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
