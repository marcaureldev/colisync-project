import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/authUtility";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
    const { email, password } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "Adresse email ou mot de passe incorrect",
          success: false,
        },
        { status: 400 }
      );
    }

    // Vérifier si le compte est actif
    if (!existingUser.isActive) {
      return NextResponse.json(
        {
          error: "Votre compte n'est pas encore activé. Veuillez attendre la validation par un administrateur.",
          success: false,
          code: "ACCOUNT_PENDING"
        },
        { status: 403 }
      );
    }

    // Vérifier si le compte n'est pas suspendu
    if (existingUser.status === "SUSPENDED") {
      return NextResponse.json(
        {
          error: "Votre compte a été suspendu. Veuillez contacter l'administrateur.",
          success: false,
          code: "ACCOUNT_SUSPENDED"
        },
        { status: 403 }
      );
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        {
          error: "Adresse email ou mot de passe incorrect",
          success: false,
        },
        { status: 400 }
      );
    }

    const { password: _, ...userWithoutPassword } = existingUser;

    const access_token = generateToken({
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      role: userWithoutPassword.role,
    });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "access_token",
      value: access_token,
      httpOnly: true,
      path: "/",
    });

    // Déterminer la redirection selon le rôle
    let redirectUrl = "/";
    switch (existingUser.role) {
      case "ADMIN":
        redirectUrl = "/admin/dashboard";
        break;
      case "COMPANY":
        redirectUrl = "/users/dashboard";
        break;
      case "AGENT_GARE":
        redirectUrl = "/users/dashboard";
        break;
      case "EXPEDITEUR":
        redirectUrl = "/users/dashboard";
        break;
      default:
        redirectUrl = "/users/dashboard";
    }

    return NextResponse.json(
      {
        success: true,
        message: "Utilisateur connecté avec succès",
        data: userWithoutPassword,
        redirectUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la connexion", success: false },
      { status: 500 }
    );
  }
}
