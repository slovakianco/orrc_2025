import { pgTable, text, serial, integer, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the race categories
export type RaceCategory = "ultra" | "marathon" | "half" | "25k" | "10k";

// Participants table
export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  country: text("country").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  raceCategory: text("race_category").notNull().$type<RaceCategory>(),
  emergencyContactName: text("emergency_contact_name").notNull(),
  emergencyContactPhone: text("emergency_contact_phone").notNull(),
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
  bibNumber: integer("bib_number").notNull().unique(),
  termsAccepted: boolean("terms_accepted").notNull(),
});

// Races table (for reference)
export const races = pgTable("races", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().$type<RaceCategory>(),
  elevation: integer("elevation").notNull(),
  difficulty: text("difficulty").notNull(),
  date: text("date").notNull(),
  description: text("description"),
  startTime: text("start_time"),
  cutoffTime: text("cutoff_time"),
  aidStations: integer("aid_stations"),
});

// Keep the users table for authentication (if needed later)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Create schemas for validation and insertion
export const insertParticipantSchema = createInsertSchema(participants).omit({
  id: true,
  registrationDate: true,
});

export const insertRaceSchema = createInsertSchema(races).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Export types for use in the application
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type InsertRace = z.infer<typeof insertRaceSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Participant = typeof participants.$inferSelect;
export type Race = typeof races.$inferSelect;
export type User = typeof users.$inferSelect;
