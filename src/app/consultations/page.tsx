"use client";

import { useEffect, useState } from "react";
import ConsultationForm from "@/components/ConsultationForm";

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

  async function charger() {
    const res = await fetch("/api/consultations");
    const data = await res.json();
    setConsultations(data);
    setLoading(false);
  }

  useEffect(() => {
    charger();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Consultations
      </h1>

      <ConsultationForm onSuccess={charger} />

      <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">
        Historique ({consultations.length})
      </h2>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : consultations.length === 0 ? (
        <p className="text-gray-500">
          Aucune consultation enregistrée.
        </p>
      ) : (
        <div className="space-y-4">
          {consultations.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-400"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">
                    {c.patient.prenom} {c.patient.nom}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {c.patient.region} —{" "}
                    {new Date(c.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    c.statut === "termine"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {c.statut === "termine" ? "Terminé" : "En attente"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {c.symptomes.map((s, i) => (
                  <span
                    key={i}
                    className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {c.notes && (
                <p className="text-sm text-gray-600 mt-3 italic">
                  {c.notes}
                </p>
              )}

              {c.diagnosticIa ? (
                <div className="mt-3 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-bold text-red-700">
                    Diagnostic IA : {c.diagnosticIa}
                  </p>
                  <p className="text-xs text-gray-500">
                    Confiance : {c.confiance}%
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-3 italic">
                  Diagnostic IA en attente (Lab IA — v0.5)
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
