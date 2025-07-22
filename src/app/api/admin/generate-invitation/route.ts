import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.error || !user.user || user.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès non autorisé ou utilisateur non trouvé", success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, name, email, gareId, expiresInDays = 7 } = body;

    // Validation de base
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
    if (email && !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide", success: false },
        { status: 400 }
      );
    }
    if (typeof expiresInDays !== "number" || expiresInDays <= 0) {
      return NextResponse.json(
        { error: "La durée d'expiration doit être un nombre positif", success: false },
        { status: 400 }
      );
    }

    // Validation spécifique agent
    let gare = null;
    if (type === "agent") {
      if (!gareId || typeof gareId !== "string") {
        return NextResponse.json(
          { error: "L'identifiant de la gare est requis pour un agent", success: false },
          { status: 400 }
        );
      }
      gare = await prisma.gare.findUnique({ where: { id: gareId } });
      if (!gare) {
        return NextResponse.json(
          { error: "La gare spécifiée n'existe pas", success: false },
          { status: 400 }
        );
      }
    }

    // Génération du code d'invitation (unique)
    let code;
    let unique = false;
    for (let i = 0; i < 5 && !unique; i++) {
      const prefix = type === "company" ? "CMP" : "AGT";
      code = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const exists = await prisma.invitationCode.findUnique({ where: { code } });
      if (!exists) unique = true;
    }
    if (!unique) {
      return NextResponse.json(
        { error: "Impossible de générer un code unique, réessayez.", success: false },
        { status: 500 }
      );
    }

    // Création de l'invitation
    const invitation = await prisma.invitationCode.create({
      data: {
        code: code as string,
        role: type === "company" ? "COMPANY" : "AGENT_GARE",
        gareId: type === "agent" ? gareId : null,
        createdBy: user.user.id,
        expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
        name,
        email: email || null,
      },
    });

    // Statut de l'invitation
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
        type: String(type || ''),
        name: String(name || ''),
        email: String(invitation.email || ''),
        station: String(gare && gare.denomination ? gare.denomination : ''),
        createdAt: invitation.createdAt.toISOString(),
        status,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la génération du code", success: false },
      { status: 500 }
    );
  }
}