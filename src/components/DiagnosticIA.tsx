"use client";
import { useState } from "react";
import { Brain, Sparkles, AlertOctagon, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";

interface DiagnosticIAProps {
  consultationId: number;
  diagnosticExistant: string | null;
  confianceExistante: number | null;
  onDiagnostic: () => void;
}

export default function DiagnosticIA({
  consultationId, diagnosticExistant, confianceExistante, onDiagnostic
}: DiagnosticIAProps) {

  const [loading, setLoading] = useState(false);
  const [resultat, setResultat] = useState<{
    diagnostic: string; confiance: number; recommandation: string; urgence: string;
  } | null>(null);

  async function lancer() {
    setLoading(true);
    try {
      const res = await fetch("/api/ia/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultationId }),
      });
      if (res.ok) {
        const data = await res.json();
        setResultat(data);
        onDiagnostic();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const getUrgencyTheme = (urgence: string) => {
    switch (urgence?.toLowerCase()) {
      case "urgent":
        return {
          wrapper: "border-rose-200 bg-rose-50/40 text-rose-800",
          badge: "bg-rose-100 text-rose-700 border-rose-200",
          bar: "bg-rose-500",
          icon: AlertOctagon,
        };
      case "moyen":
        return {
          wrapper: "border-amber-200 bg-amber-50/30 text-amber-800",
          badge: "bg-amber-100 text-amber-700 border-amber-200",
          bar: "bg-amber-500",
          icon: AlertTriangle,
        };
      case "faible":
      default:
        return {
          wrapper: "border-teal-200 bg-teal-50/20 text-teal-800",
          badge: "bg-teal-100 text-teal-700 border-teal-200",
          bar: "bg-teal-500",
          icon: ShieldCheck,
        };
    }
  };

  // Diagnostic déjà existant en BDD
  if (diagnosticExistant) {
    const isUrgent = diagnosticExistant.toLowerCase().includes("urgent") || diagnosticExistant.toLowerCase().includes("suspicion");
    const theme = getUrgencyTheme(isUrgent ? "urgent" : "faible");

    return (
      <div className={`mt-4 p-4 rounded-xl border ${theme.wrapper} flex flex-col gap-2.5`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Brain className="w-4 h-4 text-teal-600" />
            <span>Diagnostic IA Existant</span>
          </div>
          <span className="flex items-center gap-0.5 text-[9px] font-bold text-teal-600 bg-teal-50 border border-teal-100 px-1.5 py-0.5 rounded">
            <Sparkles className="w-3 h-3 text-teal-500" />
            <span>Enregistré</span>
          </span>
        </div>
        <p className="text-sm text-slate-700 font-medium leading-relaxed">{diagnosticExistant}</p>
        {confianceExistante !== null && (
          <div className="mt-1">
            <div className="flex justify-between items-center text-[11px] text-slate-500 mb-1">
              <span>Confiance IA</span>
              <span className="font-bold">{confianceExistante}%</span>
            </div>
            <div className="w-full bg-slate-200/50 rounded-full h-1.5">
              <div className={`h-1.5 rounded-full ${theme.bar}`} style={{ width: `${confianceExistante}%` }} />
            </div>
          </div>
        )}
      </div>
    );
  }

  const resultTheme = resultat ? getUrgencyTheme(resultat.urgence) : null;
  const ResultIcon = resultTheme ? resultTheme.icon : null;

  return (
    <div className="mt-4">
      {!resultat ? (
        <button
          onClick={lancer}
          disabled={loading}
          className="relative overflow-hidden group flex items-center gap-2 text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-750 text-white px-4.5 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:shadow-lg transition-all duration-300 disabled:opacity-75 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
              <span>Génération du diagnostic...</span>
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Analyser avec l'IA</span>
              <Sparkles className="w-3 h-3 absolute top-1 right-1 opacity-60 group-hover:animate-ping" />
            </>
          )}
        </button>
      ) : (
        <div className={`p-5 rounded-2xl border ${resultTheme?.wrapper} transition-all duration-305`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center shadow-sm">
                <Brain className="w-4.5 h-4.5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Diagnostic IA Généré</h4>
                <p className="text-[10px] text-slate-500">Analyse Llama-3 en temps réel</p>
              </div>
            </div>
            {ResultIcon && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${resultTheme?.badge}`}>
                <ResultIcon className="w-3 h-3" />
                <span>{resultat.urgence.toUpperCase()}</span>
              </span>
            )}
          </div>

          <div className="mt-4 space-y-3">
            <div className="bg-white/50 p-3.5 rounded-xl border border-white/80">
              <p className="text-sm text-slate-700 leading-relaxed font-semibold">{resultat.diagnostic}</p>
            </div>
            
            {resultat.recommandation && (
              <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/40">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recommandations</p>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{resultat.recommandation}</p>
              </div>
            )}

            <div className="mt-1 pt-1">
              <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                <span>Indice de confiance</span>
                <span className="font-bold text-slate-700">{resultat.confiance}%</span>
              </div>
              <div className="w-full bg-slate-200/50 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${resultTheme?.bar}`} style={{ width: `${resultat.confiance}%` }} />
              </div>
            </div>
          </div>

          <p className="text-[9px] text-slate-500 italic mt-4 text-center leading-none">
            Ceci n'est pas un diagnostic médical. Veuillez valider cliniquement.
          </p>
        </div>
      )}
    </div>
  );
}