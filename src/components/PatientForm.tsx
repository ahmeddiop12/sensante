import { useState } from "react";
import { User, Calendar, Phone, MapPin, Plus, Loader2 } from "lucide-react";

export default function PatientForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      dateNaissance: formData.get("dateNaissance"),
      sexe: formData.get("sexe"),
      telephone: formData.get("telephone"),
      adresse: formData.get("adresse"),
      region: formData.get("region"),
    };

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        form.reset();
        onSuccess();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const regions = [
    "Dakar", "Thiès", "Saint-Louis",
    "Ziguinchor", "Tambacounda", "Kaolack",
    "Louga", "Fatick", "Kolda", "Matam",
    "Kaffrine", "Kédougou", "Sédhiou", "Diourbel",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-2xl p-6 shadow-sm border border-slate-100/60 space-y-6"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
          <User className="w-4.5 h-4.5" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Ajouter un nouveau patient
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prénom */}
        <div className="relative">
          <input
            name="prenom"
            placeholder="Prénom"
            required
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
          />
          <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        </div>

        {/* Nom */}
        <div className="relative">
          <input
            name="nom"
            placeholder="Nom de famille"
            required
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
          />
          <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        </div>

        {/* Date de Naissance */}
        <div className="relative">
          <input
            name="dateNaissance"
            type="date"
            required
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
          />
          <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        </div>

        {/* Sexe */}
        <div className="relative">
          <select
            name="sexe"
            required
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all appearance-none"
          >
            <option value="">Sélectionner le Sexe</option>
            <option value="F">Femme</option>
            <option value="M">Homme</option>
          </select>
          <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
        </div>

        {/* Téléphone */}
        <div className="relative">
          <input
            name="telephone"
            placeholder="Numéro de téléphone (optionnel)"
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
          />
          <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        </div>

        {/* Région */}
        <div className="relative">
          <select
            name="region"
            required
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all appearance-none"
          >
            <option value="">Sélectionner la Région</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
        </div>
      </div>

      {/* Adresse */}
      <div className="relative">
        <input
          name="adresse"
          placeholder="Adresse physique (optionnel)"
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
        />
        <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl shadow-md shadow-teal-600/10 hover:shadow-teal-600/20 hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer w-full md:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="w-4.5 h-4.5 animate-spin" />
            <span>Enregistrement...</span>
          </>
        ) : (
          <>
            <Plus className="w-4.5 h-4.5" />
            <span>Enregistrer le patient</span>
          </>
        )}
      </button>
    </form>
  );
}