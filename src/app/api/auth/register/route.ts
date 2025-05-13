"use server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { sendEmailVeried } from "@/handler/sendEmailveried";
const domain = process.env.NEXT_PUBLIC_SITE_URL;

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json();
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email or Password incorect", success: false },
        { status: 401 }
      );
    }
    const user = await prisma.user.create({
      data: {
        email,
        displayName: name,
        password,
      },
    });
    const auth = await prisma.auth.create({
      data: {
        userId: user.id,
        otp: Math.random().toString(36).slice(2, 12),
        isVerified: false,
        isUsed: false,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        token: uuidv4(),
      },
    });
    const brand = uuidv4();
    const redirectLink = `${domain}/auth/emailVerified?token=${auth.token}&email=${email}&userId=${user.id}&brand=${brand}`;
    await sendEmailVeried({ email, redirectLink, otp: auth.otp });
    return NextResponse.json({ redirectUrl: redirectLink });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur d'envoi" },
      { status: 500 }
    );
  }
}
