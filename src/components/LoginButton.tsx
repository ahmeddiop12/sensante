// src/components/LoginButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/login")}
      className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
    >
      Se connecter
    </button>
  );
}