"use client";

import { useEffect, useState } from "react";
import PatientCard from "@/components/PatientCard";
import PatientForm from "@/components/PatientForm";

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

  async function chargerPatients() {
  try {
    setLoading(true);
    const res = await fetch("/api/patients");
    const data = await res.json();

    // Vérification de sécurité :
    // Si data est un tableau, on l'utilise. 
    // Sinon, on cherche si les patients sont dans data.patients.
    // Sinon, on met un tableau vide par défaut.
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Patients
      </h1>
      <PatientForm onSuccess={chargerPatients} />
      <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">
        Liste des patients ({patients.length})
      </h2>
      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : patients.length === 0 ? (
        <p className="text-gray-500">Aucun patient enregistré.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((p) => (
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
  );
}
