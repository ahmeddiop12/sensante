import PatientCard from "@/components/PatientCard";

export default function PatientsPage() {
  const patients = [
    { nom: "Aminata Sow", region: "Dakar", age: 34, sexe: "F" as const },
    { nom: "Ibrahima Ba", region: "Thiès", age: 45, sexe: "M" as const },
    { nom: "Awa Diallo", region: "Saint-Louis", age: 28, sexe: "F" as const },
    { nom: "Cheikh Fall", region: "Ziguinchor", age: 52, sexe: "M" as const },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Patients</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((p, i) => (
          <PatientCard key={i} {...p} />
        ))}
      </div>
    </div>
  );
}
