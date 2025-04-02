// Import the MailService class from SendGrid
import { MailService } from "@sendgrid/mail";

// Create an instance of the MailService
const sgMail = new MailService();

// TEMPORARY: Hardcoded API key for testing purposes
const HARDCODED_API_KEY = "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";

console.log("Using hardcoded SendGrid API key for testing");
sgMail.setApiKey(HARDCODED_API_KEY);

// Default from email if custom domain verification fails
// This should be an email verified in your SendGrid account
// Users need to verify sender identity in SendGrid dashboard
const DEFAULT_FROM_EMAIL = "test@example.com"; // Using generic email for testing
// original was: registration@stanatrailrace.ro

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  // Using hardcoded key for testing, so we don't need to check for environment variable
  console.log("Using hardcoded SendGrid API key for testing email sending");

  console.log("Attempting to send email to:", params.to);
  console.log("From:", params.from);
  console.log("Subject:", params.subject);

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
    console.error("SendGrid email error:", error);

    // Additional debugging for most common SendGrid errors
    if (error.code === 401) {
      console.error(
        "Authentication error: The SendGrid API key may be invalid or expired.",
      );
      console.error(
        "Please ensure you've provided a valid API key. It should start with 'SG.' and not include 'Bearer '.",
      );
    } else if (error.code === 403) {
      console.error(
        "Authorization error: The SendGrid account may not have permission to send emails.",
      );
      console.error(
        "Please ensure your SendGrid account has the 'Mail Send' permission enabled.",
      );
    } else if (
      error.code === 400 ||
      (error.response && error.response.body && error.response.body.errors)
    ) {
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
        console.error(
          "Sender verification error: The 'from' email address may not be verified in your SendGrid account.",
        );
        console.error(
          `Make sure the email address '${params.from}' is verified in SendGrid. Either verify the domain or use a single sender verification.`,
        );
      }
    }

    if (error.response && error.response.body) {
      console.error(
        "SendGrid API response body:",
        JSON.stringify(error.response.body, null, 2),
      );

      if (error.response.body.errors) {
        console.error(
          "SendGrid API errors:",
          JSON.stringify(error.response.body.errors, null, 2),
        );
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

  const messages: Record<SupportedLanguages, string> = {
    en: `Thank you for registering for Stana de Vale Trail Race! We're excited to have you join us for this spectacular mountain running event.\n\nYou have registered for the ${raceCategory} race. Please arrive at least 1 hour before your race start time to collect your race bib and race package.\n\nIf you have any questions, please contact us at info@stanatrailrace.ro.\n\nSee you in the mountains!\n\nStana de Vale Trail Race Team`,
    ro: `Îți mulțumim pentru înregistrarea la Stana de Vale Trail Race! Suntem încântați să te avem alături de noi la acest eveniment spectaculos de alergare montană.\n\nTe-ai înregistrat pentru cursa ${raceCategory}. Te rugăm să ajungi cu cel puțin 1 oră înainte de ora de start pentru a-ți ridica numărul de concurs și pachetul de cursă.\n\nDacă ai întrebări, te rugăm să ne contactezi la info@stanatrailrace.ro.\n\nNe vedem în munți!\n\nEchipa Stana de Vale Trail Race`,
    fr: `Merci de vous être inscrit à Stana de Vale Trail Race ! Nous sommes ravis de vous compter parmi nous pour cet événement spectaculaire de course en montagne.\n\nVous vous êtes inscrit pour la course ${raceCategory}. Veuillez arriver au moins 1 heure avant l'heure de départ de votre course pour récupérer votre dossard et votre pack de course.\n\nSi vous avez des questions, veuillez nous contacter à info@stanatrailrace.ro.\n\nNous vous verrons dans les montagnes !\n\nL'équipe Stana de Vale Trail Race`,
    de: `Vielen Dank für Ihre Anmeldung zum Stana de Vale Trail Race! Wir freuen uns, Sie bei diesem spektakulären Berglauffest begrüßen zu dürfen.\n\nSie haben sich für das ${raceCategory}-Rennen angemeldet. Bitte kommen Sie mindestens 1 Stunde vor Ihrem Rennstart, um Ihre Startnummer und Ihr Rennpaket abzuholen.\n\nWenn Sie Fragen haben, kontaktieren Sie uns bitte unter info@stanatrailrace.ro.\n\nWir sehen uns in den Bergen!\n\nIhr Stana de Vale Trail Race Team`,
    it: `Grazie per esserti registrato alla Stana de Vale Trail Race! Siamo entusiasti di averti con noi per questo spettacolare evento di corsa in montagna.\n\nTi sei registrato per la gara ${raceCategory}. Ti preghiamo di arrivare almeno 1 ora prima dell'orario di partenza della gara per ritirare il tuo pettorale e il pacco gara.\n\nPer qualsiasi domanda, contattaci all'indirizzo info@stanatrailrace.ro.\n\nCi vediamo in montagna!\n\nIl team Stana de Vale Trail Race`,
    es: `¡Gracias por registrarte en la Stana de Vale Trail Race! Estamos emocionados de tenerte con nosotros para este espectacular evento de carrera de montaña.\n\nTe has registrado para la carrera ${raceCategory}. Por favor, llega al menos 1 hora antes de la hora de inicio de tu carrera para recoger tu dorsal y tu paquete de carrera.\n\nSi tienes alguna pregunta, contáctanos en info@stanatrailrace.ro.\n\n¡Nos vemos en las montañas!\n\nEquipo Stana de Vale Trail Race`,
  };

  const lang = language in subjects ? (language as SupportedLanguages) : "en";

  // For testing, skip the custom domain attempt and go straight to a generic test email
  try {
    console.log("Using generic test email address for sender");
    
    // Use a single attempt with the test email address
    return await sendEmail({
      to: email,
      from: DEFAULT_FROM_EMAIL, // Using our test sender email
      subject: subjects[lang],
      text: `${greetings[lang]}\n\n${messages[lang]}`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6dfd9; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2A6D50; margin-bottom: 10px;">Stana de Vale Trail Race</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">${greetings[lang]}</p>
        <div style="font-size: 16px; line-height: 1.5; color: #3E4A59;">
          ${messages[lang].replace(/\n\n/g, '</p><p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">').replace(/\n/g, "<br>")}
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
