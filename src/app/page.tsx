"use client";

import { useEffect, useState } from "react";
import PatientCard from "@/components/PatientCard";
import ConsultationCard from "@/components/ConsultationCard";
import AlerteIA from "@/components/AlerteIA";
import StatCard from "@/components/StatCard";
import { Sparkles, Calendar, Loader2, AlertCircle } from "lucide-react";

interface HomeData {
  kpi: {
    totalPatients: number;
    consultationsCeMois: number;
    alertesUrgentes: number;
  };
  derniersPatients: {
    id: number;
    nom: string;
    region: string;
    dateNaissance: string;
    sexe: "M" | "F";
  }[];
  derniereConsultation: {
    id: number;
    patient: string;
    date: string;
    symptomes: string;
    statut: "en_attente" | "termine";
  } | null;
  alerteActive: {
    diagnostic: string;
    confiance: number;
    niveau: "faible" | "moyen" | "urgent";
    patient: string;
  } | null;
}

function calculerAge(dateNaissance: string): number {
  const naissance = new Date(dateNaissance);
  const aujourdHui = new Date();
  let age = aujourdHui.getFullYear() - naissance.getFullYear();
  const m = aujourdHui.getMonth() - naissance.getMonth();
  if (m < 0 || (m === 0 && aujourdHui.getDate() < naissance.getDate())) {
    age--;
  }
  return age;
}

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    fetch("/api/home")
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger les données d'accueil.");
        return res.json();
      })
      .then((json: HomeData) => {
        setData(json);
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
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-600 font-medium">Chargement de l&apos;accueil...</p>
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

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Bannière d'accueil */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-teal-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/60 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-teal-50 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Système de santé actif — IA en veille</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Bienvenue sur Sén<span className="text-teal-600">Santé</span>
            </h2>
            <p className="text-sm text-slate-600 max-w-xl font-medium leading-relaxed">
              Votre assistant intelligent pour la santé communautaire. Suivez vos patients, enregistrez vos consultations et obtenez des diagnostics prédictifs en temps réel grâce à l&apos;intelligence artificielle.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 bg-teal-50 px-5 py-3.5 rounded-2xl border border-teal-100 self-start md:self-auto">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">Aujourd&apos;hui</p>
              <p className="text-sm font-semibold text-slate-800 capitalize">{today}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          titre="Patients"
          valeur={data.kpi.totalPatients}
          unite="enregistrés au total"
        />
        <StatCard
          titre="Consultations"
          valeur={data.kpi.consultationsCeMois}
          unite="enregistrées ce mois"
        />
        <StatCard
          titre="Alertes IA"
          valeur={data.kpi.alertesUrgentes}
          unite="cas urgents détectés"
        />
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <span className="w-1.5 h-6 rounded-full bg-teal-600" />
              Derniers patients enregistrés
            </h3>
            {data.derniersPatients.length === 0 ? (
              <p className="text-sm text-slate-500 bg-white rounded-2xl border border-slate-200 p-6 text-center">
                Aucun patient enregistré pour le moment.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.derniersPatients.map((p) => (
                  <PatientCard
                    key={p.id}
                    nom={p.nom}
                    region={p.region}
                    age={calculerAge(p.dateNaissance)}
                    sexe={p.sexe}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <span className="w-1.5 h-6 rounded-full bg-amber-500" />
              Dernière consultation clinique
            </h3>
            {data.derniereConsultation ? (
              <ConsultationCard
                patient={data.derniereConsultation.patient}
                date={new Date(data.derniereConsultation.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                symptomes={data.derniereConsultation.symptomes}
                statut={data.derniereConsultation.statut}
              />
            ) : (
              <p className="text-sm text-slate-500 bg-white rounded-2xl border border-slate-200 p-6 text-center">
                Aucune consultation enregistrée.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <span className="w-1.5 h-6 rounded-full bg-purple-600" />
            Alerte active IA
          </h3>
          {data.alerteActive ? (
            <AlerteIA
              diagnostic={data.alerteActive.diagnostic}
              confiance={data.alerteActive.confiance}
              niveau={data.alerteActive.niveau}
            />
          ) : (
            <p className="text-sm text-slate-500 bg-white rounded-2xl border border-slate-200 p-6 text-center">
              Aucune alerte IA pour le moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
