import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/currentUser";

export async function GET() {
  try {
    // Vérifier que l'utilisateur est un admin
    const currentUserResult = await getCurrentUser();
    if (!currentUserResult.user || currentUserResult.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Récupérer tous les utilisateurs en attente de validation
    const pendingUsers = await prisma.user.findMany({
      where: {
        status: "PENDING",
        role: {
          in: ["AGENT_GARE", "COMPANY"]
        }
      },
      include: {
        gare: {
          select: {
            denomination: true,
            city: true,
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json({
      success: true,
      users: pendingUsers
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs en attente:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
} 