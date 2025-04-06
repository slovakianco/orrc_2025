import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
// Use the storage provider to get the correct storage implementation
import { getStorage } from "./storage-provider";
import { insertParticipantSchema, insertContactInquirySchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { sendRegistrationConfirmationEmail } from "./email";
import Stripe from "stripe";

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from public directory
  app.use(express.static(path.join(process.cwd(), 'public')));
  const apiRouter = express.Router();
  
  // Get the storage instance to use throughout the routes
  const storage = getStorage();
  
  // API Routes - all prefixed with /api
  
  // Races
  apiRouter.get("/races", async (req: Request, res: Response) => {
    try {
      const difficulty = req.query.difficulty as string | undefined;
      

      let races;
      if (difficulty) {
        races = await storage.getRacesByDifficulty(difficulty);
      } else {
        races = await storage.getRaces();
      }
      
      res.json(races);
    } catch (error) {
      console.error("Error fetching races:", error);
      res.status(500).json({ message: "Failed to fetch races" });
    }
  });
  
  apiRouter.get("/races/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid race ID" });
      }
      
      const race = await storage.getRaceById(id);
      if (!race) {
        return res.status(404).json({ message: "Race not found" });
      }
      
      res.json(race);
    } catch (error) {
      console.error("Error fetching race:", error);
      res.status(500).json({ message: "Failed to fetch race" });
    }
  });
  
  // Participants
  apiRouter.get("/participants", async (req: Request, res: Response) => {
    try {
      const raceId = req.query.raceId ? parseInt(req.query.raceId as string) : undefined;
      const country = req.query.country as string | undefined;
      const search = req.query.search as string | undefined;
      
      let participants;
      
      if (raceId) {
        console.log(`Fetching participants for race ID: ${raceId}`);
        participants = await storage.getParticipantsByRace(raceId);
      } else if (country) {
        console.log(`Fetching participants for country: ${country}`);
        participants = await storage.getParticipantsByCountry(country);
      } else if (search) {
        console.log(`Searching participants with query: ${search}`);
        participants = await storage.searchParticipants(search);
      } else {
        console.log('Fetching all participants');
        participants = await storage.getParticipants();
      }
      
      // Always return a valid JSON array, even if there's an error
      res.json(participants || []);
    } catch (error) {
      console.error("Error fetching participants:", error);
      // Return an empty array instead of an error
      res.json([]);
    }
  });
  
  apiRouter.post("/participants", async (req: Request, res: Response) => {
    try {
      console.log("Received registration request:", req.body);
      const result = insertParticipantSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        console.error("Registration validation error:", validationError.details);
        return res.status(400).json({ 
          message: "Invalid participant data", 
          errors: validationError.details 
        });
      }
      
      console.log("Registration data validated successfully");
      
      // Check if the race exists
      const race = await storage.getRaceById(result.data.raceId);
      if (!race) {
        console.error("Invalid race selected:", result.data.raceId);
        return res.status(400).json({ message: "Invalid race selected" });
      }
      
      console.log("Race validated successfully:", race.name);
      
      // Calculate age from birthdate
      const birthDate = new Date(result.data.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Create participant with calculated age
      console.log("Creating participant with data:", {
        ...result.data,
        age
      });
      
      // Create the participant
      const participant = await storage.createParticipant({
        ...result.data,
        age
      });
      
      console.log("Participant successfully created with ID:", participant.id);
    
      // Get the language preference from request - priority order:
      // 1. Explicitly provided language parameter in the request body
      // 2. Language in the URL path
      // 3. Accept-Language header
      // 4. Default to 'en'
      
      const supportedLanguages = ['en', 'ro', 'fr', 'de', 'it', 'es'];
      let emailLanguage = 'en'; // Default fallback
      
      // 1. Check for language parameter in request body
      const explicitLanguage = req.body.language;
      if (explicitLanguage && supportedLanguages.includes(explicitLanguage)) {
        emailLanguage = explicitLanguage;
        console.log(`Using explicitly provided language for email: ${emailLanguage}`);
      } else {
        // 2. Check URL path for language code
        const pathLanguage = req.header('Referer')?.match(/\/(en|ro|fr|de|it|es)\//)?.[1];
        if (pathLanguage && supportedLanguages.includes(pathLanguage)) {
          emailLanguage = pathLanguage;
          console.log(`Using URL path language for email: ${emailLanguage}`);
        } else {
          // 3. Try to match the browser language
          const preferredLanguage = req.header('Accept-Language')?.split(',')[0]?.split('-')[0] || 'en';
          if (preferredLanguage && supportedLanguages.includes(preferredLanguage)) {
            emailLanguage = preferredLanguage;
            console.log(`Using browser language for email: ${emailLanguage}`);
          }
        }
      }
      
      // Generate payment URL
      // This will direct the user to a payment page for their race registration
      // Use absolute URL with origin from the request, falling back to default if not available
      const origin = req.get('origin') || req.protocol + '://' + req.get('host');
      const paymentUrl = `${origin}/payment?participantId=${participant.id}&raceId=${race.id}&amount=${race.price}`;
      
      console.log(`Generated payment URL for participant ${participant.id}: ${paymentUrl}`);
      
      // Send confirmation email with payment link
      const raceCategory = `${race.distance}km ${race.difficulty}`;
      
      try {
        const emailSent = await sendRegistrationConfirmationEmail(
          participant.email,
          participant.firstName,
          participant.lastName,
          raceCategory,
          emailLanguage,
          participant.id,
          paymentUrl
        );
        
        if (emailSent) {
          console.log(`Registration confirmation email with payment link sent to ${participant.email} in ${emailLanguage} language`);
        } else {
          console.warn(`Failed to send registration confirmation email to ${participant.email}`);
        }
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // We don't fail the request if email sending fails
      }
      
      res.status(201).json(participant);
    } catch (error) {
      console.error("Error creating participant:", error);
      res.status(500).json({ message: "Failed to create participant" });
    }
  });
  
  // FAQs
  apiRouter.get("/faqs", async (req: Request, res: Response) => {
    try {
      const faqs = await storage.getFAQs();
      res.json(faqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });
  
  // Program Events
  apiRouter.get("/program", async (req: Request, res: Response) => {
    try {
      const date = req.query.date as string | undefined;
      
      let events;
      if (date) {
        events = await storage.getProgramEventsByDate(date);
      } else {
        events = await storage.getProgramEvents();
      }
      
      res.json(events);
    } catch (error) {
      console.error("Error fetching program events:", error);
      res.status(500).json({ message: "Failed to fetch program events" });
    }
  });
  
  // Sponsors
  apiRouter.get("/sponsors", async (req: Request, res: Response) => {
    try {
      const level = req.query.level as string | undefined;
      
      let sponsors;
      if (level) {
        sponsors = await storage.getSponsorsByLevel(level);
      } else {
        sponsors = await storage.getSponsors();
      }
      
      res.json(sponsors);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      res.status(500).json({ message: "Failed to fetch sponsors" });
    }
  });
  
  // Contact Form
  apiRouter.post("/contact", async (req: Request, res: Response) => {
    try {
      const result = insertContactInquirySchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: "Invalid contact inquiry data", 
          errors: validationError.details 
        });
      }
      
      // Store the inquiry in the database
      const inquiry = await storage.createContactInquiry(result.data);
      
      // Try to send an email notification (this is non-blocking)
      try {
        // Import the sendEmail function
        const { sendEmail } = await import('./email');
        
        // Prepare email content
        const subject = `New Contact Inquiry: ${result.data.subject}`;
        const emailBody = `
Name: ${result.data.name}
Email: ${result.data.email}
Subject: ${result.data.subject}

Message:
${result.data.message}

This message was sent from the Stana de Vale Trail Race website contact form.
        `;
        
        // Send the email notification to the site admin
        const emailSent = await sendEmail({
          to: "contact@stanatrailrace.ro", // Site admin email
          from: "registration@stanatrailrace.ro", // Must be verified in SendGrid
          subject: subject,
          text: emailBody,
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6dfd9; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #2A6D50; margin-bottom: 10px;">New Contact Form Submission</h1>
            </div>
            <div style="font-size: 16px; line-height: 1.5; color: #3E4A59;">
              <p><strong>Name:</strong> ${result.data.name}</p>
              <p><strong>Email:</strong> ${result.data.email}</p>
              <p><strong>Subject:</strong> ${result.data.subject}</p>
              <p><strong>Message:</strong></p>
              <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${result.data.message.replace(/\n/g, '<br>')}</p>
            </div>
            <div style="margin-top: 30px; border-top: 1px solid #e6dfd9; padding-top: 20px; text-align: center; font-size: 14px; color: #7D5A45;">
              <p>This message was sent from the Stana de Vale Trail Race website contact form.</p>
              <p>Stana de Vale Trail Race 2025 • Stâna de Vale, Romania</p>
            </div>
          </div>`,
        });
        
        if (emailSent) {
          console.log("Contact form notification email sent successfully");
        } else {
          console.warn("Failed to send contact form notification email");
        }
      } catch (emailError) {
        // Log email errors but don't fail the request
        console.error("Error sending contact form notification email:", emailError);
      }
      
      // Return success to the client regardless of email status
      res.status(201).json({ 
        message: "Contact inquiry submitted successfully", 
        id: inquiry.id, 
      });
    } catch (error) {
      console.error("Error creating contact inquiry:", error);
      res.status(500).json({ message: "Failed to submit contact inquiry" });
    }
  });
  
  // GPX file download
  apiRouter.get("/races/:id/gpx", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid race ID" });
      }
      
      const race = await storage.getRaceById(id);
      if (!race) {
        return res.status(404).json({ message: "Race not found" });
      }
      
      // Determine which GPX file to serve based on race distance
      let gpxFileName;
      if (race.distance >= 30) {
        gpxFileName = 'long-trail-33km.gpx';
      } else {
        gpxFileName = 'short-trail-11km.gpx';
      }
      
      const gpxFilePath = path.join(process.cwd(), 'attached_assets', gpxFileName);
      
      // Check if file exists
      if (!fs.existsSync(gpxFilePath)) {
        return res.status(404).json({ message: "GPX file not found" });
      }
      
      // Set appropriate headers
      res.setHeader('Content-Type', 'application/gpx+xml');
      res.setHeader('Content-Disposition', `attachment; filename="${gpxFileName}"`);
      
      // Stream the file
      const fileStream = fs.createReadStream(gpxFilePath);
      fileStream.pipe(res);
      
    } catch (error) {
      console.error("Error downloading GPX file:", error);
      res.status(500).json({ message: "Failed to download GPX file" });
    }
  });
  
  // EMA Circuit PDF download
  apiRouter.get("/ema-circuit/regulations", async (req: Request, res: Response) => {
    try {
      const pdfFileName = 'Regulation2025_ORRCircuit.pdf';
      const pdfFilePath = path.join(process.cwd(), 'public', 'regulations', pdfFileName);
      
      // Check if file exists
      if (!fs.existsSync(pdfFilePath)) {
        return res.status(404).json({ message: "PDF file not found" });
      }
      
      // Set appropriate headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="EMA_Off-Road_Running_Circuit_2025_Regulations.pdf"`);
      
      // Stream the file
      const fileStream = fs.createReadStream(pdfFilePath);
      fileStream.pipe(res);
      
    } catch (error) {
      console.error("Error downloading EMA Circuit PDF:", error);
      res.status(500).json({ message: "Failed to download PDF file" });
    }
  });

  // Test email functionality
  apiRouter.post("/test-email", async (req: Request, res: Response) => {
    try {
      const { email, language } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email address is required" });
      }
      
      // Validate language
      const supportedLanguages = ['en', 'ro', 'fr', 'de', 'it', 'es'];
      const validLanguage = supportedLanguages.includes(language) ? language : 'en';
      
      // Log the request
      console.log(`Attempting to send test email to: ${email} in language: ${validLanguage}`);
      
      // Send test email with a sample payment link
      const testPaymentUrl = `${req.protocol}://${req.get('host')}/payment?test=true&amount=75`;
      console.log(`Test payment URL for email: ${testPaymentUrl}`);
      
      const result = await sendRegistrationConfirmationEmail(
        email,
        "Test",
        "User",
        "33K Trail Run",
        validLanguage,
        999, // Test participant ID
        testPaymentUrl
      );
      
      if (result) {
        console.log(`Test email successfully sent to ${email}`);
        res.json({ success: true, message: "Test email sent successfully" });
      } else {
        console.log(`Failed to send test email to ${email}`);
        
        // Check API key format for providing more specific guidance
        const apiKey = process.env.SENDGRID_API_KEY || '';
        const hasValidFormat = apiKey.startsWith('SG.');
        const hasBearerPrefix = apiKey.startsWith('Bearer ');
        
        let apiKeyIssue = '';
        if (!hasValidFormat && !hasBearerPrefix) {
          apiKeyIssue = "Your API key doesn't start with 'SG.', which is unusual for SendGrid API keys.";
        } else if (hasBearerPrefix) {
          apiKeyIssue = "Your API key starts with 'Bearer ', which is incorrect. Remove this prefix.";
        }
        
        res.status(500).json({ 
          success: false, 
          message: "Failed to send test email. Make sure your SendGrid API key is valid and has permissions to send emails.",
          sendgridConfigured: process.env.SENDGRID_API_KEY ? true : false,
          possibleIssues: [
            apiKeyIssue || "The SendGrid API key may be invalid or expired.",
            "The sender identity (registration@stanatrailrace.ro) is not verified in SendGrid. Go to SendGrid dashboard and verify this email.",
            "The sender domain (stanatrailrace.ro) may not be verified in SendGrid. You need to set up domain authentication in SendGrid.",
            "You could try changing DEFAULT_FROM_EMAIL in server/email.ts to use a verified email address in your SendGrid account.",
            "For detailed troubleshooting, check server logs for specific SendGrid API error messages."
          ].filter(issue => issue) // Remove empty strings
        });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ 
        message: "Failed to send test email", 
        error: String(error),
        sendgridConfigured: process.env.SENDGRID_API_KEY ? true : false
      });
    }
  });
  
  // Check SendGrid status
  apiRouter.get("/email-status", (req: Request, res: Response) => {
    const sendgridConfigured = !!process.env.SENDGRID_API_KEY;
    const apiKeyValue = process.env.SENDGRID_API_KEY || '';
    
    // Check if API key has the correct format (starts with SG.)
    // Most SendGrid API keys start with SG. but we allow for other formats too
    const hasValidFormat = apiKeyValue.startsWith('SG.');
    const hasBearerPrefix = apiKeyValue.startsWith('Bearer ');
    
    // Checking basic format requirements
    const hasMinimumLength = apiKeyValue.length > 10; // Arbitrary reasonable minimum for API keys
    
    let formatMessage = '';
    if (sendgridConfigured) {
      if (hasBearerPrefix) {
        formatMessage = "Warning: Your API key starts with 'Bearer ', which is incorrect. The API key should be provided without this prefix.";
      } else if (!hasValidFormat && hasMinimumLength) {
        formatMessage = "Note: Your API key doesn't start with 'SG.', which is the standard format for SendGrid API keys. If this is intentional, you can ignore this message.";
      } else if (!hasMinimumLength) {
        formatMessage = "Warning: Your API key appears to be too short. Please check if it's correct.";
      }
    }
    
    res.json({
      sendgridConfigured,
      emailServiceReady: sendgridConfigured && hasMinimumLength && !hasBearerPrefix,
      message: sendgridConfigured 
        ? `SendGrid is configured. The API key appears to be set, but this does not guarantee it is valid. ${formatMessage}`
        : "SendGrid is not configured. SENDGRID_API_KEY environment variable is not set. Please add your SendGrid API key to enable email functionality.",
      senderVerificationNote: "Important: You must verify a sender identity in SendGrid dashboard before sending emails. The email addresses 'registration@stanatrailrace.ro' and/or your backup email must be verified sender identities.",
      setupInstructions: [
        "1. Get a SendGrid API key from https://app.sendgrid.com/settings/api_keys",
        "2. Verify sender identity at https://app.sendgrid.com/settings/sender_auth",
        "3. Either verify individual emails or an entire domain (domain verification requires DNS setup)",
        "4. Test sending an email from this page to confirm everything works"
      ]
    });
  });
  
  // Stripe Payment Endpoints
  apiRouter.post("/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const { amount, raceId, participantId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid payment amount" });
      }
      
      // Fetch the race to get details for the payment metadata
      let raceInfo = null;
      if (raceId) {
        const race = await storage.getRaceById(parseInt(raceId));
        if (race) {
          raceInfo = `${race.name} (${race.distance}km)`;
        }
      }
      
      // Fetch participant info for metadata if available
      let participantInfo = null;
      if (participantId) {
        const participant = await storage.getParticipantById(parseInt(participantId));
        if (participant) {
          participantInfo = `${participant.firstName} ${participant.lastName}`;
        }
      }
      
      // Create a payment intent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "eur",
        // Payment method types - add more as needed
        payment_method_types: ["card"],
        metadata: {
          raceId: raceId || '',
          raceName: raceInfo || 'Race registration',
          participantId: participantId || '',
          participantName: participantInfo || '',
        },
      });
      
      // Send the client secret to the client
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      
      res.status(500).json({ 
        message: "Error creating payment intent", 
        error: error.message 
      });
    }
  });
  
  // Webhook endpoint to handle Stripe events (payment confirmations, etc.)
  apiRouter.post("/stripe-webhook", express.raw({type: 'application/json'}), async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // You'll need to set this up later
    
    let event;
    
    try {
      // No webhook validation for now, just parse the JSON
      if (!endpointSecret) {
        // If we don't have the webhook secret yet, just parse the request body
        event = JSON.parse(req.body);
      } else {
        // If we have a webhook secret, validate the signature
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      }
      
      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log(`Payment succeeded: ${paymentIntent.id}`);
          
          // Update participant status if we have participant info
          if (paymentIntent.metadata && paymentIntent.metadata.participantId) {
            const participantId = parseInt(paymentIntent.metadata.participantId);
            try {
              await storage.updateParticipantStatus(participantId, 'paid');
              console.log(`Updated participant ${participantId} status to paid`);
              
              // Get participant and race info to send confirmation email
              const participant = await storage.getParticipantById(participantId);
              
              if (participant) {
                console.log(`Sending payment confirmation email to ${participant.email}`);
                
                // Determine language based on participant country or fallback to English
                const language = participant.country.toLowerCase().substring(0, 2);
                const validLanguage = ['en', 'ro', 'fr', 'de', 'it', 'es'].includes(language) ? language : 'en';
                
                // Get race info for the email
                const race = paymentIntent.metadata.raceId 
                  ? await storage.getRaceById(parseInt(paymentIntent.metadata.raceId))
                  : null;
                  
                const raceInfo = race 
                  ? `${race.name} (${race.distance}km ${race.difficulty})`
                  : "Stana de Vale Trail Race";
                
                // Import email function dynamically to avoid circular dependency
                const { sendRegistrationConfirmationEmail } = await import('./email');
                
                // Send payment confirmation email
                try {
                  const emailSent = await sendRegistrationConfirmationEmail(
                    participant.email,
                    participant.firstName,
                    participant.lastName,
                    raceInfo,
                    validLanguage,
                    participant.id,
                    undefined, // No payment URL as they've already paid
                    true  // Indicate this is a payment confirmation
                  );
                  
                  if (emailSent) {
                    console.log(`Payment confirmation email sent to ${participant.email}`);
                  } else {
                    console.warn(`Failed to send payment confirmation email to ${participant.email}`);
                  }
                } catch (emailError) {
                  console.error(`Error sending payment confirmation email: ${emailError}`);
                }
              }
            } catch (err) {
              console.error(`Error updating participant status or sending confirmation: ${err}`);
            }
          }
          break;
          
        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object;
          console.log(`Payment failed: ${failedPaymentIntent.id}`);
          
          // You could update the participant status to 'payment_failed' here if needed
          break;
          
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      // Return a 200 response to acknowledge receipt of the event
      res.json({received: true});
    } catch (err: any) {
      console.error(`Error processing webhook: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // Mount the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
