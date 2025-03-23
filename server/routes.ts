import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertParticipantSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  
  // Get all races
  app.get("/api/races", async (req, res) => {
    try {
      const category = req.query.category as string || 'all';
      const races = await storage.getRacesByCategory(category);
      res.json(races);
    } catch (error) {
      console.error("Error fetching races:", error);
      res.status(500).json({ message: "Failed to fetch races" });
    }
  });

  // Get specific race by id
  app.get("/api/races/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
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

  // Register a participant
  app.post("/api/register", async (req, res) => {
    try {
      // Validate the request body using zod schema
      const result = insertParticipantSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      }
      
      // Create the participant
      const participant = await storage.createParticipant(result.data);
      
      res.status(201).json({ 
        message: "Registration successful", 
        participant 
      });
    } catch (error) {
      console.error("Error registering participant:", error);
      res.status(500).json({ message: "Failed to register participant" });
    }
  });

  // Get all participants
  app.get("/api/participants", async (req, res) => {
    try {
      let participants;
      
      // Filter by race category if provided
      if (req.query.category && req.query.category !== 'all') {
        participants = await storage.getParticipantsByRaceCategory(req.query.category as string);
      } else {
        participants = await storage.getParticipants();
      }
      
      // Search by name if provided
      if (req.query.search) {
        const searchResults = await storage.searchParticipants(req.query.search as string);
        participants = searchResults;
      }
      
      res.json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });

  // Get specific participant by id
  app.get("/api/participants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const participant = await storage.getParticipantById(id);
      
      if (!participant) {
        return res.status(404).json({ message: "Participant not found" });
      }
      
      res.json(participant);
    } catch (error) {
      console.error("Error fetching participant:", error);
      res.status(500).json({ message: "Failed to fetch participant" });
    }
  });

  // Contact form submission (just a mock endpoint in this case)
  app.post("/api/contact", (req, res) => {
    try {
      // Validate the contact form data
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // In a real application, this would send an email or store the message
      console.log("Contact form submission:", { name, email, subject, message });
      
      res.json({ message: "Message received. We'll get back to you soon!" });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ message: "Failed to process contact form" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
