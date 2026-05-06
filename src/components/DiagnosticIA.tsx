"use client";

import { useState } from "react";

interface DiagnosticIAProps {
  consultationId: number;
  diagnosticExistant: string | null;
  confianceExistante: number | null;
  onDiagnostic: () => void;
}

export default function DiagnosticIA({
  consultationId,
  diagnosticExistant,
  confianceExistante,
  onDiagnostic,
}: DiagnosticIAProps) {
  const [loading, setLoading] = useState(false);
  const [resultat, setResultat] = useState<{
    diagnostic: string;
    confiance: number;
    recommandation: string;
    urgence: string;
  } | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const analyser = async () => {
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/ia/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResultat(data);
      onDiagnostic();
    } catch (e: any) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  };

  const diagnostic = resultat || (diagnosticExistant ? {
    diagnostic: diagnosticExistant,
    confiance: confianceExistante || 0,
    recommandation: "",
    urgence: "",
  } : null);

  return (
    <div className="mt-4 p-4 border rounded-lg bg-blue-50">
      <h3 className="font-bold text-blue-800 mb-2">🤖 Diagnostic IA</h3>

      {!diagnostic && (
        <button
          onClick={analyser}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Analyse en cours..." : "Analyser avec l'IA"}
        </button>
      )}

      {erreur && (
        <p className="text-red-600 mt-2">❌ {erreur}</p>
      )}

      {diagnostic && (
        <div className="mt-3 space-y-2">
          <p><strong>Diagnostic :</strong> {diagnostic.diagnostic}</p>
          <p><strong>Confiance :</strong> {diagnostic.confiance}%</p>
          {diagnostic.recommandation && (
            <p><strong>Recommandation :</strong> {diagnostic.recommandation}</p>
          )}
          {diagnostic.urgence && (
            <p><strong>Urgence :</strong> {diagnostic.urgence}</p>
          )}
          <p className="text-xs text-gray-500 mt-2 italic">
            ⚠️ Ceci est un pré-diagnostic. Ce n'est PAS un avis médical. 
            Consultez toujours un professionnel de santé.
          </p>
        </div>
      )}
    </div>
  );
}