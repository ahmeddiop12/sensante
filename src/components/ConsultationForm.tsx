import { useState, useEffect } from "react";
import { User, ClipboardList, Check, Plus, Loader2, FileText } from "lucide-react";

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  region: string;
}

const SYMPTOMES_DISPONIBLES = [
  "Fièvre", "Toux", "Maux de tête", "Fatigue", "Diarrhée",
  "Vomissements", "Douleur abdominale", "Éruption cutanée",
  "Frissons", "Douleur thoracique", "Essoufflement", "Vertiges",
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
      .then((data) => {
        if (Array.isArray(data)) {
          setPatients(data);
        } else {
          console.error("L'API n'a pas renvoyé un tableau :", data);
          setPatients([]);
        }
      })
      .catch((err) => {
        console.error("Erreur réseau :", err);
        setPatients([]);
      });
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
      alert("Veuillez sélectionner au moins un symptôme.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: Number(formData.get("patientId")),
          symptomes: symptomes,
          notes: formData.get("notes"),
        }),
      });

      if (res.ok) {
        setSymptomes([]);
        (e.target as HTMLFormElement).reset();
        onSuccess();
      } else {
        const errorData = await res.json();
        alert("Erreur lors de l'enregistrement : " + (errorData.error || "Inconnue"));
      }
    } catch (error) {
      alert("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-6 border border-slate-100/60 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-655 flex items-center justify-center border border-orange-100">
          <ClipboardList className="w-4.5 h-4.5" />
        </div>
        <h3 className="text-base font-bold text-slate-805">Nouvelle consultation</h3>
      </div>

      {/* Patient */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Patient concerné</label>
        <div className="relative">
          <select 
            name="patientId" 
            required 
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white/50 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all appearance-none"
          >
            <option value="">Sélectionner un patient dans la liste</option>
            {Array.isArray(patients) && patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.prenom} {p.nom} — {p.region}
              </option>
            ))}
          </select>
          <User className="w-4 h-4 text-slate-405 absolute left-3.5 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Symptômes */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-405">
            Symptômes signalés
          </label>
          <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100">
            {symptomes.length} sélectionnés
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SYMPTOMES_DISPONIBLES.map((s) => {
            const selected = symptomes.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSymptome(s)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition-all duration-200 cursor-pointer select-none
                  ${selected 
                    ? "bg-amber-50 border-amber-400 text-amber-900 shadow-sm" 
                    : "bg-white/50 hover:bg-slate-50 border-slate-200 text-slate-650"
                  }`}
              >
                <span>{s}</span>
                {selected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Notes & Observations cliniques (optionnel)</label>
        <div className="relative">
          <textarea
            name="notes"
            rows={3}
            placeholder="Observations physiques, antécédents ou remarques..."
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white/50 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none"
          />
          <FileText className="w-4 h-4 text-slate-405 absolute left-3.5 top-3.5" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-3 rounded-xl shadow-md shadow-orange-500/10 hover:shadow-orange-650/20 hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer w-full md:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="w-4.5 h-4.5 animate-spin" />
            <span>Enregistrement...</span>
          </>
        ) : (
          <>
            <Plus className="w-4.5 h-4.5" />
            <span>Enregistrer la consultation</span>
          </>
        )}
      </button>
    </form>
  );
}