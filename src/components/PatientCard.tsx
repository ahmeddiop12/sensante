import { User, MapPin, Calendar } from "lucide-react";

interface PatientCardProps {
  nom: string;
  region: string;
  age: number;
  sexe: "M" | "F";
}

export default function PatientCard({ nom, region, age, sexe }: PatientCardProps) {
  const isFemale = sexe === "F";
  const genderTheme = isFemale
    ? {
        badge: "bg-rose-55 bg-rose-50 text-rose-700 border-rose-100",
        avatarBg: "bg-rose-50 border-rose-150 text-rose-600",
        label: "Femme",
      }
    : {
        badge: "bg-blue-55 bg-blue-50 text-blue-700 border-blue-100",
        avatarBg: "bg-blue-50 border-blue-150 text-blue-600",
        label: "Homme",
      };

  return (
    <div className="glass-card rounded-2xl p-5 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-200">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${genderTheme.avatarBg} shrink-0 shadow-inner`}>
          <User className="w-6 h-6" />
        </div>

        {/* Informations */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-slate-800 truncate text-base" title={nom}>
              {nom}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${genderTheme.badge} shrink-0`}>
              {genderTheme.label}
            </span>
          </div>

          <div className="mt-2.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{region}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{age} ans</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
