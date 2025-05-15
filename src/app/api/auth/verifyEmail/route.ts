import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const now = new Date();
    const { email, token, otp } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        auths: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const validOTP = user.auths.find((auth) => {
      return (
        auth.otp === otp &&
        auth.token === token &&
        auth.expiresAt > now &&
        !auth.isUsed &&
        !auth.isVerified
      );
    });

    if (!validOTP) {
      return NextResponse.json(
        { error: "Code OTP invalide ou expiré", success: false },
        { status: 400 }
      );
    }

    await prisma.auth.update({
      where: { id: validOTP.id },
      data: {
        isVerified: true,
        isUsed: true,
      },
    });

    await prisma.user.update( {
        where: { id: user.id},
        data: {
            isActive: true,
        }
    });

    return NextResponse.json(
        {success: true, message: "Email vérifié avec succès"},
        { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
