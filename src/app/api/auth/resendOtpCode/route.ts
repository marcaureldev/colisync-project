import { sendVerificationEmail } from "@/handlers/sendVerificationEmail";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
const domain = process.env.NEXT_PUBLIC_SITE_URL;

export async function POST(request: Request) {
  try {
    const { email, token, otp } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const verificationLink = `${domain}/auth/verifyEmail?token=${token}&email=${user.email}`;

    await sendVerificationEmail(user, verificationLink, otp, "resend");

    return NextResponse.json(
      {
        success: true,
        message: "Un nouvel email de vérification a été envoyé.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue lors du renvoi du code OTP." },
      { status: 500 }
    );
  }
}
