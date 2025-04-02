import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable is not set. Email functionality will be disabled.");
}

// Default from email if custom domain verification fails
// This should be an email verified in your SendGrid account
const DEFAULT_FROM_EMAIL = 'noreply@example.com';

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

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
  
  console.log("Attempting to send email to:", params.to);
  console.log("From:", params.from);
  console.log("Subject:", params.subject);
  
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    console.log(`Email successfully sent to ${params.to}`);
    return true;
  } catch (error: any) {
    console.error('SendGrid email error:', error);
    
    // Additional debugging for most common SendGrid errors
    if (error.code === 401) {
      console.error('Authentication error: The SendGrid API key may be invalid or expired.');
    } else if (error.code === 403) {
      console.error('Authorization error: The SendGrid account may not have permission to send emails.');
    }
    
    if (error.response && error.response.body) {
      console.error('SendGrid API response body:', JSON.stringify(error.response.body, null, 2));
      
      if (error.response.body.errors) {
        console.error('SendGrid API errors:', JSON.stringify(error.response.body.errors, null, 2));
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
  language: string = 'en'
): Promise<boolean> {
  type SupportedLanguages = 'en' | 'ro' | 'fr' | 'de' | 'it' | 'es';
  
  const subjects: Record<SupportedLanguages, string> = {
    en: "Stana de Vale Trail Race - Registration Confirmation",
    ro: "Stana de Vale Trail Race - Confirmare Înregistrare",
    fr: "Stana de Vale Trail Race - Confirmation d'Inscription",
    de: "Stana de Vale Trail Race - Anmeldebestätigung",
    it: "Stana de Vale Trail Race - Conferma di Registrazione",
    es: "Stana de Vale Trail Race - Confirmación de Registro"
  };
  
  const greetings: Record<SupportedLanguages, string> = {
    en: `Dear ${firstName} ${lastName},`,
    ro: `Dragă ${firstName} ${lastName},`,
    fr: `Cher/Chère ${firstName} ${lastName},`,
    de: `Liebe(r) ${firstName} ${lastName},`,
    it: `Gentile ${firstName} ${lastName},`,
    es: `Estimado/a ${firstName} ${lastName},`
  };
  
  const messages: Record<SupportedLanguages, string> = {
    en: `Thank you for registering for Stana de Vale Trail Race! We're excited to have you join us for this spectacular mountain running event.\n\nYou have registered for the ${raceCategory} race. Please arrive at least 1 hour before your race start time to collect your race bib and race package.\n\nIf you have any questions, please contact us at info@stanadevaletrail.ro.\n\nSee you in the mountains!\n\nStana de Vale Trail Race Team`,
    ro: `Îți mulțumim pentru înregistrarea la Stana de Vale Trail Race! Suntem încântați să te avem alături de noi la acest eveniment spectaculos de alergare montană.\n\nTe-ai înregistrat pentru cursa ${raceCategory}. Te rugăm să ajungi cu cel puțin 1 oră înainte de ora de start pentru a-ți ridica numărul de concurs și pachetul de cursă.\n\nDacă ai întrebări, te rugăm să ne contactezi la info@stanadevaletrail.ro.\n\nNe vedem în munți!\n\nEchipa Stana de Vale Trail Race`,
    fr: `Merci de vous être inscrit à Stana de Vale Trail Race ! Nous sommes ravis de vous compter parmi nous pour cet événement spectaculaire de course en montagne.\n\nVous vous êtes inscrit pour la course ${raceCategory}. Veuillez arriver au moins 1 heure avant l'heure de départ de votre course pour récupérer votre dossard et votre pack de course.\n\nSi vous avez des questions, veuillez nous contacter à info@stanadevaletrail.ro.\n\nNous vous verrons dans les montagnes !\n\nL'équipe Stana de Vale Trail Race`,
    de: `Vielen Dank für Ihre Anmeldung zum Stana de Vale Trail Race! Wir freuen uns, Sie bei diesem spektakulären Berglauffest begrüßen zu dürfen.\n\nSie haben sich für das ${raceCategory}-Rennen angemeldet. Bitte kommen Sie mindestens 1 Stunde vor Ihrem Rennstart, um Ihre Startnummer und Ihr Rennpaket abzuholen.\n\nWenn Sie Fragen haben, kontaktieren Sie uns bitte unter info@stanadevaletrail.ro.\n\nWir sehen uns in den Bergen!\n\nIhr Stana de Vale Trail Race Team`,
    it: `Grazie per esserti registrato alla Stana de Vale Trail Race! Siamo entusiasti di averti con noi per questo spettacolare evento di corsa in montagna.\n\nTi sei registrato per la gara ${raceCategory}. Ti preghiamo di arrivare almeno 1 ora prima dell'orario di partenza della gara per ritirare il tuo pettorale e il pacco gara.\n\nPer qualsiasi domanda, contattaci all'indirizzo info@stanadevaletrail.ro.\n\nCi vediamo in montagna!\n\nIl team Stana de Vale Trail Race`,
    es: `¡Gracias por registrarte en la Stana de Vale Trail Race! Estamos emocionados de tenerte con nosotros para este espectacular evento de carrera de montaña.\n\nTe has registrado para la carrera ${raceCategory}. Por favor, llega al menos 1 hora antes de la hora de inicio de tu carrera para recoger tu dorsal y tu paquete de carrera.\n\nSi tienes alguna pregunta, contáctanos en info@stanadevaletrail.ro.\n\n¡Nos vemos en las montañas!\n\nEquipo Stana de Vale Trail Race`
  };
  
  const lang = (language in subjects) ? language as SupportedLanguages : 'en';
  
  // First try with custom domain
  try {
    const result = await sendEmail({
      to: email,
      from: 'registration@stanadevaletrail.ro',
      subject: subjects[lang],
      text: `${greetings[lang]}\n\n${messages[lang]}`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6dfd9; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2A6D50; margin-bottom: 10px;">Stana de Vale Trail Race</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">${greetings[lang]}</p>
        <div style="font-size: 16px; line-height: 1.5; color: #3E4A59;">
          ${messages[lang].replace(/\n\n/g, '</p><p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">').replace(/\n/g, '<br>')}
        </div>
        <div style="margin-top: 30px; border-top: 1px solid #e6dfd9; padding-top: 20px; text-align: center; font-size: 14px; color: #7D5A45;">
          <p>Stana de Vale Trail Race 2025</p>
          <p>July 4-5, 2025 • Stâna de Vale, Romania</p>
        </div>
      </div>`
    });
    
    if (result) return true;
    
    // If domain verification is the issue, fall back to the default sender email
    console.log('Trying fallback sender email due to possible domain verification issue...');
    
    return await sendEmail({
      to: email,
      from: DEFAULT_FROM_EMAIL,
      subject: subjects[lang],
      text: `${greetings[lang]}\n\n${messages[lang]}`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6dfd9; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2A6D50; margin-bottom: 10px;">Stana de Vale Trail Race</h1>
        </div>
        <p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">${greetings[lang]}</p>
        <div style="font-size: 16px; line-height: 1.5; color: #3E4A59;">
          ${messages[lang].replace(/\n\n/g, '</p><p style="font-size: 16px; line-height: 1.5; color: #3E4A59;">').replace(/\n/g, '<br>')}
        </div>
        <div style="margin-top: 30px; border-top: 1px solid #e6dfd9; padding-top: 20px; text-align: center; font-size: 14px; color: #7D5A45;">
          <p>Stana de Vale Trail Race 2025</p>
          <p>July 4-5, 2025 • Stâna de Vale, Romania</p>
        </div>
      </div>`
    });
  } catch (error) {
    console.error('Error in sendRegistrationConfirmationEmail:', error);
    return false;
  }
}