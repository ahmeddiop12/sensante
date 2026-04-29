import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const existant =
      await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

    if (existant) {
      return NextResponse.json(
        {
          error:
            "Cet email est déjà utilisé",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        body.password,
        10
      );

    const user =
      await prisma.user.create({
        data: {
          nom: body.nom,
          prenom: body.prenom,
          email: body.email,
          password: hashedPassword,
          role: "AGENT",
        },
      });

    return NextResponse.json(
      {
        message:
          "Compte créé avec succès",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Erreur lors de l'inscription",
      },
      {
        status: 500,
      }
    );
  }
}