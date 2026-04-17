interface ConsultationCardProps {
  patient: string;
  date: string;
  symptomes: string;
  statut: "en_attente" | "termine";
}

export default function ConsultationCard({
  patient,
  date,
  symptomes,
  statut
}: ConsultationCardProps) {
  const statutColor = statut === "termine"
    ? "bg-green-100 text-green-700"
    : "bg-yellow-100 text-yellow-700";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-400">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-800">
          {patient}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${statutColor}`}>
          {statut === "termine" ? "Terminé" : "En attente"}
        </span>
      </div>
      <p className="text-gray-500 text-sm mt-1">{date}</p>
      <p className="text-gray-600 mt-2">{symptomes}</p>
    </div>
  );
}
