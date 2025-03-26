// This file contains production-specific settings and initializations
import { type Express, Request, Response, NextFunction } from "express";
import { hybridStorage } from "./hybrid-storage";
import { supabaseStorage } from "./supabase-storage";
import { IStorage } from "./storage";
import { setStorage } from "./storage-provider";

// Check required environment variables for production
function checkRequiredEnvironmentVariables() {
  const requiredVariables = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missingVariables = [];
  
  for (const variable of requiredVariables) {
    if (!process.env[variable]) {
      missingVariables.push(variable);
    }
  }
  
  if (missingVariables.length > 0) {
    console.error('ERROR: Missing required environment variables for production:');
    missingVariables.forEach(variable => {
      console.error(`- Missing required environment variable ${variable}`);
    });
    console.error('These variables must be set in your production environment.');
    console.error('The application will continue with in-memory storage only.');
    return false;
  }
  
  return true;
}

// Initialize the Supabase in production
async function initProductionDatabase() {
  // First check required environment variables
  const envVarsConfigured = checkRequiredEnvironmentVariables();
  
  if (!envVarsConfigured) {
    console.warn("Cannot initialize Supabase in production due to missing environment variables.");
    console.warn("Will continue with in-memory storage for all data.");
    return;
  }
  
  try {
    console.log("Production Supabase initialized");
    
    // Test the connection to Supabase by fetching participants
    const participants = await supabaseStorage.getParticipants();
    console.log(`Found ${participants.length} participants in Supabase`);
  } catch (error) {
    console.error("Error initializing production Supabase:", error);
    console.warn("Will continue with hybrid storage for fallback mechanism");
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