import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/authUtility";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
    const { email, password } = await request.json();

    const hashedPassword = await hashPassword(password);

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
    });

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
        message: "Utilisateur connecté avec succès",
        data: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la connexion", success: false },
      { status: 500 }
    );
  }
}
