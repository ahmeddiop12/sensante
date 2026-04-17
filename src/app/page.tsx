// src/app/page.tsx
import PatientCard from "@/components/PatientCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-12">
      {/* En-tête du projet SénSanté */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-teal-700">
          SénSanté
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Assistant de santé communautaire avec IA
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-6 uppercase tracking-wider">
          Membres de l'équipe
        </h2>

        {/* Conteneur Flex pour aligner les 3 cartes proprement */}
        <div className="flex flex-wrap gap-6">
          {/* Carte 1 : Vous */}
          <PatientCard 
            nom="Mouhamed Diop" 
            role="Architecte" 
            numeroGroupe={8} 
          />

          {/* Carte 2 : El hadj Abdourahmane Diop */}
          <PatientCard 
            nom="El hadj Abdourahmane Diop" 
            role="Gardien" 
            numeroGroupe={8} 
          />

          {/* Carte 3 : Coumba Gueye */}
          <PatientCard 
            nom="Coumba Gueye" 
            role="Medecin" 
            numeroGroupe={8} 
          />
        </div>
      </section>
    </main>
  );
}
