import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sendInvitationEmail } from "@/lib/emailService";

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
    const { invitationId } = body;

    if (!invitationId) {
      return NextResponse.json(
        { error: "ID d'invitation requis", success: false },
        { status: 400 }
      );
    }

    // Récupérer l'invitation avec les détails de la gare
    const invitation = await prisma.invitationCode.findUnique({
      where: { id: invitationId },
      include: { gare: true },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation non trouvée", success: false },
        { status: 404 }
      );
    }

    if (!invitation.email) {
      return NextResponse.json(
        { error: "Cette invitation n'a pas d'email associé", success: false },
        { status: 400 }
      );
    }

    // Vérifier si l'invitation n'est pas expirée
    if (invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Cette invitation a expiré", success: false },
        { status: 400 }
      );
    }

    // Envoyer l'email
    const emailSent = await sendInvitationEmail({
      to: invitation.email,
      name: invitation.name || 'Utilisateur',
      code: invitation.code,
      type: invitation.role === 'COMPANY' ? 'company' : 'agent',
      stationName: invitation.gare?.denomination,
      expiresAt: invitation.expiresAt,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email d'invitation renvoyé avec succès",
    });

  } catch (error) {
    console.error('Erreur lors du renvoi de l\'invitation:', error);
    return NextResponse.json(
      { error: "Erreur lors du renvoi de l'invitation", success: false },
      { status: 500 }
    );
  }
} 