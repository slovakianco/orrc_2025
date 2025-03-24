import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Race difficulty enum
export const difficultyEnum = pgEnum('difficulty', ['beginner', 'intermediate', 'advanced', 'ultra']);

// Race schema
export const races = pgTable("races", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameRo: text("namero").notNull(),
  nameFr: text("namefr").notNull(),
  nameDe: text("namede").notNull(),
  description: text("description").notNull(),
  descriptionRo: text("descriptionro").notNull(),
  descriptionFr: text("descriptionfr").notNull(),
  descriptionDe: text("descriptionde").notNull(),
  distance: integer("distance").notNull(), // in km
  elevation: integer("elevation").notNull(), // in meters
  difficulty: difficultyEnum("difficulty").notNull(),
  date: text("date").notNull(), // ISO date string
  price: integer("price").notNull(), // in EUR
  imageUrl: text("imageurl"),
  raceMap: text("racemap"), // Embedded iframe code for the race map
});

export const insertRaceSchema = createInsertSchema(races).omit({
  id: true,
});

// Participant schema
export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  firstName: text("firstname").notNull(),
  lastName: text("lastname").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phonenumber").notNull(),
  country: text("country").notNull(),
  birthDate: text("birthdate").notNull(), // ISO date string
  raceId: integer("raceid").notNull(),
  bibNumber: text("bibnumber"),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  medicalInfo: text("medicalinfo"),
  registrationDate: timestamp("registrationdate").defaultNow(),
  gender: text("gender").notNull(), // M or F
  age: integer("age").notNull(),
});

export const insertParticipantSchema = createInsertSchema(participants).omit({
  id: true,
  bibNumber: true,
  registrationDate: true,
});

// Contact inquiry schema
export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdat").defaultNow(),
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
});

// FAQ schema
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  questionRo: text("questionro").notNull(),
  questionFr: text("questionfr").notNull(),
  questionDe: text("questionde").notNull(),
  answer: text("answer").notNull(),
  answerRo: text("answerro").notNull(),
  answerFr: text("answerfr").notNull(),
  answerDe: text("answerde").notNull(),
  order: integer("order_index").notNull(),
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
});

// Program event schema
export const programEvents = pgTable("program_events", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // ISO date string
  startTime: text("starttime").notNull(), // HH:MM format
  endTime: text("endtime"), // HH:MM format, optional for events with no specific end time
  title: text("title").notNull(),
  titleRo: text("titlero").notNull(),
  titleFr: text("titlefr").notNull(),
  titleDe: text("titlede").notNull(),
  description: text("description").notNull(),
  descriptionRo: text("descriptionro").notNull(),
  descriptionFr: text("descriptionfr").notNull(),
  descriptionDe: text("descriptionde").notNull(),
  location: text("location").notNull(),
  order: integer("order_index").notNull(),
});

export const insertProgramEventSchema = createInsertSchema(programEvents).omit({
  id: true,
});

// Sponsor schema
export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  descriptionRo: text("descriptionro").notNull(),
  descriptionFr: text("descriptionfr").notNull(),
  descriptionDe: text("descriptionde").notNull(),
  logoPlaceholder: text("logoplaceholder").notNull(), // Text for placeholder
  website: text("website").notNull(),
  level: text("level").notNull(), // premium or standard
  order: integer("order_index").notNull(),
});

export const insertSponsorSchema = createInsertSchema(sponsors).omit({
  id: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Race = typeof races.$inferSelect;
export type InsertRace = z.infer<typeof insertRaceSchema>;

export type Participant = typeof participants.$inferSelect;
export type InsertParticipant = z.infer<typeof insertParticipantSchema>;

export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;

export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = z.infer<typeof insertFaqSchema>;

export type ProgramEvent = typeof programEvents.$inferSelect;
export type InsertProgramEvent = z.infer<typeof insertProgramEventSchema>;

export type Sponsor = typeof sponsors.$inferSelect;
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
