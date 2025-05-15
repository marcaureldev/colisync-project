import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendVerificationEmail = async (
//   user: { email: string; displayName: string },
//   redirectLink: string,
//   otp: string
// ) => {
//   const redirectLinkEncoded = `${redirectLink}&otp=${otp}`;
//   try {
//     const { data, error } = await resend.emails.send({
//       from: "ColiSync <onboarding@resend.dev>",
//       to: user.email,
//       subject: "Vérification de votre adresse e-mail",
//       html: `
//         <h1>Bienvenue sur ColiSync ${user.displayName}</h1>
//         <p>Merci de vous être inscrit sur notre plateforme. Pour finaliser votre inscription, veuillez utiliser le code OTP ci-dessous :</p>
//         <p><strong>Code OTP :</strong> ${otp}</p>
//         <p>Ou cliquez sur le lien ci-dessous pour vérifier votre adresse e-mail :</p>
//         <p><a href="${redirectLinkEncoded}">Vérifier mon adresse e-mail</a></p>
//         <p>Ceux-ci expireront dans 10 minutes</p>
//         <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
//         <p>Cordialement,<br/>L'équipe ColiSync</p>
//       `,
//     });

//     if (error) {
//       throw new Error("Failed to send email:" + error.message);
//     }

//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const sendVerificationEmail = async (
  user: { email: string; displayName: string },
  verificationLink: string,
  otp: string
) => {
  // Créer un lien qui inclut l'OTP pour une vérification en un clic
  const oneClickLink = `${verificationLink}&otp=${otp}&autoVerify=true`;

  try {
    const { data, error } = await resend.emails.send({
      from: "ColiSync <onboarding@resend.dev>",
      to: user.email,
      subject: "Vérification de votre adresse e-mail",
      html: `
        <h1>Bienvenue sur ColiSync ${user.displayName}</h1>
        <p>Merci de vous être inscrit sur notre plateforme.</p>
        <p>Vous pouvez vérifier votre compte de deux façons :</p>

        <p><strong>Option 1 :</strong> Rendez-vous sur <a href="${verificationLink}">la page de vérification</a> et entrez le code :</p>
        <p><strong>Code OTP :</strong> ${otp}</p>
        
        <p><strong>Option 2 :</strong> ou cliquez <a href="${oneClickLink}">ici</a> pour une vérification instantanée</p>
        
        <p>Ce code expirera dans 10 minutes.</p>
        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
        <p>Cordialement,<br/>L'équipe ColiSync</p>
      `,
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
