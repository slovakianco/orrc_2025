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

// Define the supported languages type
type SupportedLanguages = "en" | "ro" | "fr" | "de" | "it" | "es";

// Helper function to get translations for email templates
function getEmailTranslations(language: SupportedLanguages = "en") {
  const translations: Record<string, Record<SupportedLanguages, string>> = {
    // Payment confirmation email translations
    paymentConfirmationSubject: {
      en: "Stana de Vale Trail Race - Payment Confirmation",
      ro: "Stana de Vale Trail Race - Confirmare Plată",
      fr: "Stana de Vale Trail Race - Confirmation de Paiement",
      de: "Stana de Vale Trail Race - Zahlungsbestätigung",
      it: "Stana de Vale Trail Race - Conferma di Pagamento",
      es: "Stana de Vale Trail Race - Confirmación de Pago"
    },
    paymentConfirmationTitle: {
      en: "Payment Confirmation",
      ro: "Confirmare Plată",
      fr: "Confirmation de Paiement",
      de: "Zahlungsbestätigung",
      it: "Conferma di Pagamento",
      es: "Confirmación de Pago"
    },
    paymentConfirmationSubtitle: {
      en: "Your registration is now complete!",
      ro: "Înregistrarea ta este acum completă!",
      fr: "Votre inscription est maintenant complète!",
      de: "Ihre Anmeldung ist jetzt vollständig!",
      it: "La tua registrazione è ora completata!",
      es: "¡Tu registro ahora está completo!"
    },
    greeting: {
      en: "Dear",
      ro: "Dragă",
      fr: "Cher/Chère",
      de: "Liebe(r)",
      it: "Gentile",
      es: "Estimado/a"
    },
    paymentConfirmationMessage: {
      en: "Thank you for completing your payment for the Stana de Vale Trail Race! Your registration is now confirmed, and we're excited to welcome you to this amazing mountain running event.",
      ro: "Îți mulțumim pentru finalizarea plății pentru Stana de Vale Trail Race! Înregistrarea ta este acum confirmată și suntem încântați să te întâmpinăm la acest eveniment uimitor de alergare montană.",
      fr: "Merci d'avoir effectué votre paiement pour la Stana de Vale Trail Race! Votre inscription est maintenant confirmée et nous sommes ravis de vous accueillir à cet incroyable événement de course en montagne.",
      de: "Vielen Dank für die Zahlung für das Stana de Vale Trail Race! Ihre Anmeldung ist nun bestätigt, und wir freuen uns, Sie bei diesem erstaunlichen Berglauf-Event begrüßen zu dürfen.",
      it: "Grazie per aver completato il pagamento per la Stana de Vale Trail Race! La tua registrazione è ora confermata e siamo entusiasti di accoglierti a questo incredibile evento di corsa in montagna.",
      es: "¡Gracias por completar tu pago para la Stana de Vale Trail Race! Tu registro ahora está confirmado y estamos emocionados de darte la bienvenida a este increíble evento de carrera de montaña."
    },
    raceDetails: {
      en: "Race Details",
      ro: "Detalii Cursă",
      fr: "Détails de la Course",
      de: "Renndetails",
      it: "Dettagli della Gara",
      es: "Detalles de la Carrera"
    },
    raceCategory: {
      en: "Race Category",
      ro: "Categorie Cursă",
      fr: "Catégorie de Course",
      de: "Rennkategorie",
      it: "Categoria Gara",
      es: "Categoría de Carrera"
    },
    raceDate: {
      en: "Race Date",
      ro: "Data Cursei",
      fr: "Date de la Course",
      de: "Renndatum",
      it: "Data della Gara",
      es: "Fecha de la Carrera"
    },
    raceLocation: {
      en: "Location",
      ro: "Locație",
      fr: "Lieu",
      de: "Ort",
      it: "Posizione",
      es: "Ubicación"
    },
    bibCollectionInfo: {
      en: "You will be able to collect your race bib and participant package at the race office on the day before the race or on race day. Please bring a valid ID for verification.",
      ro: "Vei putea ridica numărul de concurs și pachetul de participant de la biroul de cursă cu o zi înainte de cursă sau în ziua cursei. Te rugăm să aduci un act de identitate valid pentru verificare.",
      fr: "Vous pourrez récupérer votre dossard et votre pack participant au bureau de course la veille de la course ou le jour de la course. Veuillez apporter une pièce d'identité valide pour vérification.",
      de: "Sie können Ihre Startnummer und Ihr Teilnehmerpaket am Vortag des Rennens oder am Renntag im Rennbüro abholen. Bitte bringen Sie einen gültigen Ausweis zur Überprüfung mit.",
      it: "Potrai ritirare il tuo pettorale e il pacco gara presso l'ufficio gara il giorno prima della gara o il giorno della gara. Si prega di portare un documento d'identità valido per la verifica.",
      es: "Podrás recoger tu dorsal y paquete de participante en la oficina de la carrera el día anterior a la carrera o el día de la carrera. Por favor, trae una identificación válida para la verificación."
    },
    whatToExpectNext: {
      en: "In the coming weeks, we'll be sending you additional information about the race, including the detailed schedule, course maps, and recommendations for your stay in Stana de Vale.",
      ro: "În săptămânile următoare, îți vom trimite informații suplimentare despre cursă, inclusiv programul detaliat, hărțile traseului și recomandări pentru șederea ta în Stâna de Vale.",
      fr: "Dans les semaines à venir, nous vous enverrons des informations supplémentaires sur la course, y compris le programme détaillé, les cartes du parcours et des recommandations pour votre séjour à Stana de Vale.",
      de: "In den kommenden Wochen werden wir Ihnen zusätzliche Informationen über das Rennen zusenden, einschließlich des detaillierten Zeitplans, Streckenkarten und Empfehlungen für Ihren Aufenthalt in Stana de Vale.",
      it: "Nelle prossime settimane, ti invieremo ulteriori informazioni sulla gara, inclusi il programma dettagliato, le mappe del percorso e i consigli per il tuo soggiorno a Stana de Vale.",
      es: "En las próximas semanas, te enviaremos información adicional sobre la carrera, incluido el cronograma detallado, mapas de la ruta y recomendaciones para tu estancia en Stana de Vale."
    },
    preparationTips: {
      en: "Preparation Tips",
      ro: "Sfaturi de Pregătire",
      fr: "Conseils de Préparation",
      de: "Vorbereitungstipps",
      it: "Consigli di Preparazione",
      es: "Consejos de Preparación"
    },
    preparationTip1: {
      en: "Train on similar terrain with elevation changes",
      ro: "Antrenează-te pe teren similar cu schimbări de elevație",
      fr: "Entraînez-vous sur un terrain similaire avec des changements d'altitude",
      de: "Trainieren Sie auf ähnlichem Gelände mit Höhenunterschieden",
      it: "Allenati su terreni simili con cambi di elevazione",
      es: "Entrena en terreno similar con cambios de elevación"
    },
    preparationTip2: {
      en: "Ensure you have proper trail running shoes and equipment",
      ro: "Asigură-te că ai pantofi și echipament adecvat pentru alergare montană",
      fr: "Assurez-vous d'avoir des chaussures et de l'équipement de trail running appropriés",
      de: "Stellen Sie sicher, dass Sie geeignete Trail-Running-Schuhe und Ausrüstung haben",
      it: "Assicurati di avere scarpe ed equipaggiamento adeguati per il trail running",
      es: "Asegúrate de tener calzado y equipo adecuados para trail running"
    },
    preparationTip3: {
      en: "Check the weather forecast and pack accordingly",
      ro: "Verifică prognoza meteo și pregătește-te în consecință",
      fr: "Vérifiez les prévisions météorologiques et préparez-vous en conséquence",
      de: "Überprüfen Sie die Wettervorhersage und packen Sie entsprechend",
      it: "Controlla le previsioni meteo e preparati di conseguenza",
      es: "Revisa el pronóstico del tiempo y prepárate adecuadamente"
    },
    preparationTip4: {
      en: "Familiarize yourself with the race route and elevation profile",
      ro: "Familiarizează-te cu traseul cursei și profilul de elevație",
      fr: "Familiarisez-vous avec le parcours de la course et le profil d'altitude",
      de: "Machen Sie sich mit der Rennstrecke und dem Höhenprofil vertraut",
      it: "Familiarizza con il percorso di gara e il profilo altimetrico",
      es: "Familiarízate con la ruta de la carrera y el perfil de elevación"
    },
    questions: {
      en: "If you have any questions about the race, accommodation, or anything else, please don't hesitate to contact us at contact@stanatrailrace.ro.",
      ro: "Dacă ai întrebări despre cursă, cazare sau orice altceva, nu ezita să ne contactezi la contact@stanatrailrace.ro.",
      fr: "Si vous avez des questions sur la course, l'hébergement ou autre chose, n'hésitez pas à nous contacter à contact@stanatrailrace.ro.",
      de: "Wenn Sie Fragen zum Rennen, zur Unterkunft oder zu anderen Dingen haben, zögern Sie bitte nicht, uns unter contact@stanatrailrace.ro zu kontaktieren.",
      it: "Se hai domande sulla gara, l'alloggio o qualsiasi altra cosa, non esitare a contattarci a contact@stanatrailrace.ro.",
      es: "Si tienes alguna pregunta sobre la carrera, el alojamiento o cualquier otra cosa, no dudes en contactarnos en contact@stanatrailrace.ro."
    },
    closingMessage: {
      en: "We look forward to seeing you at the starting line!",
      ro: "Aşteptăm cu nerăbdare să te vedem la linia de start!",
      fr: "Nous avons hâte de vous voir sur la ligne de départ!",
      de: "Wir freuen uns darauf, Sie an der Startlinie zu sehen!",
      it: "Non vediamo l'ora di vederti alla linea di partenza!",
      es: "¡Esperamos verte en la línea de salida!"
    },
    signature: {
      en: "Best regards,",
      ro: "Cu stimă,",
      fr: "Cordialement,",
      de: "Mit freundlichen Grüßen,",
      it: "Cordiali saluti,",
      es: "Saludos cordiales,"
    },
    allRightsReserved: {
      en: "All rights reserved",
      ro: "Toate drepturile rezervate",
      fr: "Tous droits réservés",
      de: "Alle Rechte vorbehalten",
      it: "Tutti i diritti riservati",
      es: "Todos los derechos reservados"
    }
  };

  // Return translations in requested language or English as fallback
  const lang = translations.greeting[language] ? language : "en";
  
  const result: Record<string, string> = {};
  
  // Collect all translations for the requested language
  Object.keys(translations).forEach(key => {
    result[key] = translations[key][lang];
  });
  
  return result;
}

export async function sendPaymentConfirmationEmail(
  to: string,
  firstname: string,
  lastname: string,
  raceCategory: string,
  language: SupportedLanguages = "en"
): Promise<boolean> {
  try {
    // Get translations for the email
    const translations = getEmailTranslations(language);
    
    // Payment confirmation email content
    const subject = translations.paymentConfirmationSubject;
    
    // Format the dates 5 july 2025
    const eventDate = new Date('2025-07-05');
    const formattedEventDate = eventDate.toLocaleDateString(language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Ensure firstname and lastname are not undefined and properly trimmed
    const safeFirstName = firstname ? firstname.trim() : 'Runner';
    const safeLastName = lastname ? lastname.trim() : '';
    const fullName = safeFirstName + (safeLastName ? ' ' + safeLastName : '');
    
    // HTML email content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6dfd9; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2A6D50; margin-bottom: 10px;">${translations.paymentConfirmationTitle}</h1>
          <p style="font-size: 18px; color: #3E4A59;">${translations.paymentConfirmationSubtitle}</p>
        </div>
        
        <div style="font-size: 16px; line-height: 1.5; color: #3E4A59;">
          <p>${translations.greeting} ${fullName},</p>
          
          <p>${translations.paymentConfirmationMessage}</p>
          
          <div style="background-color: #f1f5f2; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2A6D50; margin-top: 0;">${translations.raceDetails}:</h3>
            <p><strong>${translations.raceCategory}:</strong> ${raceCategory}</p>
            <p><strong>${translations.raceDate}:</strong> ${formattedEventDate}</p>
            <p><strong>${translations.raceLocation}:</strong> Stâna de Vale, Romania</p>
          </div>
          
          <p>${translations.bibCollectionInfo}</p>
          
          <p>${translations.whatToExpectNext}</p>
          
          <p>${translations.questions}</p>
          
          <p>${translations.closingMessage}</p>
          
          <p>${translations.signature}<br>
          Stana de Vale Trail Race Team</p>
        </div>
        
        <div style="margin-top: 30px; border-top: 1px solid #e6dfd9; padding-top: 20px; text-align: center; font-size: 14px; color: #7D5A45;">
          <p>Stana de Vale Trail Race 2025 • Stâna de Vale, Romania</p>
          <p>© 2025 Stana de Vale Trail Race. ${translations.allRightsReserved}.</p>
        </div>
      </div>
    `;
    
    // Plain text content for email clients that don't support HTML
    const text = `
${translations.paymentConfirmationTitle}
${translations.paymentConfirmationSubtitle}

${translations.greeting} ${fullName},

${translations.paymentConfirmationMessage}

== ${translations.raceDetails} ==
${translations.raceCategory}: ${raceCategory}
${translations.raceDate}: ${formattedEventDate}
${translations.raceLocation}: Stâna de Vale, Romania

${translations.bibCollectionInfo}

${translations.whatToExpectNext}

== ${translations.preparationTips} ==
* ${translations.preparationTip1}
* ${translations.preparationTip2}
* ${translations.preparationTip3}
* ${translations.preparationTip4}

${translations.questions}

${translations.closingMessage}

${translations.signature}
Stana de Vale Trail Race Team

Stana de Vale Trail Race 2025 • Stâna de Vale, Romania
© 2025 Stana de Vale Trail Race. ${translations.allRightsReserved}.
    `;
    
    // Send the email
    return await sendEmail({
      to,
      from: DEFAULT_FROM_EMAIL,
      subject,
      text,
      html
    });
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return false;
  }
}

import { createPaymentLink } from './routes';

export async function sendRegistrationConfirmationEmail(
  email: string,
  firstname: string,
  lastname: string,
  raceCategory: string,
  language: string = "en",
  participantId: number = 0,
  raceid: number = 0,
  paymentLink?: string // Optional payment link parameter
): Promise<boolean> {
  type SupportedLanguages = "en" | "ro" | "fr" | "de" | "it" | "es";
  
  // Import Stripe to create a payment link if one wasn't provided
  const stripe = global.stripe;
  
  // We'll create a payment link without storage dependency to avoid circular issues

  const subjects: Record<SupportedLanguages, string> = {
    en: "Stana de Vale Trail Race - Registration Confirmation",
    ro: "Stana de Vale Trail Race - Confirmare Înregistrare",
    fr: "Stana de Vale Trail Race - Confirmation d'Inscription",
    de: "Stana de Vale Trail Race - Anmeldebestätigung",
    it: "Stana de Vale Trail Race - Conferma di Registrazione",
    es: "Stana de Vale Trail Race - Confirmación de Registro",
  };

  // Ensure firstname and lastname are not undefined
  const safeFirstName = firstname ? firstname.trim() : 'Runner';
  const safeLastName = lastname ? lastname.trim() : '';
  const fullName = safeFirstName + (safeLastName ? ' ' + safeLastName : '');

  const greetings: Record<SupportedLanguages, string> = {
    en: `Dear ${fullName},`,
    ro: `Dragă ${fullName},`,
    fr: `Cher/Chère ${fullName},`,
    de: `Liebe(r) ${fullName},`,
    it: `Gentile ${fullName},`,
    es: `Estimado/a ${fullName},`,
  };
  
  // Payment links and instructions
  const paymentInfo: Record<SupportedLanguages, string> = {
    en: `To complete your registration, please make the payment by clicking the payment link below:\n\nIf you have any issues with the payment process, please contact us at contact@stanatrailrace.ro.`,
    ro: `Pentru a finaliza înregistrarea, te rugăm să efectuezi plata folosind link-ul de mai jos:\n\nDacă întâmpini probleme cu procesul de plată, te rugăm să ne contactezi la contact@stanatrailrace.ro.`,
    fr: `Pour compléter votre inscription, veuillez effectuer le paiement en utilisant le lien ci-dessous:\n\nSi vous rencontrez des problèmes avec le processus de paiement, veuillez nous contacter à contact@stanatrailrace.ro.`,
    de: `Um Ihre Anmeldung abzuschließen, nehmen Sie bitte die Zahlung vor, indem Sie den unten stehenden Link verwenden:\n\nWenn Sie Probleme mit dem Zahlungsvorgang haben, kontaktieren Sie uns bitte unter contact@stanatrailrace.ro.`,
    it: `Per completare la registrazione, effettua il pagamento utilizzando il link qui sotto:\n\nSe riscontri problemi con il processo di pagamento, contattaci all'indirizzo contact@stanatrailrace.ro.`,
    es: `Para completar tu registro, realiza el pago utilizando el enlace a continuación:\n\nSi tienes algún problema con el proceso de pago, contáctanos en contact@stanatrailrace.ro.`,
  };
  
  // Payment link text
  const paymentLinkTexts: Record<SupportedLanguages, string> = {
    en: "Click here to pay",
    ro: "Click aici pentru plată",
    fr: "Cliquez ici pour payer",
    de: "Klicken Sie hier, um zu bezahlen",
    it: "Clicca qui per pagare",
    es: "Haz clic aquí para pagar",
  };

  const messages: Record<SupportedLanguages, string> = {
    en: `Thank you for registering for Stana de Vale Trail Race! We're excited to have you join us for this spectacular mountain running event.\n\nYou have registered for the ${raceCategory} race.\n\n${paymentInfo["en"]}\n\nIf you have any questions, please contact us at contact@stanatrailrace.ro.\n\nSee you in the mountains!\n\nStana de Vale Trail Race Team`,
    ro: `Îți mulțumim pentru înregistrarea la Stana de Vale Trail Race! Suntem încântați să te avem alături de noi la acest eveniment spectaculos de alergare montană.\n\nTe-ai înregistrat pentru cursa ${raceCategory}.\n\n${paymentInfo["ro"]}\n\nDacă ai întrebări, te rugăm să ne contactezi la contact@stanatrailrace.ro.\n\nNe vedem în munți!\n\nEchipa Stana de Vale Trail Race`,
    fr: `Merci de vous être inscrit à Stana de Vale Trail Race ! Nous sommes ravis de vous compter parmi nous pour cet événement spectaculaire de course en montagne.\n\nVous vous êtes inscrit pour la course ${raceCategory}.\n\n${paymentInfo["fr"]}\n\nSi vous avez des questions, veuillez nous contacter à contact@stanatrailrace.ro.\n\nNous vous verrons dans les montagnes !\n\nL'équipe Stana de Vale Trail Race`,
    de: `Vielen Dank für Ihre Anmeldung zum Stana de Vale Trail Race! Wir freuen uns, Sie bei diesem spektakulären Berglauffest begrüßen zu dürfen.\n\nSie haben sich für das ${raceCategory}-Rennen angemeldet.\n\n${paymentInfo["de"]}\n\nWenn Sie Fragen haben, kontaktieren Sie uns bitte unter contact@stanatrailrace.ro.\n\nWir sehen uns in den Bergen!\n\nIhr Stana de Vale Trail Race Team`,
    it: `Grazie per esserti registrato alla Stana de Vale Trail Race! Siamo entusiasti di averti con noi per questo spettacolare evento di corsa in montagna.\n\nTi sei registrato per la gara ${raceCategory}.\n\n${paymentInfo["it"]}\n\nPer qualsiasi domanda, contattaci all'indirizzo contact@stanatrailrace.ro.\n\nCi vediamo in montagna!\n\nIl team Stana de Vale Trail Race`,
    es: `¡Gracias por registrarte en la Stana de Vale Trail Race! Estamos emocionados de tenerte con nosotros para este espectacular evento de carrera de montaña.\n\nTe has registrado para la carrera ${raceCategory}.\n\n${paymentInfo["es"]}\n\nSi tienes alguna pregunta, contáctanos en contact@stanatrailrace.ro.\n\n¡Nos vemos en las montañas!\n\nEquipo Stana de Vale Trail Race`,
  };

  const lang = language in subjects ? (language as SupportedLanguages) : "en";

  try {
    // Get participant data to check if they're an EMA participant
    // Import storage directly to avoid TypeScript errors with dynamic imports
    const { storage } = await import('./storage');
    
    // Retrieve participant data
    const participant = await storage.getParticipantById(participantId);
    
    // Default to false if we can't determine
    const isEmaParticipant = participant?.isemaparticipant === true || 
                            participant?.isEmaParticipant === true || 
                            false;
    
    console.log(`Generating payment link for participant ID: ${participantId}, race ID: ${raceid}, EMA status: ${isEmaParticipant}`);
    
    // Create Stripe payment link
    // For amount, we'll use 0 since the actual amount will be calculated in the createPaymentLink function
    const stripePaymentLink = await createPaymentLink(0, participantId, raceid, isEmaParticipant);
    
    // If we couldn't create a payment link, fall back to the registration success page
    const fallbackPaymentUrl = `https://stanatrailrace.ro/registration-success?participantId=${participantId}&raceid=${raceid}`;
    
    // Use the Stripe payment link if available, otherwise use the fallback
    const paymentUrl = stripePaymentLink || fallbackPaymentUrl;
    
    console.log(`Using payment URL: ${paymentUrl}`);
    
    // First try with custom domain
    
    // Create greeting with the safe name
    const greetingWithName = lang === 'en' ? 
      `Dear ${fullName},` : 
      lang === 'ro' ? 
        `Dragă ${fullName},` : 
        lang === 'fr' ? 
          `Cher/Chère ${fullName},` : 
          lang === 'de' ? 
            `Liebe(r) ${fullName},` : 
            lang === 'it' ? 
              `Gentile ${fullName},` : 
              `Estimado/a ${fullName},`;
    
    const result = await sendEmail({
      to: email,
      from: DEFAULT_FROM_EMAIL, // Make sure this domain matches what you've verified in SendGrid
      subject: subjects[lang],
      text: `${greetingWithName}\n\n${messages[lang]}\n\nPayment Link: ${paymentUrl}`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6dfd9; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2A6D50; margin-bottom: 10px;">Stana de Vale Trail Race</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">${greetingWithName}</p>
        <div style="font-size: 16px; line-height: 1.5; color: #3E4A59;">
          ${messages[lang].replace(/\n\n/g, '</p><p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">').replace(/\n/g, "<br>")}
        </div>
        
        <!-- Payment Link styled as a text link -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${paymentUrl}" style="display: inline-block; color: #2A6D50; font-weight: bold; text-decoration: underline; font-size: 18px;">${paymentLinkTexts[lang]}</a>
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
      text: `${greetingWithName}\n\n${messages[lang]}\n\nPayment Link: ${paymentUrl}`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6dfd9; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2A6D50; margin-bottom: 10px;">Stana de Vale Trail Race</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">${greetingWithName}</p>
        <div style="font-size: 16px; line-height: 1.5; color: #3E4A59;">
          ${messages[lang].replace(/\n\n/g, '</p><p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">').replace(/\n/g, "<br>")}
        </div>
        
        <!-- Payment Link styled as a text link -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${paymentUrl}" style="display: inline-block; color: #2A6D50; font-weight: bold; text-decoration: underline; font-size: 18px;">${paymentLinkTexts[lang]}</a>
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
