import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// TEMPORARY DEBUG ENDPOINT - À SUPPRIMER EN PRODUCTION
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        password: true,
      },
    });

    // Masquer partiellement le mot de passe pour la sécurité
    const safeUsers = users.map((u) => ({
      ...u,
      password: u.password
        ? `${u.password.substring(0, 10)}... (hash bcrypt: ${u.password.startsWith("$2a$") || u.password.startsWith("$2b$") ? "OUI ✅" : "NON ❌"})`
        : "VIDE ❌",
    }));

    return NextResponse.json({ count: users.length, users: safeUsers });
  } catch (error) {
    console.error("Debug users error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
