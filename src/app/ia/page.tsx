import AlerteIA from "@/components/AlerteIA";

export default function IAPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Assistant IA
      </h1>
      <p className="text-gray-600 mb-6">
        Saisissez les symptômes du patient pour obtenir un pré-diagnostic.
      </p>
      <AlerteIA
        diagnostic="Suspicion de paludisme. Orientation vers un centre de santé."
        confiance={78}
        niveau="urgent"
      />
    </div>
  );
}
