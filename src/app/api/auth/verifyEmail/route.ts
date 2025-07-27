import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


const generateToken = (user: { id: string; email: string; role: string }) => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT secret key is not defined");
  }
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
    expiresIn: "30d",
  });
};

export async function POST(request: Request) {
  try {
    const now = new Date();
    const { token, otp } = await request.json();

    const auth = await prisma.auth.findFirst({
      where: {
        token,
      },
    });

    if (!auth) {
      return NextResponse.json(
        { error: "Code OTP invalide ou expiré" },
        { status: 404 }
      );
    }
    if (auth.expiresAt < now) {
      return NextResponse.json(
        { error: "Code OTP invalide ou  expiré" },
        { status: 400 }
      );
    }

    if (auth.otp !== otp) {
      return NextResponse.json(
        { error: "Code OTP invalide ou expiré" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur avant la mise à jour pour connaître son rôle
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      include: {
        gare: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de l'utilisateur selon son rôle
    let newStatus = "ACTIVE";
    let isActive = true;

    // Seuls les agents de gare et entreprises restent PENDING jusqu'à validation admin
    if (user.role === "AGENT_GARE" || user.role === "COMPANY") {
      newStatus = "PENDING";
      isActive = false;
      
      // Créer une notification pour les admins
      try {
        await prisma.notification.create({
          data: {
            type: "PENDING_USER",
            title: "Nouvel utilisateur en attente",
            message: `${user.displayName} (${user.email}) - ${user.role} a vérifié son email et attend une validation.`,
            targetUserId: null, // Notification pour tous les admins
          },
        });
      } catch (notificationError) {
        console.error('Erreur lors de la création de la notification admin:', notificationError);
        // Ne pas faire échouer la vérification si la notification échoue
      }
    }
    // Les ADMIN et EXPEDITEUR deviennent ACTIVE après vérification d'email

    await prisma.user.update({
      where: { id: auth.userId },
      data: {
        isActive: isActive,
        status: newStatus,
      },
    });

    await prisma.auth.delete({
      where: { id: auth.id },
    });

    const access_token = generateToken({ id: user.id, email: user.email, role: user.role });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "access_token",
      value: access_token,
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Email vérifié avec succès",
        userRole: user.role,
        userStatus: newStatus
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
