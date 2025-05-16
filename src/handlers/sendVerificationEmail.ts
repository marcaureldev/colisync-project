// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);
// export const sendVerificationEmail = async (
//   user: { email: string; displayName: string },
//   verificationLink: string,
//   otp: string
// ) => {
//   // Créer un lien qui inclut l'OTP pour une vérification en un clic
//   const oneClickLink = `${verificationLink}&otp=${otp}&autoVerify=true`;

//   try {
//     const { data, error } = await resend.emails.send({
//       from: "ColiSync <onboarding@resend.dev>",
//       to: user.email,
//       subject: "Vérification de votre adresse e-mail",
//       html: `
//         <h1>Bienvenue sur ColiSync ${user.displayName}</h1>
//         <p>Merci de vous être inscrit sur notre plateforme.</p>
//         <p>Vous pouvez vérifier votre compte de deux façons :</p>

//         <p><strong>Option 1 :</strong> Veuillez saisir le code OTP suivant et procédez à la vérification :</p>
//         <p><strong>Code OTP :</strong> ${otp}</p>

//         <p><strong>Option 2 :</strong> ou cliquez <a href="${oneClickLink}">ici</a> pour une vérification instantanée</p>

//         <p>Ce code expirera dans 10 minutes.</p>
//         <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
//         <p>Cordialement,<br/>L'équipe ColiSync</p>
//       `,
//     });

//     if (error) {
//       throw new Error("Failed to send email: " + error.message);
//     }

//     return data;
//   } catch (error) {
//     console.error("Erreur lors de l'envoi de l'email:", error);
//     throw error;
//   }
// };

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailType = "initial" | "resend";

export const sendVerificationEmail = async (
  user: { email: string; displayName: string },
  verificationLink: string,
  otp: string,
  type: EmailType = "initial" // "initial" ou "resend"
) => {
  const oneClickLink = `${verificationLink}&otp=${otp}&autoVerify=true`;

  const isResend = type === "resend";

  const subject = isResend
    ? "Nouveau code de vérification ColiSync"
    : "Vérification de votre adresse e-mail";

  const greeting = isResend
    ? `<p>Vous avez demandé un nouveau code de vérification pour votre compte ColiSync.</p>`
    : `<p>Merci de vous être inscrit sur notre plateforme.</p>`;

  const html = `
    <h1>Bienvenue sur ColiSync, ${user.displayName}</h1>
    ${greeting}
    <p>Vous pouvez vérifier votre compte de deux façons :</p>

    <p><strong>Option 1 :</strong> Saisissez ce code OTP :</p>
    <p style="font-size: 24px; font-weight: bold;">${otp}</p>
    
    <p><strong>Option 2 :</strong> Ou cliquez <a href="${oneClickLink}">ici</a> pour une vérification instantanée.</p>
    
    <p>Ce code expirera dans 10 minutes.</p>
    <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
    
    <p>Cordialement,<br/>L'équipe ColiSync</p>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "ColiSync <onboarding@resend.dev>",
      to: user.email,
      subject,
      html,
    });

    if (error) {
      throw new Error("Failed to send email: " + error.message);
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};
