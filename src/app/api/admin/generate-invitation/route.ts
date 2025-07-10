import { getCurrentUser } from "@/lib/currentUser";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {

    const user = await getCurrentUser();

    if (user.error || user.user?.role !== "ADMIN") {
      return NextResponse.json({
        error: "Accès non autorisé",
        success: false,
      }, { status: 401 });
    }

    const { role, gareId, expiresInDays = 7 } = await request.json();
    
    const code = `${role}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const invitation = await prisma.invitationCode.create({
      data: {
        code,
        role,
        gareId: role === "AGENT_GARE" ? gareId : null,
        createdBy: user.user.id,
        expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      }
    });

    return NextResponse.json({
      success: true,
      invitationCode: invitation.code,
      expiresAt: invitation.expiresAt
    });

  } catch (error) {
    return NextResponse.json({
      error: "Erreur lors de la génération du code",
      success: false,
    }, { status: 500 });
  }
}