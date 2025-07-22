import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";

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

    // Rejeter l'utilisateur (le suspendre)
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: "SUSPENDED",
        isActive: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Utilisateur rejeté avec succès",
    });
  } catch (error) {
    console.error('Erreur lors du rejet de l\'utilisateur:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
} 