"use client";

import { useState, useEffect } from "react";

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  region: string;
}

const SYMPTOMES_DISPONIBLES = [
  "Fièvre",
  "Toux",
  "Maux de tête",
  "Fatigue",
  "Diarrhée",
  "Vomissements",
  "Douleur abdominale",
  "Éruption cutanée",
  "Frissons",
  "Douleur thoracique",
  "Essoufflement",
  "Vertiges",
];

export default function ConsultationForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [symptomes, setSymptomes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then(setPatients);
  }, []);

  function toggleSymptome(s: string) {
    setSymptomes((prev) =>
      prev.includes(s)
        ? prev.filter((x) => x !== s)
        : [...prev, s]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (symptomes.length === 0) {
      alert("Cochez au moins un symptôme.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/consultations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId: Number(formData.get("patientId")),
        symptomes: symptomes,
        notes: formData.get("notes"),
      }),
    });

    if (res.ok) {
      setSymptomes([]);
      e.currentTarget.reset();
      onSuccess();
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 space-y-6"
    >
      <h3 className="text-lg font-bold text-gray-800">
        Nouvelle consultation
      </h3>

      {/* Patient */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Patient
        </label>
        <select
          name="patientId"
          required
          className="w-full p-3 border rounded-lg"
        >
          <option value="">Sélectionner un patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.prenom} {p.nom} — {p.region}
            </option>
          ))}
        </select>
      </div>

      {/* Symptômes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Symptômes ({symptomes.length} sélectionnés)
        </label>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SYMPTOMES_DISPONIBLES.map((s) => (
            <label
              key={s}
              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition ${
                symptomes.includes(s)
                  ? "bg-orange-50 border-orange-400"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={symptomes.includes(s)}
                onChange={() => toggleSymptome(s)}
                className="accent-orange-500"
              />
              <span className="text-sm">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Notes (optionnel)
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Observations cliniques..."
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : "Enregistrer la consultation"}
      </button>
    </form>
  );
}
