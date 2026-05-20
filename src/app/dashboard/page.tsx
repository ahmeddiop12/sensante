"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { LayoutGrid, Loader2, AlertCircle, Brain, Calendar, ShieldAlert } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  kpi: {
    totalPatients: number;
    totalConsultations: number;
    consultationsTerminees: number;
    alertesUrgentes: number;
  };
  parRegion: { region: string; total: number }[];
  parMois: { mois: string; total: number }[];
  dernieresAlertes: {
    id: number;
    patient: string;
    region: string;
    diagnostic: string | null;
    confiance: number | null;
    date: string;
  }[];
}

// ── Constantes ───────────────────────────────────────────────────────────────

const COULEURS_PIE = [
  "#0d9488", // teal-600
  "#f97316", // orange-500
  "#7c3aed", // violet-600
  "#4f46e5", // indigo-600
  "#d97706", // amber-600
  "#e11d48", // rose-600
];

// ── Label personnalisé pour le PieChart ──────────────────────────────────────
const renderPieLabel = (props: any): string => {
  const { name, percent } = props;
  return `${name ?? ""} (${(((percent as number) ?? 0) * 100).toFixed(0)}%)`;
};

// ── Formatter Tooltip ────────────────────────────────────────────────────────
const tooltipFormatter = (value: any): [string] => {
  return [`${value} patients`];
};

// ── Composant principal ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des statistiques.");
        return res.json();
      })
      .then((data: Stats) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setErreur(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 max-w-7xl mx-auto">
        <Loader2 className="w-10 h-10 animate-spin text-teal-605" />
        <p className="text-sm text-slate-405 font-medium">Chargement des données du tableau de bord...</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="max-w-md mx-auto my-12 bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h3 className="font-bold text-rose-800">Une erreur est survenue</h3>
        <p className="text-sm text-rose-700">{erreur}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-805 tracking-tight flex items-center gap-2.5">
          <LayoutGrid className="w-7 h-7 text-teal-650" />
          <span>Statistiques & Analyses</span>
        </h1>
        <p className="text-sm text-slate-405 mt-1">Consultez les indicateurs clés et l'activité de santé communautaire en temps réel.</p>
      </div>

      {/* Zone 1 : KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          titre="Patients"
          valeur={stats.kpi.totalPatients}
          unite="dossiers enregistrés"
        />
        <StatCard
          titre="Consultations"
          valeur={stats.kpi.totalConsultations}
          unite="réalisées au total"
        />
        <StatCard
          titre="Diagnostics IA"
          valeur={stats.kpi.consultationsTerminees}
          unite="analyses complétées"
        />
        <StatCard
          titre="Alertes"
          valeur={stats.kpi.alertesUrgentes}
          unite="cas urgents IA"
        />
      </div>

      {/* Zone 2 & 4 : Graphiques côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique consultations par mois */}
        <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100/60">
          <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-4.5 rounded bg-orange-500" />
            Évolution mensuelle des consultations
          </h2>
          {stats.parMois.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-slate-400 text-xs font-medium">Aucune donnée disponible.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.parMois}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} 
                  labelStyle={{ fontWeight: 'bold', fontSize: '12px', color: '#1e293b' }}
                />
                <Bar dataKey="total" fill="#f97316" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Graphique camembert — patients par région */}
        <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100/60">
          <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-4.5 rounded bg-teal-600" />
            Répartition géographique des patients
          </h2>
          {stats.parRegion.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center">
              <p className="text-slate-400 text-xs font-medium">Aucune donnée disponible.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.parRegion}
                  dataKey="total"
                  nameKey="region"
                  cx="50%"
                  cy="45%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={2}
                  label={renderPieLabel}
                >
                  {stats.parRegion.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COULEURS_PIE[i % COULEURS_PIE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={tooltipFormatter}
                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Zone 3 : Derniers diagnostics IA */}
      <div className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100/60">
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-650" />
          <span>Dernières observations IA générées</span>
        </h2>

        {stats.dernieresAlertes.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-slate-200/50">
            <p className="text-slate-455 text-sm font-medium">Aucune observation disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.dernieresAlertes.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50/65 transition-colors flex flex-col justify-between gap-3 shadow-inner"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{a.patient}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{a.region} — {new Date(a.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                  {a.confiance !== null && (
                    <span
                      className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                        a.confiance >= 85
                          ? "bg-rose-100 text-rose-700 border-rose-200"
                          : a.confiance >= 60
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      Confiance : {a.confiance}%
                    </span>
                  )}
                </div>

                <div className="bg-white/60 p-3 rounded-lg border border-slate-200/40">
                  <p className="text-xs text-slate-705 leading-relaxed font-medium line-clamp-2">
                    {a.diagnostic || "Analyse clinique brute."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}