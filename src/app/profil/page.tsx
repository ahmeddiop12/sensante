export default function ProfilPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Mon profil
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
        <p className="text-gray-600">
          <strong>Nom :</strong> Moussa Diop
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Rôle :</strong> Agent de santé
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Région :</strong> Dakar
        </p>
      </div>
    </div>
  );
}