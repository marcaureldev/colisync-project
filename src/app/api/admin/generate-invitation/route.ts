import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "../../../../../generated/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.error || !user.user || user.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Accès non autorisé ou utilisateur non trouvé",
          success: false,
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, name, email, role, gareId, expiresInDays = 7 } = body;

    console.log(type, name, email, role, gareId, expiresInDays);

    // Validation des données
    if (!type || !name) {
      return NextResponse.json(
        { error: "Le type et le nom sont requis", success: false },
        { status: 400 }
      );
    }

    if (!["company", "agent"].includes(type)) {
      return NextResponse.json(
        { error: "Type d'invitation invalide", success: false },
        { status: 400 }
      );
    }

    // // Validation pour les agents
    // if (type === "agent") {
    //   if (!gareId || typeof gareId !== "string") {
    //     return NextResponse.json(
    //       {
    //         error: "L'identifiant de la gare doit être une chaîne valide",
    //         success: false,
    //       },
    //       { status: 400 }
    //     );
    //   }

    //   const gareExists = await prisma.gare.findUnique({
    //     where: { id: gareId },
    //   });

    //   if (!gareExists) {
    //     return NextResponse.json(
    //       { error: "La gare spécifiée n'existe pas", success: false },
    //       { status: 400 }
    //     );
    //   }
    // }

    // Validation de la durée d'expiration
    if (typeof expiresInDays !== "number" || expiresInDays <= 0) {
      return NextResponse.json(
        {
          error: "La durée d'expiration doit être un nombre positif",
          success: false,
        },
        { status: 400 }
      );
    }

    // Génération du code d'invitation
    const prefix = type === "company" ? "CMP" : "AGT";
    const code = `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // Création de l'invitation
    const invitation = await prisma.invitationCode.create({
      data: {
        code,
        role: type === "company" ? "COMPANY" : "AGENT_GARE",
        gareId: type === "agent" ? gareId : null,
        createdBy: user.user.id,
        expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
        name: name,
        email: email || null,
      },
    });

    console.log(invitation);

    // Détermination du statut
    const now = new Date();
    const status = invitation.isUsed
      ? "used"
      : invitation.expiresAt < now
      ? "expired"
      : "pending";

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        code: invitation.code,
        type,
        name,
        email: email || undefined,
        stationId: invitation.gareId || undefined,
        createdAt: invitation.createdAt.toISOString(),
        status,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Un code d'invitation existe déjà", success: false },
          { status: 400 }
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "L'utilisateur spécifié n'existe pas", success: false },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { error: "Erreur lors de la génération du code", success: false },
      { status: 500 }
    );
  }
}