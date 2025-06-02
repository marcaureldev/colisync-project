// lib/auth.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token");

    if (!access_token) {
      return { user: null, error: "Token manquant", status: 401 };
    }

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      return {
        user: null,
        error: "Configuration serveur invalide",
        status: 500,
      };
    }

    const payload = jwt.verify(access_token.value, secret) as {
      id: string;
      email: string;
      role: string;
    };

    const { id, email } = payload;

    const user = await prisma.user.findUnique({
      where: { id, email },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return { user: null, error: "Utilisateur non trouvé", status: 404 };
    }

    return { user, error: null, status: 200 };
  } catch (error) {
    return {
      user: null,
      error: "Une erreur est survenue lors de la récupération de l'utilisateur",
      details:
        process.env.NODE_ENV === "development" ? error : "Erreur interne",
      status: 500,
    };
  }
}
