"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
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
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

// ── Label personnalisé pour le PieChart ──────────────────────────────────────
// On crée un composant séparé pour éviter les conflits de types Recharts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderPieLabel = (props: any): string => {
  const { name, percent } = props;
  return `${name ?? ""} (${(((percent as number) ?? 0) * 100).toFixed(0)}%)`;
};

// ── Formatter Tooltip ────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        if (!res.ok) throw new Error("Erreur lors du chargement des stats");
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
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg animate-pulse">
          Chargement du dashboard…
        </p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{erreur}</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Tableau de bord — SénSanté
      </h1>

      {/* ── Zone 1 : KPI ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          titre="Patients"
          valeur={stats.kpi.totalPatients}
          unite="enregistrés"
          couleur="border-teal-500"
        />
        <StatCard
          titre="Consultations"
          valeur={stats.kpi.totalConsultations}
          unite="au total"
          couleur="border-orange-500"
        />
        <StatCard
          titre="Diagnostics IA"
          valeur={stats.kpi.consultationsTerminees}
          unite="terminés"
          couleur="border-purple-500"
        />
        <StatCard
          titre="Alertes"
          valeur={stats.kpi.alertesUrgentes}
          unite="urgentes"
          couleur="border-red-500"
        />
      </div>

      {/* ── Zone 2 & 4 : Graphiques côte à côte ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Graphique en barres — consultations par mois */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Consultations par mois
          </h2>
          {stats.parMois.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucune donnée disponible.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.parMois}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#E65100" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Graphique camembert — patients par région */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Patients par région
          </h2>
          {stats.parRegion.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucune donnée disponible.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.parRegion}
                  dataKey="total"
                  nameKey="region"
                  cx="50%"
                  cy="48%"
                  outerRadius={90}
                  label={renderPieLabel}
                >
                  {stats.parRegion.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COULEURS_PIE[i % COULEURS_PIE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Zone 3 : Derniers diagnostics IA ───────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Derniers diagnostics IA
        </h2>

        {stats.dernieresAlertes.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Aucun diagnostic disponible pour le moment.
          </p>
        ) : (
          <div className="space-y-3">
            {stats.dernieresAlertes.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {/* Infos patient */}
                <div>
                  <p className="font-semibold text-gray-800">{a.patient}</p>
                  <p className="text-sm text-gray-500">
                    {a.region} —{" "}
                    {new Date(a.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                {/* Diagnostic + confiance */}
                <div className="text-right">
                  <p className="text-sm text-gray-700 max-w-xs truncate">
                    {a.diagnostic
                      ? a.diagnostic.substring(0, 60) + "…"
                      : "—"}
                  </p>
                  {a.confiance !== null && (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        a.confiance >= 80
                          ? "bg-red-100 text-red-700"
                          : a.confiance >= 60
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      Confiance : {a.confiance}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}