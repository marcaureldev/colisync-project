import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import {
  generateNumericOTP,
  generateToken,
  hashPassword,
} from "@/lib/authUtility";
import { sendVerificationEmailWithNodemailer } from "@/lib/emailService";
import { Role, UserStatus } from "../../../../../generated/prisma/client";
const domain = process.env.NEXT_PUBLIC_SITE_URL;

export async function POST(request: Request) {
  try {
    const { email, fullname, password, invitationCode, role } =
      await request.json();

    const hashedPassword = await hashPassword(password);

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Cette addresse email est déjà utilisée",
          success: false,
          field: "email",
        },
        { status: 400 }
      );
    }

    let userRole: Role = Role.EXPEDITEUR;
    let gareId = null;
    let userStatus: UserStatus = UserStatus.PENDING;
    let invitation = null;

    if (invitationCode) {
      invitation = await prisma.invitationCode.findUnique({
        where: {
          code: invitationCode,
        },
        include: {
          gare: true,
        },
      });

      if (
        !invitation ||
        invitation.isUsed ||
        invitation.expiresAt < new Date()
      ) {
        return NextResponse.json(
          {
            error: "Code d'invitation invalide ou expiré",
            success: false,
          },
          { status: 400 }
        );
      }

      userRole = invitation.role;
      gareId = invitation.gareId;
      userStatus = "PENDING";

      // Marquer l'invitation comme utilisée
      await prisma.invitationCode.update({
        where: {
          id: invitation.id,
        },
        data: {
          isUsed: true,
          usedBy: email,
        },
      });
    }

    const user = await prisma.user.create({
      data: {
        role: userRole,
        status: userStatus,
        email,
        displayName: fullname,
        password: hashedPassword,
        gareId,
        isActive: userRole === "EXPEDITEUR",
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

    let message = "Compte créé avec succès. Veuillez vérifier votre email.";
    if (userRole !== "EXPEDITEUR") {
      message +=
        " Votre compte sera activé après validation par un administrateur.";
    }

    const verificationLink = `${domain}/auth/verifyEmail?token=${auth.token}&email=${user.email}`;
    const redirectLink = `/auth/verifyEmail?token=${auth.token}&email=${user.email}`;

    // Envoyer l'email de vérification (ne pas faire échouer l'inscription si l'email échoue)
    try {
      await sendVerificationEmailWithNodemailer(user, verificationLink, auth.otp);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de vérification:', emailError);
      // Ne pas faire échouer l'inscription si l'email échoue
    }

    // Créer une notification pour les admins si l'utilisateur nécessite une validation
    if (userRole === "AGENT_GARE" || userRole === "COMPANY") {
      try {
        await prisma.notification.create({
          data: {
            type: "PENDING_USER",
            title: "Nouvel utilisateur en attente",
            message: `${fullname} (${email}) - ${userRole} a créé un compte et attend une validation.`,
            targetUserId: null, // Notification pour tous les admins
          },
        });
      } catch (notificationError) {
        console.error('Erreur lors de la création de la notification:', notificationError);
        // Ne pas faire échouer l'inscription si la notification échoue
      }
    }

    return NextResponse.json(
      {
        success: true,
        message,
        redirectLink,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de l'inscription",
        success: false,
      },
      { status: 500 }
    );
  }
}
