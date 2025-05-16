import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const generateToken = (user: { id: string; email: string }) => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT secret key is not defined");
  }
  return jwt.sign({ id: user.id, email: user.email }, secret, {
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
    await prisma.user.update({
      where: { id: auth.userId },
      data: {
        isActive: true,
      },
    });

    await prisma.auth.delete({
      where: { id: auth.id },
    });

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const access_token = generateToken({ id: user.id, email: user.email });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "access_token",
      value: access_token,
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json(
      { success: true, message: "Email vérifié avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
