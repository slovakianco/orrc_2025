import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
// Use the storage provider to get the correct storage implementation
import { getStorage } from "./storage-provider";
import { insertParticipantSchema, insertContactInquirySchema, type InsertParticipant } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { sendRegistrationConfirmationEmail, sendPaymentConfirmationEmail } from "./email";
import Stripe from "stripe";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn(
    "STRIPE_SECRET_KEY environment variable is not set. Payment functionality will be disabled."
  );
}

// Initialize Stripe instance globally for use across the application
if (!global.stripe && process.env.STRIPE_SECRET_KEY) {
  global.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16" as any, // Use the correct API version with type assertion
  });
  console.log("Stripe initialized globally");
} else if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY not found in environment variables");
  // Create a null-safe stripe instance
  global.stripe = null;
}

// Function to create a payment link - exported for use in email.ts
export async function createPaymentLink(
  amount: number, 
  participantId: number, 
  raceId: number, 
  isEmaParticipant: boolean
): Promise<string | null> {
  try {
    if (!global.stripe) {
      console.error("Stripe is not configured. Payment link cannot be created.");
      return null;
    }
    
    // Calculate the correct amount based on the race and EMA status
    // 33km race: 200 lei (EMA) or 170 lei (non-EMA)
    // 11km race: 150 lei (EMA) or 120 lei (non-EMA)
    let ronAmount = 0;
    if (raceId === 1) { // 33km race
      ronAmount = isEmaParticipant ? 200 : 170; // 200 lei for EMA, 170 lei for non-EMA
    } else { // 11km race
      ronAmount = isEmaParticipant ? 150 : 120; // 150 lei for EMA, 120 lei for non-EMA
    }
    
    // Create a payment link using the correct approach
    // First, create a Price object
    const price = await global.stripe.prices.create({
      currency: 'ron',
      unit_amount: Math.round(ronAmount * 100), // Convert to bani (RON cents)
      product_data: {
        name: `Stana de Vale Trail Race - ${raceId === 1 ? '33km' : '11km'} ${isEmaParticipant ? '(EMA Circuit)' : ''}`,
      },
    });
    
    // Then create a payment link with the price ID
    const paymentLink = await global.stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      metadata: {
        participantId: participantId.toString(),
        raceId: raceId.toString(),
        isEmaParticipant: isEmaParticipant ? "true" : "false"
      },
      after_completion: {
        type: 'redirect',
        redirect: {
          url: `${process.env.APP_URL || `https://${process.env.REPL_SLUG}.replit.app`}/registration-success?completed=true`,
        },
      },
      // Make the payment link single-use
      payment_intent_data: {
        capture_method: 'automatic',
        metadata: {
          participantId: participantId.toString(),
          raceId: raceId.toString()
        }
      },
      // Set tax options - required for Stripe links
      automatic_tax: {
        enabled: false
      },
    });
    
    return paymentLink.url;
  } catch (error: any) {
    console.error("Error creating Stripe payment link:", error.message);
    return null;
  }
}

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
  
  // Update race details (especially for updating images)
  apiRouter.patch("/races/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid race ID" });
      }
      
      const updateData = req.body;
      
      // Validate update data - minimum check
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No update data provided" });
      }
      
      const race = await storage.getRaceById(id);
      if (!race) {
        return res.status(404).json({ message: "Race not found" });
      }
      
      const updatedRace = await storage.updateRace(id, updateData);
      res.json(updatedRace);
    } catch (error) {
      console.error("Error updating race:", error);
      res.status(500).json({ message: "Failed to update race" });
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
  
  // Get a single participant by ID
  apiRouter.get("/participants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid participant ID" });
      }
      
      console.log(`Fetching participant with ID: ${id}`);
      const participant = await storage.getParticipantById(id);
      
      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }
      
      // Success - return the participant
      res.json(participant);
    } catch (error) {
      console.error("Error fetching participant:", error);
      res.status(500).json({ message: "Failed to fetch participant" });
    }
  });
  
  // Check participant status
  apiRouter.get("/participant-status/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid participant ID" });
      }
      
      const participant = await storage.getParticipantById(id);
      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }
      
      // Get race info for this participant
      const race = await storage.getRaceById(participant.raceId);
      
      // Return participant status information
      res.json({
        id: participant.id,
        name: `${participant.firstName} ${participant.lastName}`,
        email: participant.email,
        race: race ? `${race.distance}km ${race.difficulty}` : "Unknown race",
        country: participant.country,
        status: participant.status,
        isConfirmed: participant.status === 'confirmed',
        registrationDate: participant.registrationDate,
        bibNumber: participant.bibNumber
      });
    } catch (error) {
      console.error("Error fetching participant status:", error);
      res.status(500).json({ message: "Failed to fetch participant status" });
    }
  });
  
  apiRouter.post("/participants", async (req: Request, res: Response) => {
    try {
      // Log the original request body to debug
      console.log("Original participant request body:", {
        ...req.body,
        isEmaParticipant: req.body.isEmaParticipant,
        tshirtSize: req.body.tshirtSize
      });
      
      // Normalize data for database column naming conventions
      // Convert from camelCase to lowercase (isEmaParticipant -> isemaparticipant, tshirtSize -> tshirtsize)
      const processedBody = {
        ...req.body,
        // Handle boolean fields
        isemaparticipant: req.body.isEmaParticipant === true || req.body.isEmaParticipant === "true",
        // Handle t-shirt size field
        tshirtsize: req.body.tshirtSize || ""
      };
      
      const result = insertParticipantSchema.safeParse(processedBody);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: "Invalid participant data", 
          errors: validationError.details 
        });
      }
      
      // Check if the race exists
      const race = await storage.getRaceById(result.data.raceId);
      if (!race) {
        return res.status(400).json({ message: "Invalid race selected" });
      }
      
      // Calculate age from birthdate
      const birthDate = new Date(result.data.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Create participant with calculated age
      // Log the participant data before creating to debug fields
      console.log("Creating participant with data:", {
        ...result.data,
        age,
        "isEmaParticipant from data": result.data.isEmaParticipant
      });
      
      // Create a properly typed object for the database
      // We need to use the exact column names that are in the database
      // Create participant data using named fields as per Drizzle schema
      const participantData: InsertParticipant = {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        phoneNumber: result.data.phoneNumber,
        country: result.data.country,
        birthDate: result.data.birthDate,
        raceId: result.data.raceId,
        gender: result.data.gender as "M" | "F",
        age: age,
        // Handle optional fields
        medicalInfo: result.data.medicalInfo || null,
        // Convert isEmaParticipant to boolean - ensure it's stored correctly 
        isEmaParticipant: Boolean(result.data.isEmaParticipant),
        tshirtSize: result.data.tshirtSize || "",
        // Emergency contact information
        emergencyContactName: result.data.emergencyContactName || "",
        emergencyContactPhone: result.data.emergencyContactPhone || ""
      };
      
      // Log the data to help with debugging
      console.log("Participant registration data:", participantData);
      
      // Ensure proper data is passed to storage
      const participant = await storage.createParticipant(participantData);
      
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
      
      // Send confirmation email 
      const raceCategory = `${race.distance}km ${race.difficulty}`;
      
      try {
        const emailSent = await sendRegistrationConfirmationEmail(
          participant.email,
          participant.firstName,
          participant.lastName,
          raceCategory,
          emailLanguage,
          participant.id,
          participant.raceId
        );
        
        if (emailSent) {
          console.log(`Registration confirmation email sent to ${participant.email} in ${emailLanguage} language`);
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
      const pdfFilePath = path.join(process.cwd(), 'attached_assets', pdfFileName);
      
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

  // Stripe payment intent endpoint
  apiRouter.post("/create-payment-intent", async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(500).json({ 
          message: "Stripe is not configured. Please set the STRIPE_SECRET_KEY environment variable."
        });
      }
      
      const { amount, participantId, raceId, isEmaParticipant } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount provided" });
      }
      
      // Convert isEmaParticipant to boolean to handle various input formats
      const isEma = isEmaParticipant === true || isEmaParticipant === "true" || isEmaParticipant === 1;
      
      console.log(`Creating payment link for amount: ${amount}, participant: ${participantId}, race: ${raceId}, isEmaParticipant: ${isEmaParticipant}, parsed as: ${isEma}`);
      
      // Calculate the correct amount based on the race and EMA status
      // 33km race: 200 lei (EMA) or 170 lei (non-EMA)
      // 11km race: 150 lei (EMA) or 120 lei (non-EMA)
      let ronAmount = 0;
      if (raceId === 1) { // 33km race
        ronAmount = isEma ? 200 : 170; // 200 lei for EMA, 170 lei for non-EMA
      } else { // 11km race
        ronAmount = isEma ? 150 : 120; // 150 lei for EMA, 120 lei for non-EMA
      }

      const storage = getStorage();

      // Get the participant's details to include in the payment link
      const participant = await storage.getParticipantById(participantId);
      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }

      // Get the race details
      const race = await storage.getRaceById(raceId);
      if (!race) {
        return res.status(404).json({ message: "Race not found" });
      }

      const raceDisplayName = race.name || (race.distance + "km " + race.difficulty);
      
      // Create a payment link with Stripe Payment Links
      // Check if stripe is available
      if (!global.stripe) {
        return res.status(500).json({ message: "Payment service is not available" });
      }
      
      // First, create a Price object for the registration
      const price = await global.stripe.prices.create({
        currency: 'ron',
        unit_amount: Math.round(ronAmount * 100), // Convert to bani (RON cents)
        product_data: {
          name: `Race Registration: ${raceDisplayName} - ${participant.firstName} ${participant.lastName}` + 
                (isEma ? ' (EMA Circuit)' : '')
        },
      });
      
      // Then create a payment link with the price ID
      const paymentLink = await global.stripe.paymentLinks.create({
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: `${req.protocol}://${req.get('host')}/registration-success?payment_success=true&participantId=${participantId}`,
          },
        },
        metadata: {
          participantId: participantId.toString(),
          raceId: raceId.toString(),
          isEmaParticipant: isEma ? "true" : "false"
        }
      });
      
      // For backward compatibility with the client, also create a payment intent
      // This can be removed once the client is updated to use payment links directly
      // Check if stripe is available
      if (!global.stripe) {
        return res.status(500).json({ message: "Payment service is not available" });
      }
      
      const paymentIntent = await global.stripe.paymentIntents.create({
        amount: Math.round(ronAmount * 100), // Convert to bani (RON cents)
        currency: "ron", // Romanian currency
        metadata: {
          participantId: participantId ? participantId.toString() : "",
          raceId: raceId ? raceId.toString() : "",
          isEmaParticipant: isEma ? "true" : "false",
          paymentLinkId: paymentLink.id
        }
      });
      
      // Return both the payment link and client secret to the client
      res.json({
        paymentLink: paymentLink.url,
        paymentLinkId: paymentLink.id,
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      });
      
    } catch (error: any) {
      console.error("Error creating payment link:", error);
      res.status(500).json({ 
        message: error.message || "An error occurred while creating payment link" 
      });
    }
  });
  
  // Stripe webhook for payment confirmation
  apiRouter.post("/stripe-webhook", express.raw({type: 'application/json'}), async (req: Request, res: Response) => {
    if (!global.stripe) {
      return res.status(500).json({ 
        message: "Stripe is not configured. Please set the STRIPE_SECRET_KEY environment variable."
      });
    }
    
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
      return res.status(400).json({ message: "Missing Stripe signature header" });
    }
    
    try {
      // Parse the request body
      const rawBody = req.body;
      let event;
      
      // Handle webhook verification
      // For production, use a webhook secret to verify the signature
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      try {
        if (endpointSecret) {
          // Verify webhook signature if we have a secret
          event = global.stripe.webhooks.constructEvent(
            rawBody, 
            sig as string, 
            endpointSecret
          );
          console.log("Verified Stripe webhook signature successfully");
        } else {
          // For development, parse the raw body
          event = typeof rawBody === 'string' 
            ? JSON.parse(rawBody) 
            : rawBody instanceof Buffer 
              ? JSON.parse(rawBody.toString('utf8'))
              : rawBody;
          
          console.log("Stripe webhook received event without signature verification:", event.type);
        }
      } catch (e) {
        console.error("Error parsing webhook payload:", e);
        return res.status(400).json({ message: "Invalid webhook payload" });
      }
      
      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          
          console.log(`PaymentIntent ${paymentIntent.id} was successful!`);
          
          // Extract participant ID from metadata
          const participantId = paymentIntent.metadata?.participantId;
          
          if (participantId) {
            console.log(`Processing payment for participant ID: ${participantId}`);
            // Update participant status to 'confirmed' or 'paid'
            try {
              const participant = await storage.updateParticipantStatus(
                parseInt(participantId), 
                'confirmed'
              );
              
              // Try to deactivate the payment link after successful payment
              try {
                // Find payment links with this participant ID in metadata
                const paymentLinks = await global.stripe.paymentLinks.list({
                  limit: 10,
                });
                
                // Find links that match this participant ID
                const matchingLinks = paymentLinks.data.filter(link => 
                  link.metadata?.participantId === participantId
                );
                
                if (matchingLinks.length > 0) {
                  // Deactivate all matching links
                  for (const link of matchingLinks) {
                    console.log(`Deactivating payment link ${link.id} for participant ${participantId}`);
                    // Deactivate the link by archiving it
                    await global.stripe.paymentLinks.update(link.id, {
                      active: false // This will deactivate the link
                    });
                  }
                } else {
                  console.log(`No payment links found for participant ${participantId}`);
                }
              } catch (linkError) {
                console.error(`Error deactivating payment link:`, linkError);
                // Continue with confirmation even if link deactivation fails
              }
              
              if (participant) {
                console.log(`Updated participant ${participantId} status to confirmed`);
                
                // Send payment confirmation email
                try {
                  // Get race details
                  const race = await storage.getRaceById(participant.raceId);
                  const raceCategory = race ? `${race.distance}km ${race.difficulty}` : "Trail Race";
                  
                  const emailSent = await sendPaymentConfirmationEmail(
                    participant.email,
                    participant.firstName,
                    participant.lastName,
                    raceCategory
                  );
                  
                  if (emailSent) {
                    console.log(`Payment confirmation email sent to ${participant.email}`);
                  } else {
                    console.warn(`Failed to send payment confirmation email to ${participant.email}`);
                  }
                } catch (emailError) {
                  console.error("Error sending payment confirmation email:", emailError);
                }
              } else {
                console.error(`Could not find participant with ID ${participantId}`);
              }
            } catch (updateError) {
              console.error(`Error updating participant status:`, updateError);
            }
          } else {
            console.warn("Payment intent succeeded but no participantId found in metadata");
          }
          break;
        
        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object;
          console.log(`PaymentIntent ${failedPaymentIntent.id} failed`);
          break;
          
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      // Return a 200 response to acknowledge receipt of the event
      res.json({received: true});
    } catch (err: any) {
      console.error('Error handling webhook:', err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });
  
  // Update participant status and send confirmation email (for manual testing)
  apiRouter.post("/confirm-payment", async (req: Request, res: Response) => {
    try {
      const { participantId } = req.body;
      
      if (!participantId) {
        return res.status(400).json({ message: "Participant ID is required" });
      }
      
      // Update participant status to 'confirmed'
      const participant = await storage.updateParticipantStatus(
        parseInt(participantId), 
        'confirmed'
      );
      
      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }
      
      // Get race details
      const race = await storage.getRaceById(participant.raceId);
      const raceCategory = race ? `${race.distance}km ${race.difficulty}` : "Trail Race";
      
      // Send payment confirmation email
      const emailSent = await sendPaymentConfirmationEmail(
        participant.email,
        participant.firstName,
        participant.lastName,
        raceCategory
      );
      
      if (emailSent) {
        console.log(`Payment confirmation email sent to ${participant.email}`);
      } else {
        console.warn(`Failed to send payment confirmation email to ${participant.email}`);
      }
      
      res.json({
        message: "Payment confirmed and participant status updated",
        participant,
        emailSent
      });
      
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ 
        message: "Failed to confirm payment" 
      });
    }
  });
  
  // Confirm payment by payment intent ID (from success page)
  apiRouter.post("/confirm-payment-by-intent", async (req: Request, res: Response) => {
    try {
      if (!global.stripe) {
        return res.status(500).json({ 
          message: "Stripe is not configured. Please set the STRIPE_SECRET_KEY environment variable."
        });
      }
      
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID is required" });
      }
      
      console.log(`Looking up payment intent: ${paymentIntentId}`);
      
      // Retrieve the payment intent from Stripe
      const paymentIntent = await global.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (!paymentIntent) {
        return res.status(404).json({ message: "Payment intent not found" });
      }
      
      console.log(`Payment intent status: ${paymentIntent.status}`);
      
      // Check if payment was successful
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ 
          message: `Payment is not complete. Status: ${paymentIntent.status}`,
          status: paymentIntent.status 
        });
      }
      
      // Extract participant ID from metadata
      const participantId = paymentIntent.metadata?.participantId;
      
      if (!participantId) {
        return res.status(400).json({ 
          message: "No participant ID found in payment intent metadata" 
        });
      }
      
      console.log(`Found participant ID in payment: ${participantId}`);
      
      // Update participant status to 'confirmed'
      const participant = await storage.updateParticipantStatus(
        parseInt(participantId), 
        'confirmed'
      );
      
      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }
      
      console.log(`Updated participant ${participantId} status to confirmed`);
      
      // Try to deactivate any payment links for this participant
      try {
        // Find payment links with this participant ID in metadata
        const paymentLinks = await global.stripe.paymentLinks.list({
          limit: 10,
        });
        
        // Find links that match this participant ID
        const matchingLinks = paymentLinks.data.filter(link => 
          link.metadata?.participantId === participantId
        );
        
        if (matchingLinks.length > 0) {
          console.log(`Found ${matchingLinks.length} payment links to deactivate for participant ${participantId}`);
          // Deactivate all matching links
          for (const link of matchingLinks) {
            console.log(`Deactivating payment link ${link.id} for participant ${participantId}`);
            // Deactivate the link by archiving it
            await global.stripe.paymentLinks.update(link.id, {
              active: false // This will deactivate the link
            });
          }
        } else {
          console.log(`No payment links found for participant ${participantId}`);
        }
      } catch (linkError) {
        console.error(`Error deactivating payment link:`, linkError);
        // Continue with confirmation even if link deactivation fails
      }
      
      // Get race details
      const race = await storage.getRaceById(participant.raceId);
      const raceCategory = race ? `${race.distance}km ${race.difficulty}` : "Trail Race";
      
      // Send payment confirmation email
      const emailSent = await sendPaymentConfirmationEmail(
        participant.email,
        participant.firstName,
        participant.lastName,
        raceCategory
      );
      
      if (emailSent) {
        console.log(`Payment confirmation email sent to ${participant.email}`);
      } else {
        console.warn(`Failed to send payment confirmation email to ${participant.email}`);
      }
      
      res.json({
        success: true,
        message: "Payment confirmed and participant status updated",
        participant: {
          id: participant.id,
          firstName: participant.firstName,
          lastName: participant.lastName,
          status: participant.status
        },
        emailSent
      });
      
    } catch (error) {
      console.error("Error confirming payment by intent:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to confirm payment" 
      });
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
      
      // Send test email
      const result = await sendRegistrationConfirmationEmail(
        email,
        "Test",
        "User",
        "33K Trail Run",
        validLanguage,
        123, // Sample participant ID for testing
        1    // Sample race ID for testing
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

  // Mount the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
