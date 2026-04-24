interface PatientCardProps {
nom: string;
region: string;
age: number;
}
export default function PatientCard({
nom, region, age
}: PatientCardProps) {
return (
<div className="bg-white rounded-lg shadow-md p-6
border-l-4 border-teal-500">
<h3 className="text-lg font-bold text-gray-800">
{nom}
</h3>
<p className="text-gray-600 mt-1">
Région : {region}
</p>
<p className="text-gray-500 text-sm mt-1">
{age} ans
</p>
</div>
);
}