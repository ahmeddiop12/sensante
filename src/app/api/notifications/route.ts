import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export type NotificationType = "patient" | "consultation" | "diagnostic";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  titre: string;
  description: string;
  date: string;
  href: string;
}

const LIMITE_PAR_TYPE = 8;
const LIMITE_TOTAL = 15;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const [patients, consultations, diagnostics] = await Promise.all([
    prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      take: LIMITE_PAR_TYPE,
      select: { id: true, nom: true, prenom: true, region: true, createdAt: true },
    }),
    prisma.consultation.findMany({
      orderBy: { date: "desc" },
      take: LIMITE_PAR_TYPE,
      include: { patient: { select: { prenom: true, nom: true } } },
    }),
    prisma.consultation.findMany({
      where: { diagnosticIa: { not: null }, statut: "termine" },
      orderBy: { date: "desc" },
      take: LIMITE_PAR_TYPE,
      select: {
        id: true,
        date: true,
        diagnosticIa: true,
        confiance: true,
        patient: { select: { prenom: true, nom: true } },
      },
    }),
  ]);

  const items: NotificationItem[] = [];

  for (const p of patients) {
    items.push({
      id: `patient-${p.id}`,
      type: "patient",
      titre: "Nouveau patient",
      description: `${p.prenom} ${p.nom} — ${p.region}`,
      date: p.createdAt.toISOString(),
      href: "/patients",
    });
  }

  for (const c of consultations) {
    items.push({
      id: `consultation-${c.id}`,
      type: "consultation",
      titre: "Nouvelle consultation",
      description: `${c.patient.prenom} ${c.patient.nom}`,
      date: c.date.toISOString(),
      href: "/consultations",
    });
  }

  for (const d of diagnostics) {
    const extrait =
      d.diagnosticIa && d.diagnosticIa.length > 72
        ? `${d.diagnosticIa.slice(0, 72)}…`
        : d.diagnosticIa ?? "Diagnostic généré";
    const confiance =
      d.confiance !== null ? ` (${Math.round(d.confiance)} % confiance)` : "";

    items.push({
      id: `diagnostic-${d.id}`,
      type: "diagnostic",
      titre: "Nouveau diagnostic IA",
      description: `${d.patient.prenom} ${d.patient.nom} — ${extrait}${confiance}`,
      date: d.date.toISOString(),
      href: "/consultations",
    });
  }

  items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return NextResponse.json({
    notifications: items.slice(0, LIMITE_TOTAL),
    total: items.length,
  });
}
