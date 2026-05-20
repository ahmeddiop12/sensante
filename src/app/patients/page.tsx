"use client";

import { useEffect, useState } from "react";
import PatientCard from "@/components/PatientCard";
import PatientForm from "@/components/PatientForm";
import { Users, Search, Activity, Loader2 } from "lucide-react";

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  telephone: string | null;
  adresse: string | null;
  region: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState("");

  async function chargerPatients() {
    try {
      setLoading(true);
      const res = await fetch("/api/patients");
      const data = await res.json();

      if (Array.isArray(data)) {
        setPatients(data);
      } else if (data && Array.isArray(data.patients)) {
        setPatients(data.patients);
      } else {
        console.error("Format de données invalide :", data);
        setPatients([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    chargerPatients();
  }, []);

  function calculerAge(dateNaissance: string): number {
    const naissance = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - naissance.getFullYear();
    const m = today.getMonth() - naissance.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < naissance.getDate())) {
      age--;
    }
    return age;
  }

  const patientsFiltres = patients.filter((p) => {
    const nomComplet = `${p.prenom} ${p.nom}`.toLowerCase();
    const query = recherche.toLowerCase();
    return nomComplet.includes(query) || p.region.toLowerCase().includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* En-tête de page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-805 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-teal-650" />
            <span>Patients</span>
            <span className="text-xs px-2.5 py-1 bg-teal-50 border border-teal-150 text-teal-700 font-bold rounded-full">
              {patients.length} enregistrés
            </span>
          </h1>
          <p className="text-sm text-slate-405 mt-1">Gérez le dossier clinique des patients de votre communauté.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Formulaire à gauche */}
        <div className="lg:col-span-1">
          <PatientForm onSuccess={chargerPatients} />
        </div>

        {/* Liste à droite */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher un patient par nom ou région..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none bg-slate-50/50 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-slate-500" />
            <span>Liste des dossiers ({patientsFiltres.length})</span>
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <p className="text-sm text-slate-400 font-medium">Chargement des dossiers...</p>
            </div>
          ) : patientsFiltres.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
              <p className="text-slate-405 font-medium text-sm">Aucun patient correspondant à votre recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patientsFiltres.map((p) => (
                <PatientCard
                  key={p.id}
                  nom={`${p.prenom} ${p.nom}`}
                  region={p.region}
                  age={calculerAge(p.dateNaissance)}
                  sexe={p.sexe as "M" | "F"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
