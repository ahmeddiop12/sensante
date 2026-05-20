"use client";

import { useEffect, useState } from "react";
import ConsultationForm from "@/components/ConsultationForm";
import DiagnosticIA from "@/components/DiagnosticIA";
import { ClipboardList, Search, Activity, Loader2, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

interface Consultation {
  id: number;
  date: string;
  symptomes: string[];
  diagnosticIa: string | null;
  confiance: number | null;
  statut: string;
  notes: string | null;
  patient: {
    nom: string;
    prenom: string;
    region: string;
  };
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState("");

  async function charger() {
    try {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (!session?.user) {
        console.error("Pas de session active");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/consultations");
      const data = await res.json();

      if (Array.isArray(data)) {
        setConsultations(data);
      } else {
        console.error("Format invalide :", data);
        setConsultations([]);
      }
    } catch (error) {
      console.error("Erreur :", error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    charger();
  }, []);

  const consultationsFiltrees = consultations.filter((c) => {
    const nomComplet = `${c.patient.prenom} ${c.patient.nom}`.toLowerCase();
    const query = recherche.toLowerCase();
    const matchesPatient = nomComplet.includes(query) || c.patient.region.toLowerCase().includes(query);
    const matchesSymptomes = c.symptomes.some((s) => s.toLowerCase().includes(query));
    return matchesPatient || matchesSymptomes;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-805 tracking-tight flex items-center gap-2.5">
          <ClipboardList className="w-7 h-7 text-teal-650" />
          <span>Consultations</span>
          <span className="text-xs px-2.5 py-1 bg-teal-50 border border-teal-150 text-teal-700 font-bold rounded-full">
            {consultations.length} au total
          </span>
        </h1>
        <p className="text-sm text-slate-405 mt-1">Gérez les consultations cliniques et lancez les diagnostics d'aide à la décision IA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Formulaire à gauche */}
        <div className="lg:col-span-1">
          <ConsultationForm onSuccess={charger} />
        </div>

        {/* Liste à droite */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher par patient, région ou symptôme..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none bg-slate-50/50 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-slate-500" />
            <span>Historique des consultations ({consultationsFiltrees.length})</span>
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <p className="text-sm text-slate-400 font-medium">Chargement des consultations...</p>
            </div>
          ) : consultationsFiltrees.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
              <p className="text-slate-405 font-medium text-sm">Aucune consultation correspondante.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {consultationsFiltrees.map((c) => {
                const isTerminated = c.statut === "termine";
                return (
                  <div
                    key={c.id}
                    className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">
                          {c.patient.prenom} {c.patient.nom}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-450 mt-1">
                          <span>{c.patient.region}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{new Date(c.date).toLocaleDateString("fr-FR")}</span>
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
                        isTerminated 
                          ? "bg-emerald-55 bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-amber-55 bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {isTerminated ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Terminé</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-amber-650 animate-pulse" />
                            <span>En attente</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100/60">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Symptômes signalés</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.symptomes.map((s, i) => (
                          <span
                            key={i}
                            className="bg-slate-50 text-slate-600 text-xs px-2.5 py-1 rounded-lg border border-slate-200/50"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {c.notes && (
                      <div className="mt-3 bg-slate-50/50 p-3 rounded-xl border border-slate-200/40 text-xs text-slate-600 italic">
                        {c.notes}
                      </div>
                    )}

                    <DiagnosticIA
                      consultationId={c.id}
                      diagnosticExistant={c.diagnosticIa}
                      confianceExistante={c.confiance}
                      onDiagnostic={charger}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
