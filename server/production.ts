// This file contains production-specific settings and initializations
import { type Express, Request, Response, NextFunction } from "express";
import { hybridStorage } from "./hybrid-storage";
import { postgresStorage } from "./postgres-storage";
import { IStorage } from "./storage";
import { setStorage } from "./storage-provider";

// Initialize the PostgreSQL database in production
async function initProductionDatabase() {
  try {
    await postgresStorage.initDatabase();
    console.log("Production PostgreSQL database initialized successfully");
  } catch (error) {
    console.error("Error initializing production PostgreSQL database:", error);
  }
}

// Set up the hybrid storage for production
export const storage: IStorage = hybridStorage;

// Initialize the storage provider with our storage implementation
setStorage(storage);

// Start database initialization (async - will complete in background)
initProductionDatabase();

// Error handling middleware for production
export function setupProductionErrorHandling(app: Express) {
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Production error handler caught an error:', err);
    
    // Don't expose error details in production
    res.status(500).json({
      message: "An internal server error occurred."
    });
  });
}