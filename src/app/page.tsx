import PatientCard from "@/components/PatientCard";
import ConsultationCard from "@/components/ConsultationCard";
import AlerteIA from "@/components/AlerteIA";
import StatCard from "@/components/StatCard";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Tableau de bord
          </h2>
          {/* <LoginButton /> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard titre="Patients" valeur={127} unite="enregistrés" couleur="border-teal-500" />
          <StatCard titre="Consultations" valeur={43} unite="ce mois" couleur="border-orange-500" />
          <StatCard titre="Alertes IA" valeur={8} unite="urgentes" couleur="border-red-500" />
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Derniers patients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <PatientCard nom="Aminata Sow" region="Dakar" age={34} sexe="F" />
          <PatientCard nom="Ibrahima Ba" region="Thiès" age={45} sexe="M" />
          <PatientCard nom="Awa Diallo" region="Saint-Louis" age={28} sexe="F" />
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Dernière consultation
        </h2>
        <ConsultationCard
          patient="Aminata Sow"
          date="18 mars 2025"
          symptomes="Fièvre, toux, fatigue"
          statut="termine"
        />

        <div className="mt-6">
          <AlerteIA
            diagnostic="Suspicion de paludisme. Orientation recommandée."
            confiance={78}
            niveau="urgent"
          />
        </div>
      </main>
    </div>
  );
}