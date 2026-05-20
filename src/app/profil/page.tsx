"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Loader2,
  AlertCircle,
  LogIn,
} from "lucide-react";

interface ProfilUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: "AGENT" | "MEDECIN" | "ADMIN";
  createdAt: string;
}

type FetchState =
  | { email: string; status: "ok"; profil: ProfilUser }
  | { email: string; status: "error"; message: string };

const ROLE_LABELS: Record<ProfilUser["role"], string> = {
  AGENT: "Agent de santé",
  MEDECIN: "Médecin",
  ADMIN: "Administrateur",
};

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const [fetchState, setFetchState] = useState<FetchState | null>(null);

  const email = session?.user?.email ?? null;
  const statePourSession =
    email && fetchState?.email === email ? fetchState : null;

  const sessionLoading = status === "loading";
  const chargementProfil =
    status === "authenticated" && email !== null && statePourSession === null;

  useEffect(() => {
    if (!email) return;

    let annule = false;

    void (async () => {
      try {
        const res = await fetch("/api/profil");
        if (!res.ok) throw new Error("Impossible de charger le profil.");
        const data: ProfilUser = await res.json();
        if (!annule) {
          setFetchState({ email, status: "ok", profil: data });
        }
      } catch (err) {
        if (!annule) {
          setFetchState({
            email,
            status: "error",
            message:
              err instanceof Error ? err.message : "Erreur inconnue",
          });
        }
      }
    })();

    return () => {
      annule = true;
    };
  }, [email]);

  if (sessionLoading || chargementProfil) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 max-w-7xl mx-auto">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
        <p className="text-sm text-slate-600 font-medium">Chargement du profil...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || !email) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4">
        <LogIn className="w-10 h-10 text-teal-600 mx-auto" />
        <h3 className="font-bold text-slate-800">Connexion requise</h3>
        <p className="text-sm text-slate-600">
          Connectez-vous pour afficher vos informations de compte.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  if (!statePourSession || statePourSession.status === "error") {
    return (
      <div className="max-w-md mx-auto my-12 bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h3 className="font-bold text-rose-800">Une erreur est survenue</h3>
        <p className="text-sm text-rose-700">
          {statePourSession?.status === "error"
            ? statePourSession.message
            : "Profil introuvable."}
        </p>
      </div>
    );
  }

  const { profil } = statePourSession;
  const initiales = `${profil.prenom.charAt(0)}${profil.nom.charAt(0)}`.toUpperCase();
  const dateInscription = new Date(profil.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-teal-600" />
          Mon profil
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Informations de votre compte connecté.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 text-xl font-extrabold">
            {initiales}
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">
              {profil.prenom} {profil.nom}
            </p>
            <p className="text-sm text-slate-500 mt-0.5">
              {ROLE_LABELS[profil.role]}
            </p>
          </div>
        </div>

        <dl className="mt-6 space-y-5">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Email de connexion
              </dt>
              <dd className="text-sm font-semibold text-slate-800 mt-1">
                {profil.email}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Rôle
              </dt>
              <dd className="text-sm font-semibold text-slate-800 mt-1">
                {ROLE_LABELS[profil.role]}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Compte créé le
              </dt>
              <dd className="text-sm font-semibold text-slate-800 mt-1 capitalize">
                {dateInscription}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
}
