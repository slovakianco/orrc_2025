// Import the MailService class from SendGrid
import { MailService } from "@sendgrid/mail";

// Create an instance of the MailService
const sgMail = new MailService();

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.warn(
    "SENDGRID_API_KEY environment variable is not set. Email functionality will be disabled.",
  );
} else {
  // Remove 'Bearer ' prefix if it exists to ensure correct formatting
  let apiKey = process.env.SENDGRID_API_KEY;
  if (apiKey.startsWith("Bearer ")) {
    apiKey = apiKey.substring(7);
  }

  // Set the API key and initialize SendGrid client
  sgMail.setApiKey(apiKey);
  console.log("SendGrid client initialized");
}

// Default from email if custom domain verification fails
// This should be an email verified in your SendGrid account
// IMPORTANT: You must verify this email in SendGrid Sender Authentication
// Go to settings > sender authentication in SendGrid dashboard and verify this email
const DEFAULT_FROM_EMAIL = "registration@stanatrailrace.ro"; // Replace with your verified email

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("Email not sent: SENDGRID_API_KEY is not set");
    return false;
  }

  console.log(`Attempting to send email to: ${params.to}, From: ${params.from}, Subject: ${params.subject}`);

  const msg = {
    to: params.to,
    from: params.from,
    subject: params.subject,
    text: params.text || "",
    html: params.html || "",
  };

  try {
    await sgMail.send(msg);
    console.log(`Email successfully sent to ${params.to}`);
    return true;
  } catch (error: any) {
    console.error("SendGrid email error:", error.message || "Unknown error");

    // Common error messaging without exposing sensitive data
    if (error.code === 401) {
      console.error("Authentication error: The SendGrid API key may be invalid or expired.");
    } else if (error.code === 403) {
      console.error("Authorization error: The SendGrid account may not have permission to send emails.");
    } else if (error.code === 400) {
      // Check for common domain verification issues
      const errors = error.response?.body?.errors || [];
      const hasDomainIssue = errors.some(
        (err: any) =>
          err.message &&
          (err.message.includes("domain") ||
            err.message.includes("sender") ||
            err.message.includes("from")),
      );

      if (hasDomainIssue) {
        console.error("Sender verification error: The 'from' email address may not be verified in your SendGrid account.");
      }
    }

    return false;
  }
}

export async function sendRegistrationConfirmationEmail(
  email: string,
  firstName: string,
  lastName: string,
  raceCategory: string,
  language: string = "en",
  participantId: number = 0,
  raceId: number = 0
): Promise<boolean> {
  type SupportedLanguages = "en" | "ro" | "fr" | "de" | "it" | "es";

  const subjects: Record<SupportedLanguages, string> = {
    en: "Stana de Vale Trail Race - Registration Confirmation",
    ro: "Stana de Vale Trail Race - Confirmare Înregistrare",
    fr: "Stana de Vale Trail Race - Confirmation d'Inscription",
    de: "Stana de Vale Trail Race - Anmeldebestätigung",
    it: "Stana de Vale Trail Race - Conferma di Registrazione",
    es: "Stana de Vale Trail Race - Confirmación de Registro",
  };

  const greetings: Record<SupportedLanguages, string> = {
    en: `Dear ${firstName} ${lastName},`,
    ro: `Dragă ${firstName} ${lastName},`,
    fr: `Cher/Chère ${firstName} ${lastName},`,
    de: `Liebe(r) ${firstName} ${lastName},`,
    it: `Gentile ${firstName} ${lastName},`,
    es: `Estimado/a ${firstName} ${lastName},`,
  };
  
  // Payment links and instructions
  const paymentInfo: Record<SupportedLanguages, string> = {
    en: `To complete your registration, please make the payment by clicking the button below:\n\nIf you have any issues with the payment process, please contact us at contact@stanatrailrace.ro.`,
    ro: `Pentru a finaliza înregistrarea, te rugăm să efectuezi plata făcând clic pe butonul de mai jos:\n\nDacă întâmpini probleme cu procesul de plată, te rugăm să ne contactezi la contact@stanatrailrace.ro.`,
    fr: `Pour compléter votre inscription, veuillez effectuer le paiement en cliquant sur le bouton ci-dessous:\n\nSi vous rencontrez des problèmes avec le processus de paiement, veuillez nous contacter à contact@stanatrailrace.ro.`,
    de: `Um Ihre Anmeldung abzuschließen, nehmen Sie bitte die Zahlung vor, indem Sie auf die Schaltfläche unten klicken:\n\nWenn Sie Probleme mit dem Zahlungsvorgang haben, kontaktieren Sie uns bitte unter contact@stanatrailrace.ro.`,
    it: `Per completare la registrazione, effettua il pagamento cliccando sul pulsante qui sotto:\n\nSe riscontri problemi con il processo di pagamento, contattaci all'indirizzo contact@stanatrailrace.ro.`,
    es: `Para completar tu registro, realiza el pago haciendo clic en el botón a continuación:\n\nSi tienes algún problema con el proceso de pago, contáctanos en contact@stanatrailrace.ro.`,
  };
  
  // Payment button text
  const paymentButtons: Record<SupportedLanguages, string> = {
    en: "Pay Now",
    ro: "Plătește Acum",
    fr: "Payer Maintenant",
    de: "Jetzt Bezahlen",
    it: "Paga Ora",
    es: "Pagar Ahora",
  };

  const messages: Record<SupportedLanguages, string> = {
    en: `Thank you for registering for Stana de Vale Trail Race! We're excited to have you join us for this spectacular mountain running event.\n\nYou have registered for the ${raceCategory} race. Please arrive at least 1 hour before your race start time to collect your race bib and race package.\n\n${paymentInfo["en"]}\n\nIf you have any questions, please contact us at contact@stanatrailrace.ro.\n\nSee you in the mountains!\n\nStana de Vale Trail Race Team`,
    ro: `Îți mulțumim pentru înregistrarea la Stana de Vale Trail Race! Suntem încântați să te avem alături de noi la acest eveniment spectaculos de alergare montană.\n\nTe-ai înregistrat pentru cursa ${raceCategory}. Te rugăm să ajungi cu cel puțin 1 oră înainte de ora de start pentru a-ți ridica numărul de concurs și pachetul de cursă.\n\n${paymentInfo["ro"]}\n\nDacă ai întrebări, te rugăm să ne contactezi la contact@stanatrailrace.ro.\n\nNe vedem în munți!\n\nEchipa Stana de Vale Trail Race`,
    fr: `Merci de vous être inscrit à Stana de Vale Trail Race ! Nous sommes ravis de vous compter parmi nous pour cet événement spectaculaire de course en montagne.\n\nVous vous êtes inscrit pour la course ${raceCategory}. Veuillez arriver au moins 1 heure avant l'heure de départ de votre course pour récupérer votre dossard et votre pack de course.\n\n${paymentInfo["fr"]}\n\nSi vous avez des questions, veuillez nous contacter à contact@stanatrailrace.ro.\n\nNous vous verrons dans les montagnes !\n\nL'équipe Stana de Vale Trail Race`,
    de: `Vielen Dank für Ihre Anmeldung zum Stana de Vale Trail Race! Wir freuen uns, Sie bei diesem spektakulären Berglauffest begrüßen zu dürfen.\n\nSie haben sich für das ${raceCategory}-Rennen angemeldet. Bitte kommen Sie mindestens 1 Stunde vor Ihrem Rennstart, um Ihre Startnummer und Ihr Rennpaket abzuholen.\n\n${paymentInfo["de"]}\n\nWenn Sie Fragen haben, kontaktieren Sie uns bitte unter contact@stanatrailrace.ro.\n\nWir sehen uns in den Bergen!\n\nIhr Stana de Vale Trail Race Team`,
    it: `Grazie per esserti registrato alla Stana de Vale Trail Race! Siamo entusiasti di averti con noi per questo spettacolare evento di corsa in montagna.\n\nTi sei registrato per la gara ${raceCategory}. Ti preghiamo di arrivare almeno 1 ora prima dell'orario di partenza della gara per ritirare il tuo pettorale e il pacco gara.\n\n${paymentInfo["it"]}\n\nPer qualsiasi domanda, contattaci all'indirizzo contact@stanatrailrace.ro.\n\nCi vediamo in montagna!\n\nIl team Stana de Vale Trail Race`,
    es: `¡Gracias por registrarte en la Stana de Vale Trail Race! Estamos emocionados de tenerte con nosotros para este espectacular evento de carrera de montaña.\n\nTe has registrado para la carrera ${raceCategory}. Por favor, llega al menos 1 hora antes de la hora de inicio de tu carrera para recoger tu dorsal y tu paquete de carrera.\n\n${paymentInfo["es"]}\n\nSi tienes alguna pregunta, contáctanos en contact@stanatrailrace.ro.\n\n¡Nos vemos en las montañas!\n\nEquipo Stana de Vale Trail Race`,
  };

  const lang = language in subjects ? (language as SupportedLanguages) : "en";

  // Create payment URL for the participant
  const baseUrl = "https://www.stanatrailrace.ro";
  const paymentUrl = `${baseUrl}/registration?pay=true&participantId=${participantId}&raceId=${raceId}`;
  
  // First try with custom domain
  try {
    const result = await sendEmail({
      to: email,
      from: DEFAULT_FROM_EMAIL, // Make sure this domain matches what you've verified in SendGrid
      subject: subjects[lang],
      text: `${greetings[lang]}\n\n${messages[lang]}\n\nPayment Link: ${paymentUrl}`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6dfd9; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2A6D50; margin-bottom: 10px;">Stana de Vale Trail Race</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">${greetings[lang]}</p>
        <div style="font-size: 16px; line-height: 1.5; color: #3E4A59;">
          ${messages[lang].replace(/\n\n/g, '</p><p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">').replace(/\n/g, "<br>")}
        </div>
        
        <!-- Payment Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${paymentUrl}" style="display: inline-block; background-color: #2A6D50; color: white; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px;">${paymentButtons[lang]}</a>
        </div>
        
        <div style="margin-top: 30px; border-top: 1px solid #e6dfd9; padding-top: 20px; text-align: center; font-size: 14px; color: #7D5A45;">
          <p>Stana de Vale Trail Race 2025</p>
          <p>July 4-5, 2025 • Stâna de Vale, Romania</p>
        </div>
      </div>`,
    });

    if (result) return true;

    // If domain verification is the issue, fall back to the default sender email
    console.log(
      "Trying fallback sender email due to possible domain verification issue...",
    );

    return await sendEmail({
      to: email,
      from: DEFAULT_FROM_EMAIL,
      subject: subjects[lang],
      text: `${greetings[lang]}\n\n${messages[lang]}\n\nPayment Link: ${paymentUrl}`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6dfd9; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2A6D50; margin-bottom: 10px;">Stana de Vale Trail Race</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">${greetings[lang]}</p>
        <div style="font-size: 16px; line-height: 1.5; color: #3E4A59;">
          ${messages[lang].replace(/\n\n/g, '</p><p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">').replace(/\n/g, "<br>")}
        </div>
        
        <!-- Payment Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${paymentUrl}" style="display: inline-block; background-color: #2A6D50; color: white; font-weight: bold; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px;">${paymentButtons[lang]}</a>
        </div>
        
        <div style="margin-top: 30px; border-top: 1px solid #e6dfd9; padding-top: 20px; text-align: center; font-size: 14px; color: #7D5A45;">
          <p>Stana de Vale Trail Race 2025</p>
          <p>July 4-5, 2025 • Stâna de Vale, Romania</p>
        </div>
      </div>`,
    });
  } catch (error) {
    console.error("Error in sendRegistrationConfirmationEmail:", error);
    return false;
  }
}
