interface StatCardProps {
  titre: string;
  valeur: number;
  unite: string;
  couleur: string; // ex: "border-teal-500"
}

export default function StatCard({ titre, valeur, unite, couleur }: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${couleur}`}>
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
        {titre}
      </p>
      <p className="text-4xl font-bold text-gray-800 mt-1">{valeur}</p>
      <p className="text-sm text-gray-400 mt-1">{unite}</p>
    </div>
  );
}