"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function RegisterPage() {
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const router = useRouter();
async function handleSubmit(
e: React.FormEvent<HTMLFormElement>
) {
e.preventDefault();
setLoading(true);
setError("");
const formData = new FormData(e.currentTarget);
const res = await fetch("/api/register", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
nom: formData.get("nom"),
prenom: formData.get("prenom"),
email: formData.get("email"),
password: formData.get("password"),
}),
});
if (res.ok) {
router.push("/login");
} else {
const data = await res.json();
setError(data.error || "Erreur d'inscription");
}
setLoading(false);
}
return (
<div className="flex items-center justify-center
min-h-[80vh]">
<div className="bg-white p-8 rounded-lg
shadow-md w-full max-w-md">
<h1 className="text-2xl font-bold
text-teal-700 mb-6 text-center">
Inscription
</h1>
{error && (
<p className="bg-red-50 text-red-600 p-3
rounded-lg mb-4 text-sm">
{error}
</p>
)}
<form onSubmit={handleSubmit}
className="space-y-4">
<input name="nom" placeholder="Nom"
required
className="w-full p-3 border rounded-lg" />
<input name="prenom" placeholder="Prénom"
required
className="w-full p-3 border rounded-lg" />
<input name="email" type="email"
placeholder="Email" required
className="w-full p-3 border rounded-lg" />
<input name="password" type="password"
placeholder="Mot de passe" required
minLength={6}
className="w-full p-3 border rounded-lg" />
<button type="submit" disabled={loading}
className="w-full bg-teal-600 text-white
py-3 rounded-lg hover:bg-teal-700
transition disabled:opacity-50">
{loading ? "Inscription..."
: "Créer mon compte"}
</button>
</form>
<p className="text-sm text-gray-500
text-center mt-4">
Déjà un compte ?{" "}
<Link href="/login"
className="text-teal-600 hover:underline">
Se connecter
</Link>
</p>
</div>
</div>
);
}