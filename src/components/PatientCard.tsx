export default function PatientCard() {
  const nom = "Mame saye Fall";
  const region = "oracle";
  const age = 8;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
      <h3 className="text-lg font-bold text-gray-800">{nom}</h3>
      <p className="text-gray-600 mt-1">Role : {region}</p>
      <p className="text-gray-500 text-sm mt-1">G:{age} </p>
    </div>
  );
}
