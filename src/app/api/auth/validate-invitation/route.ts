import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: "Code d'invitation requis", success: false },
        { status: 400 }
      );
    }

    // Récupérer l'invitation avec les détails de la gare
    const invitation = await prisma.invitationCode.findUnique({
      where: { code },
      include: { gare: true },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Code d'invitation invalide", success: false },
        { status: 404 }
      );
    }

    // Vérifier si l'invitation a déjà été utilisée
    if (invitation.isUsed) {
      return NextResponse.json(
        { error: "Ce code d'invitation a déjà été utilisé", success: false },
        { status: 400 }
      );
    }

    // Vérifier si l'invitation a expiré
    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Ce code d'invitation a expiré", success: false },
        { status: 400 }
      );
    }

    // Retourner les informations de l'invitation
    return NextResponse.json({
      success: true,
      invitation: {
        code: invitation.code,
        type: invitation.role === 'COMPANY' ? 'company' : 'agent',
        name: invitation.name || '',
        email: invitation.email || '',
        station: invitation.gare?.denomination || '',
        expiresAt: invitation.expiresAt.toISOString(),
      },
    });

  } catch (error) {
    console.error('Erreur lors de la validation de l\'invitation:', error);
    return NextResponse.json(
      { error: "Erreur lors de la validation de l'invitation", success: false },
      { status: 500 }
    );
  }
} 