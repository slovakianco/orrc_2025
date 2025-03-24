import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable is not set. Email functionality will be disabled.");
}

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
  
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    console.log(`Email sent to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
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
  type SupportedLanguages = 'en' | 'ro' | 'fr' | 'de';
  
  const subjects: Record<SupportedLanguages, string> = {
    en: "Trail Run Pro - Registration Confirmation",
    ro: "Trail Run Pro - Confirmare Înregistrare",
    fr: "Trail Run Pro - Confirmation d'Inscription",
    de: "Trail Run Pro - Anmeldebestätigung"
  };
  
  const greetings: Record<SupportedLanguages, string> = {
    en: `Dear ${firstName} ${lastName},`,
    ro: `Dragă ${firstName} ${lastName},`,
    fr: `Cher/Chère ${firstName} ${lastName},`,
    de: `Liebe(r) ${firstName} ${lastName},`,
  };
  
  const messages: Record<SupportedLanguages, string> = {
    en: `Thank you for registering for our trail running competition! We're excited to have you join us.\n\nYou have registered for the ${raceCategory} race. Please arrive at least 1 hour before your race start time to collect your race bib and race package.\n\nIf you have any questions, please contact us at info@trailrunpro.com.\n\nSee you at the race!\n\nTrail Run Pro Team`,
    ro: `Îți mulțumim pentru înregistrarea la competiția noastră de alergare pe traseu! Suntem încântați să te avem alături de noi.\n\nTe-ai înregistrat pentru cursa ${raceCategory}. Te rugăm să ajungi cu cel puțin 1 oră înainte de ora de start pentru a-ți ridica numărul de concurs și pachetul de cursă.\n\nDacă ai întrebări, te rugăm să ne contactezi la info@trailrunpro.com.\n\nNe vedem la cursă!\n\nEchipa Trail Run Pro`,
    fr: `Merci de vous être inscrit à notre compétition de trail ! Nous sommes ravis de vous compter parmi nous.\n\nVous vous êtes inscrit pour la course ${raceCategory}. Veuillez arriver au moins 1 heure avant l'heure de départ de votre course pour récupérer votre dossard et votre pack de course.\n\nSi vous avez des questions, veuillez nous contacter à info@trailrunpro.com.\n\nNous vous verrons à la course !\n\nL'équipe Trail Run Pro`,
    de: `Vielen Dank für Ihre Anmeldung zu unserem Trail-Laufwettbewerb! Wir freuen uns, Sie bei uns zu haben.\n\nSie haben sich für das ${raceCategory}-Rennen angemeldet. Bitte kommen Sie mindestens 1 Stunde vor Ihrem Rennstart, um Ihre Startnummer und Ihr Rennpaket abzuholen.\n\nWenn Sie Fragen haben, kontaktieren Sie uns bitte unter info@trailrunpro.com.\n\nWir sehen uns beim Rennen!\n\nIhr Trail Run Pro Team`
  };
  
  const lang = (language in subjects) ? language as SupportedLanguages : 'en';
  
  return sendEmail({
    to: email,
    from: 'no-reply@trailrunpro.com',
    subject: subjects[lang],
    text: `${greetings[lang]}\n\n${messages[lang]}`,
    html: `<div>
      <p>${greetings[lang]}</p>
      <p>${messages[lang].replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>
    </div>`
  });
}