import PatientCard from "@/components/PatientCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-teal-700 mb-6">SénSanté</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Patients</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PatientCard nom="El Hadji Abdourahmane Diop" region="Gardien" age={8} sexe="M" />
        <PatientCard nom="Aminata Sow" region="Dakar" age={34} sexe="F" />
        <PatientCard nom="Ibrahima Ba" region="Thiès" age={45} sexe="M" />
      </div>
    </main>
  );
}
