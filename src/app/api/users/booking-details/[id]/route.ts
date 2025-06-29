import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error, status } = await getCurrentUser();
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (typeof id !== "string" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { error: "Format d'ID de réservation invalide" },
        { status: 400 }
      );
    }

    const booking = await prisma.reservation.findUnique({
      where: { id },
      include: {
        packages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!booking || booking.userId !== user.id) {
      return NextResponse.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: booking,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Format JSON invalide dans la requête" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
