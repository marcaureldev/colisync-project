import nodemailer from 'nodemailer';

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  service: 'gmail', // ou 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Mot de passe d'application Gmail
  },
});

export interface EmailInvitationData {
  to: string;
  name: string;
  code: string;
  type: 'company' | 'agent';
  stationName?: string;
  expiresAt: Date;
}

export async function sendInvitationEmail(data: EmailInvitationData): Promise<boolean> {
  try {
    const { to, name, code, type, stationName, expiresAt } = data;
    
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/register?code=${code}`;
    const expirationDate = expiresAt.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const roleText = type === 'company' ? 'une entreprise' : 'un agent de gare';
    const stationText = stationName ? ` pour la gare ${stationName}` : '';

    const mailOptions = {
      from: `"ColiSync" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Invitation à rejoindre ColiSync',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">ColiSync</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Plateforme de gestion de colis</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${name},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Vous avez été invité(e) à rejoindre ColiSync en tant que ${roleText}${stationText}.
            </p>
            
            <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 20px 0; border-radius: 0 5px 5px 0;">
              <p style="margin: 0; color: #1976d2; font-weight: bold;">
                Code d'invitation : <span style="font-family: monospace; background: #fff; padding: 5px 10px; border-radius: 3px;">${code}</span>
              </p>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
              Cliquez sur le bouton ci-dessous pour créer votre compte et commencer à utiliser la plateforme :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${invitationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Créer mon compte
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
              <strong>Important :</strong> Ce lien d'invitation expire le ${expirationDate}.
            </p>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            </p>
            
            <p style="color: #667eea; font-size: 14px; word-break: break-all;">
              ${invitationUrl}
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #888; font-size: 12px; text-align: center;">
              Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.
            </p>
          </div>
        </div>
      `,
      text: `
        Bonjour ${name},

        Vous avez été invité(e) à rejoindre ColiSync en tant que ${roleText}${stationText}.

        Code d'invitation : ${code}

        Créez votre compte en visitant : ${invitationUrl}

        Ce lien d'invitation expire le ${expirationDate}.

        Cordialement,
        L'équipe ColiSync
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}

// Fonction pour vérifier la configuration email
export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Erreur de configuration email:', error);
    return false;
  }
} 

// Fonction pour envoyer un email de vérification
export async function sendVerificationEmailWithNodemailer(
  user: { email: string; displayName: string },
  verificationLink: string,
  otp: string
): Promise<boolean> {
  try {
    const autoVerifyLink = `${verificationLink}&otp=${otp}&autoVerify=true`;
    
    const mailOptions = {
      from: `"ColiSync" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Vérification de votre compte ColiSync',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">ColiSync</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Vérification de votre compte</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${user.displayName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Merci de vous être inscrit sur notre plateforme. Pour finaliser votre inscription, 
              veuillez vérifier votre adresse email.
            </p>
            
            <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 20px 0; border-radius: 0 5px 5px 0;">
              <p style="margin: 0; color: #1976d2; font-weight: bold;">
                Code de vérification : <span style="font-family: monospace; background: #fff; padding: 5px 10px; border-radius: 3px;">${otp}</span>
              </p>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
              Cliquez sur le bouton ci-dessous pour vérifier votre compte automatiquement :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${autoVerifyLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Vérifier mon compte
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
              <strong>Important :</strong> Ce code expirera dans 10 minutes.
            </p>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            </p>
            
            <p style="color: #667eea; font-size: 14px; word-break: break-all;">
              ${autoVerifyLink}
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #888; font-size: 12px; text-align: center;">
              Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.
            </p>
          </div>
        </div>
      `,
      text: `
        Bonjour ${user.displayName},

        Merci de vous être inscrit sur ColiSync. Pour finaliser votre inscription, 
        veuillez vérifier votre adresse email.

        Code de vérification : ${otp}

        Vérifiez votre compte en visitant : ${autoVerifyLink}

        Ce code expirera dans 10 minutes.

        Cordialement,
        L'équipe ColiSync
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
    return false;
  }
} 



 