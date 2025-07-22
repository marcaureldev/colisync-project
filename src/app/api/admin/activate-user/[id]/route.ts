import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";
import { sendAccountActivationEmail } from "@/lib/emailService";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier que l'utilisateur est un admin
    const currentUserResult = await getCurrentUser();
    if (!currentUserResult.user || currentUserResult.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    const userId = params.id;

    // Vérifier que l'utilisateur existe et est en attente
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        gare: {
          select: {
            denomination: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    if (user.status !== "PENDING") {
      return NextResponse.json(
        { error: "L'utilisateur n'est pas en attente de validation" },
        { status: 400 }
      );
    }

    // Activer l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: "ACTIVE",
        isActive: true,
      },
    });

    // Envoyer l'email de confirmation
    try {
      await sendAccountActivationEmail(
        {
          email: user.email,
          displayName: user.displayName,
          role: user.role,
        },
        user.gare?.denomination
      );
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
      // Ne pas faire échouer l'activation si l'email échoue
    }

    return NextResponse.json({
      success: true,
      message: "Utilisateur activé avec succès",
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        gareName: user.gare?.denomination,
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'activation de l\'utilisateur:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
} 