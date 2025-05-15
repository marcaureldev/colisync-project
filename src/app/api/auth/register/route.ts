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
        { error: "Cet email est déjà utilisé", success: false },
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
        isVerified: false,
        isUsed: false,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
        token: generateToken(32),
      },
    });

    const verificationLink = `${domain}/auth/verifyEmail?token=${auth.token}&email=${user.email}`;

    // Envoi de l'email avec le lien et l'OTP
    try {
      await sendVerificationEmail(user, verificationLink, auth.otp);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      // On continue même si l'email échoue, l'utilisateur pourra demander un renvoi
    }

    // const redirectLink = `${domain}/auth/verifyEmail?token=${auth.token}&email=${user.email}&userId=${user.id}`;
    // // await sendVerificationEmail(user, redirectLink, auth.otp);
    // // const { password: _, ...userWithoutPassword } = user;
    // return NextResponse.json({ redirectUrl: redirectLink });

    return NextResponse.json(
      {
        success: true,
        message: "Compte créé avec succès. Veuillez vérifier votre email.",
        email: user.email,
        // Pas besoin d'envoyer l'OTP dans la réponse car il est envoyé par email
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
