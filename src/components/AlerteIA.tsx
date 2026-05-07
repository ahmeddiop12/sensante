interface AlerteIAProps {
  diagnostic: string;
  confiance: number;
  niveau: "faible" | "moyen" | "urgent";
}

export default function AlerteIA({
  diagnostic,
  confiance,
  niveau
}: AlerteIAProps) {
  const couleurs = {
    faible:  "border-green-500 bg-green-50",
    moyen:   "border-orange-500 bg-orange-50",
    urgent:  "border-red-500 bg-red-50",
  };

  return (
    <div className={`rounded-lg p-6 border-l-4 ${couleurs[niveau]}`}>
      <h3 className="font-bold text-gray-800">
        Résultat IA
      </h3>
      <p className="mt-2 text-gray-700">{diagnostic}</p>
      <p className="text-sm text-gray-500 mt-1">
        Confiance : {confiance}%
      </p>
      <p className="text-xs text-gray-400 italic mt-3">
        Ceci n'est pas un diagnostic médical.
        Consultez un professionnel de santé.
      </p>
    </div>
  );
}
