import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

function formatSymptomes(symptomes: unknown): string {
  if (Array.isArray(symptomes)) return symptomes.map(String).join(", ");
  if (typeof symptomes === "string") return symptomes;
  return "";
}

function niveauAlerte(confiance: number | null): "faible" | "moyen" | "urgent" {
  if (confiance === null) return "faible";
  if (confiance >= 85) return "urgent";
  if (confiance >= 60) return "moyen";
  return "faible";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    totalPatients,
    consultationsCeMois,
    alertesUrgentes,
    derniersPatients,
    derniereConsultation,
    alerteActive,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.consultation.count({
      where: { date: { gte: startOfMonth } },
    }),
    prisma.consultation.count({
      where: {
        statut: "termine",
        confiance: { gte: 60 },
        diagnosticIa: { not: null },
      },
    }),
    prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.consultation.findFirst({
      include: { patient: true },
      orderBy: { date: "desc" },
    }),
    prisma.consultation.findFirst({
      where: {
        statut: "termine",
        diagnosticIa: { not: null },
      },
      include: { patient: true },
      orderBy: [{ confiance: "desc" }, { date: "desc" }],
    }),
  ]);

  return NextResponse.json({
    kpi: {
      totalPatients,
      consultationsCeMois,
      alertesUrgentes,
    },
    derniersPatients: derniersPatients.map((p) => ({
      id: p.id,
      nom: `${p.prenom} ${p.nom}`,
      region: p.region,
      dateNaissance: p.dateNaissance,
      sexe: p.sexe as "M" | "F",
    })),
    derniereConsultation: derniereConsultation
      ? {
          id: derniereConsultation.id,
          patient: `${derniereConsultation.patient.prenom} ${derniereConsultation.patient.nom}`,
          date: derniereConsultation.date,
          symptomes: formatSymptomes(derniereConsultation.symptomes),
          statut: derniereConsultation.statut as "en_attente" | "termine",
        }
      : null,
    alerteActive: alerteActive
      ? {
          diagnostic: alerteActive.diagnosticIa ?? "",
          confiance: Math.round(alerteActive.confiance ?? 0),
          niveau: niveauAlerte(alerteActive.confiance),
          patient: `${alerteActive.patient.prenom} ${alerteActive.patient.nom}`,
        }
      : null,
  });
}
