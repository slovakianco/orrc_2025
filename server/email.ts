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
  participantId?: number,
  paymentUrl?: string,
  isPaymentConfirmation: boolean = false,
): Promise<boolean> {
  type SupportedLanguages = "en" | "ro" | "fr" | "de" | "it" | "es";

  // Define different subjects for registration vs payment confirmation
  const subjects: Record<SupportedLanguages, string> = isPaymentConfirmation
    ? {
        en: "Stana de Vale Trail Race - Payment Confirmation",
        ro: "Stana de Vale Trail Race - Confirmare Plată",
        fr: "Stana de Vale Trail Race - Confirmation de Paiement",
        de: "Stana de Vale Trail Race - Zahlungsbestätigung",
        it: "Stana de Vale Trail Race - Conferma di Pagamento",
        es: "Stana de Vale Trail Race - Confirmación de Pago",
      }
    : {
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

  // Payment-related messages for each language
  const paymentMessages: Record<SupportedLanguages, string> = {
    en: paymentUrl 
      ? `To complete your registration, please proceed with the payment using the link below:\n\n${paymentUrl}\n\nYour registration will be fully confirmed after the payment is completed.`
      : "",
    ro: paymentUrl 
      ? `Pentru a finaliza înregistrarea, te rugăm să efectuezi plata folosind link-ul de mai jos:\n\n${paymentUrl}\n\nÎnregistrarea ta va fi confirmată după finalizarea plății.`
      : "",
    fr: paymentUrl 
      ? `Pour compléter votre inscription, veuillez procéder au paiement en utilisant le lien ci-dessous:\n\n${paymentUrl}\n\nVotre inscription sera pleinement confirmée après la finalisation du paiement.`
      : "",
    de: paymentUrl 
      ? `Um Ihre Anmeldung abzuschließen, führen Sie bitte die Zahlung über den untenstehenden Link durch:\n\n${paymentUrl}\n\nIhre Anmeldung wird nach Abschluss der Zahlung vollständig bestätigt.`
      : "",
    it: paymentUrl 
      ? `Per completare la tua registrazione, procedi con il pagamento utilizzando il link qui sotto:\n\n${paymentUrl}\n\nLa tua registrazione sarà pienamente confermata dopo il completamento del pagamento.`
      : "",
    es: paymentUrl 
      ? `Para completar tu registro, procede con el pago utilizando el enlace a continuación:\n\n${paymentUrl}\n\nTu registro será completamente confirmado después de que se complete el pago.`
      : "",
  };

  // Payment confirmation messages
  const paymentConfirmationMessages: Record<SupportedLanguages, string> = {
    en: `Thank you for completing your payment for the Stana de Vale Trail Race! Your registration for the ${raceCategory} is now fully confirmed.\n\nWe're excited to have you join us for this spectacular mountain running event. Please arrive at least 1 hour before your race start time to collect your race bib and race package.\n\nYour registration number: ${participantId || 'N/A'}\n\nIf you have any questions, please contact us at contact@stanatrailrace.ro.\n\nSee you in the mountains!\n\nStana de Vale Trail Race Team`,
    ro: `Îți mulțumim pentru finalizarea plății pentru Stana de Vale Trail Race! Înregistrarea ta pentru cursa ${raceCategory} este acum complet confirmată.\n\nSuntem încântați să te avem alături de noi la acest eveniment spectaculos de alergare montană. Te rugăm să ajungi cu cel puțin 1 oră înainte de ora de start pentru a-ți ridica numărul de concurs și pachetul de cursă.\n\nNumărul tău de înregistrare: ${participantId || 'N/A'}\n\nDacă ai întrebări, te rugăm să ne contactezi la contact@stanatrailrace.ro.\n\nNe vedem în munți!\n\nEchipa Stana de Vale Trail Race`,
    fr: `Merci d'avoir effectué votre paiement pour la Stana de Vale Trail Race ! Votre inscription à la course ${raceCategory} est maintenant entièrement confirmée.\n\nNous sommes ravis de vous compter parmi nous pour cet événement spectaculaire de course en montagne. Veuillez arriver au moins 1 heure avant l'heure de départ de votre course pour récupérer votre dossard et votre pack de course.\n\nVotre numéro d'inscription: ${participantId || 'N/A'}\n\nSi vous avez des questions, veuillez nous contacter à contact@stanatrailrace.ro.\n\nNous vous verrons dans les montagnes !\n\nL'équipe Stana de Vale Trail Race`,
    de: `Vielen Dank für den Abschluss Ihrer Zahlung für das Stana de Vale Trail Race! Ihre Anmeldung für das ${raceCategory}-Rennen ist jetzt vollständig bestätigt.\n\nWir freuen uns, Sie bei diesem spektakulären Berglauffest begrüßen zu dürfen. Bitte kommen Sie mindestens 1 Stunde vor Ihrem Rennstart, um Ihre Startnummer und Ihr Rennpaket abzuholen.\n\nIhre Registrierungsnummer: ${participantId || 'N/A'}\n\nWenn Sie Fragen haben, kontaktieren Sie uns bitte unter contact@stanatrailrace.ro.\n\nWir sehen uns in den Bergen!\n\nIhr Stana de Vale Trail Race Team`,
    it: `Grazie per aver completato il pagamento per la Stana de Vale Trail Race! La tua iscrizione alla gara ${raceCategory} è ora pienamente confermata.\n\nSiamo entusiasti di averti con noi per questo spettacolare evento di corsa in montagna. Ti preghiamo di arrivare almeno 1 ora prima dell'orario di partenza della gara per ritirare il tuo pettorale e il pacco gara.\n\nIl tuo numero di registrazione: ${participantId || 'N/A'}\n\nPer qualsiasi domanda, contattaci all'indirizzo contact@stanatrailrace.ro.\n\nCi vediamo in montagna!\n\nIl team Stana de Vale Trail Race`,
    es: `¡Gracias por completar tu pago para la Stana de Vale Trail Race! Tu registro para la carrera ${raceCategory} ahora está completamente confirmado.\n\nEstamos emocionados de tenerte con nosotros para este espectacular evento de carrera de montaña. Por favor, llega al menos 1 hora antes de la hora de inicio de tu carrera para recoger tu dorsal y tu paquete de carrera.\n\nTu número de registro: ${participantId || 'N/A'}\n\nSi tienes alguna pregunta, contáctanos en contact@stanatrailrace.ro.\n\n¡Nos vemos en las montañas!\n\nEquipo Stana de Vale Trail Race`,
  };

  // Regular registration messages
  const registrationMessages: Record<SupportedLanguages, string> = {
    en: `Thank you for registering for Stana de Vale Trail Race! We're excited to have you join us for this spectacular mountain running event.\n\nYou have registered for the ${raceCategory} race. Please arrive at least 1 hour before your race start time to collect your race bib and race package.\n\n${paymentMessages.en ? paymentMessages.en + "\n\n" : ""}If you have any questions, please contact us at contact@stanatrailrace.ro.\n\nSee you in the mountains!\n\nStana de Vale Trail Race Team`,
    ro: `Îți mulțumim pentru înregistrarea la Stana de Vale Trail Race! Suntem încântați să te avem alături de noi la acest eveniment spectaculos de alergare montană.\n\nTe-ai înregistrat pentru cursa ${raceCategory}. Te rugăm să ajungi cu cel puțin 1 oră înainte de ora de start pentru a-ți ridica numărul de concurs și pachetul de cursă.\n\n${paymentMessages.ro ? paymentMessages.ro + "\n\n" : ""}Dacă ai întrebări, te rugăm să ne contactezi la contact@stanatrailrace.ro.\n\nNe vedem în munți!\n\nEchipa Stana de Vale Trail Race`,
    fr: `Merci de vous être inscrit à Stana de Vale Trail Race ! Nous sommes ravis de vous compter parmi nous pour cet événement spectaculaire de course en montagne.\n\nVous vous êtes inscrit pour la course ${raceCategory}. Veuillez arriver au moins 1 heure avant l'heure de départ de votre course pour récupérer votre dossard et votre pack de course.\n\n${paymentMessages.fr ? paymentMessages.fr + "\n\n" : ""}Si vous avez des questions, veuillez nous contacter à contact@stanatrailrace.ro.\n\nNous vous verrons dans les montagnes !\n\nL'équipe Stana de Vale Trail Race`,
    de: `Vielen Dank für Ihre Anmeldung zum Stana de Vale Trail Race! Wir freuen uns, Sie bei diesem spektakulären Berglauffest begrüßen zu dürfen.\n\nSie haben sich für das ${raceCategory}-Rennen angemeldet. Bitte kommen Sie mindestens 1 Stunde vor Ihrem Rennstart, um Ihre Startnummer und Ihr Rennpaket abzuholen.\n\n${paymentMessages.de ? paymentMessages.de + "\n\n" : ""}Wenn Sie Fragen haben, kontaktieren Sie uns bitte unter contact@stanatrailrace.ro.\n\nWir sehen uns in den Bergen!\n\nIhr Stana de Vale Trail Race Team`,
    it: `Grazie per esserti registrato alla Stana de Vale Trail Race! Siamo entusiasti di averti con noi per questo spettacolare evento di corsa in montagna.\n\nTi sei registrato per la gara ${raceCategory}. Ti preghiamo di arrivare almeno 1 ora prima dell'orario di partenza della gara per ritirare il tuo pettorale e il pacco gara.\n\n${paymentMessages.it ? paymentMessages.it + "\n\n" : ""}Per qualsiasi domanda, contattaci all'indirizzo contact@stanatrailrace.ro.\n\nCi vediamo in montagna!\n\nIl team Stana de Vale Trail Race`,
    es: `¡Gracias por registrarte en la Stana de Vale Trail Race! Estamos emocionados de tenerte con nosotros para este espectacular evento de carrera de montaña.\n\nTe has registrado para la carrera ${raceCategory}. Por favor, llega al menos 1 hora antes de la hora de inicio de tu carrera para recoger tu dorsal y tu paquete de carrera.\n\n${paymentMessages.es ? paymentMessages.es + "\n\n" : ""}Si tienes alguna pregunta, contáctanos en contact@stanatrailrace.ro.\n\n¡Nos vemos en las montañas!\n\nEquipo Stana de Vale Trail Race`,
  };

  // Choose which message set to use based on whether this is a payment confirmation
  const messages: Record<SupportedLanguages, string> = isPaymentConfirmation
    ? paymentConfirmationMessages
    : registrationMessages;

  const lang = language in subjects ? (language as SupportedLanguages) : "en";

  // Create payment button HTML if payment URL is available
  const paymentButtonHTML = paymentUrl ? `
    <div style="text-align: center; margin: 25px 0;">
      <a href="${paymentUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2A6D50; color: white; text-decoration: none; font-weight: 600; border-radius: 6px; font-size: 16px;">
        ${
          lang === 'en' ? 'Pay Now' :
          lang === 'ro' ? 'Plătește Acum' :
          lang === 'fr' ? 'Payer Maintenant' :
          lang === 'de' ? 'Jetzt Bezahlen' :
          lang === 'it' ? 'Paga Ora' :
                          'Pagar Ahora'
        }
      </a>
    </div>
  ` : '';
  
  // Prepare the full HTML email template
  const emailHTML = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6dfd9; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #2A6D50; margin-bottom: 10px;">Stana de Vale Trail Race</h1>
    </div>
    <p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">${greetings[lang]}</p>
    <div style="font-size: 16px; line-height: 1.5; color: #3E4A59;">
      ${messages[lang].replace(/\n\n/g, '</p><p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">').replace(/\n/g, "<br>")}
    </div>
    ${paymentButtonHTML}
    <div style="margin-top: 30px; border-top: 1px solid #e6dfd9; padding-top: 20px; text-align: center; font-size: 14px; color: #7D5A45;">
      <p>Stana de Vale Trail Race 2025</p>
      <p>July 4-5, 2025 • Stâna de Vale, Romania</p>
    </div>
  </div>`;

  // First try with custom domain
  try {
    const result = await sendEmail({
      to: email,
      from: DEFAULT_FROM_EMAIL, // Make sure this domain matches what you've verified in SendGrid
      subject: subjects[lang],
      text: `${greetings[lang]}\n\n${messages[lang]}`,
      html: emailHTML,
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
      text: `${greetings[lang]}\n\n${messages[lang]}`,
      html: emailHTML,
    });
  } catch (error) {
    console.error("Error in sendRegistrationConfirmationEmail:", error);
    return false;
  }
}
