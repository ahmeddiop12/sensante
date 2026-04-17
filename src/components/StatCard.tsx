interface StatCardProps {
  titre: string;
  valeur: number;
  unite: string;
  couleur: string;
}

export default function StatCard({
  titre, valeur, unite, couleur
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-t-4 ${couleur}`}>
      <p className="text-sm text-gray-500">{titre}</p>
      <p className="text-3xl font-bold text-gray-800 mt-2">
        {valeur}
      </p>
      <p className="text-sm text-gray-400">{unite}</p>
    </div>
  );
}
