"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
export default function Header() {
const { data: session } = useSession();
return (
<header className="bg-teal-700 text-white p-4
flex items-center justify-between">
<h1 className="text-xl font-bold">SénSanté</h1>
<div className="flex items-center gap-4">
{session ? (
<>
<span className="text-sm text-teal-200">
{session.user?.name}
</span>
<button onClick={() => signOut()}
className="text-sm bg-teal-600 px-3 py-1
rounded hover:bg-teal-500 transition">
Déconnexion
</button>
</>
) : (
<Link href="/login"
className="text-sm bg-teal-600 px-3 py-1
rounded hover:bg-teal-500 transition">
Se connecter
</Link>
)}
</div>
</header>
);
}