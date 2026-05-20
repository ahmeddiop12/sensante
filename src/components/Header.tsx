"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { HeartPulse, LogOut, User, Bell } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="glass-header sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20 text-white">
          <HeartPulse className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
            Sén<span className="text-teal-600">Santé</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider -mt-1">
            Assistant Communautaire
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-200 text-teal-700 font-bold shadow-sm">
                {session.user?.name?.charAt(0) || <User className="w-4 h-4" />}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-700 leading-none">
                  {session.user?.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {session.user?.email}
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="ml-2 w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-all duration-200"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl shadow-md shadow-teal-600/10 hover:shadow-teal-700/20 transition-all duration-200"
          >
            <User className="w-4 h-4" />
            <span>Se connecter</span>
          </Link>
        )}
      </div>
    </header>
  );
}