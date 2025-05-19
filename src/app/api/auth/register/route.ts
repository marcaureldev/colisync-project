import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import {
  generateNumericOTP,
  generateToken,
  hashPassword,
} from "@/lib/authUtility";
import { sendVerificationEmail } from "@/handlers/sendVerificationEmail";
const domain = process.env.NEXT_PUBLIC_SITE_URL;

export async function POST(request: Request) {
  try {
    const { email, fullname, password } = await request.json();

    const hashedPassword = await hashPassword(password);

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "Cette addresse email est déjà utilisée",
          success: false,
          field: "email",
        },
        { status: 400 }
      );
    }
    const user = await prisma.user.create({
      data: {
        email,
        displayName: fullname,
        password: hashedPassword,
      },
    });

    const auth = await prisma.auth.create({
      data: {
        userId: user.id,
        otp: generateNumericOTP(6),
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
        token: generateToken(32),
      },
    });

    const verificationLink = `${domain}/auth/verifyEmail?token=${auth.token}&email=${user.email}`;
    const redirectLink = `/auth/verifyEmail?token=${auth.token}&email=${user.email}`;

    await sendVerificationEmail(user, verificationLink, auth.otp, "initial");

    return NextResponse.json(
      {
        success: true,
        message: "Compte créé avec succès. Veuillez vérifier votre email.",
        redirectLink,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de l'inscription",
        success: false,
      },
      { status: 500 }
    );
  }
}
