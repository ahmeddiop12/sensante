import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // ── KPI principaux ──────────────────────────────────────────────────────────
  const totalPatients = await prisma.patient.count();

  const totalConsultations = await prisma.consultation.count();

  const consultationsTerminees = await prisma.consultation.count({
    where: { statut: "termine" },
  });

  const alertesUrgentes = await prisma.consultation.count({
    where: {
      statut: "termine",
      confiance: { gte: 60 },
      diagnosticIa: { not: null },
    },
  });

  // ── Patients par région ─────────────────────────────────────────────────────
  const parRegion = await prisma.patient.groupBy({
    by: ["region"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  // ── Consultations par mois (6 derniers mois) ────────────────────────────────
  const sixMoisAgo = new Date();
  sixMoisAgo.setMonth(sixMoisAgo.getMonth() - 6);

  const consultationsRecentes = await prisma.consultation.findMany({
    where: { date: { gte: sixMoisAgo } },
    select: { date: true },
  });

  const moisNoms = [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
    "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
  ];

  const parMoisMap: Record<string, number> = {};
  consultationsRecentes.forEach((c) => {
    const d = new Date(c.date);
    const key = `${moisNoms[d.getMonth()]} ${d.getFullYear()}`;
    parMoisMap[key] = (parMoisMap[key] || 0) + 1;
  });

  // Trier par ordre chronologique
  const parMois = Object.entries(parMoisMap)
    .map(([mois, total]) => ({ mois, total }))
    .sort((a, b) => {
      const [mA, yA] = a.mois.split(" ");
      const [mB, yB] = b.mois.split(" ");
      const dateA = new Date(`${moisNoms.indexOf(mA) + 1}/01/${yA}`);
      const dateB = new Date(`${moisNoms.indexOf(mB) + 1}/01/${yB}`);
      return dateA.getTime() - dateB.getTime();
    });

  // ── Dernières alertes (diagnostics IA récents) ──────────────────────────────
  const dernieresAlertes = await prisma.consultation.findMany({
    where: {
      statut: "termine",
      diagnosticIa: { not: null },
    },
    include: { patient: true },
    orderBy: { date: "desc" },
    take: 5,
  });

  // ── Réponse ─────────────────────────────────────────────────────────────────
  return NextResponse.json({
    kpi: {
      totalPatients,
      totalConsultations,
      consultationsTerminees,
      alertesUrgentes,
    },
    parRegion: parRegion.map((r) => ({
      region: r.region,
      total: r._count.id,
    })),
    parMois,
    dernieresAlertes: dernieresAlertes.map((a) => ({
      id: a.id,
      patient: `${a.patient.prenom} ${a.patient.nom}`,
      region: a.patient.region,
      diagnostic: a.diagnosticIa,
      confiance: a.confiance,
      date: a.date,
    })),
  });
}