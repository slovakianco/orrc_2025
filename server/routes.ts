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
        participants = await storage.getParticipantsByRace(raceId);
      } else if (country) {
        participants = await storage.getParticipantsByCountry(country);
      } else if (search) {
        participants = await storage.searchParticipants(search);
      } else {
        participants = await storage.getParticipants();
      }
      
      res.json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });
  
  apiRouter.post("/participants", async (req: Request, res: Response) => {
    try {
      const result = insertParticipantSchema.safeParse(req.body);
      
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
      const participant = await storage.createParticipant({
        ...result.data,
        age
      });
      
      // Get the language preference from request if available
      const preferredLanguage = req.header('Accept-Language')?.split(',')[0]?.split('-')[0] || 'en';
      
      // Send confirmation email 
      const raceCategory = `${race.distance}km ${race.difficulty}`;
      try {
        await sendRegistrationConfirmationEmail(
          participant.email,
          participant.firstName,
          participant.lastName,
          raceCategory,
          preferredLanguage
        );
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
      
      const inquiry = await storage.createContactInquiry(result.data);
      res.status(201).json({ message: "Contact inquiry submitted successfully", id: inquiry.id });
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

  // Mount the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
