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
  nameRo: text("name_ro").notNull(),
  nameFr: text("name_fr").notNull(),
  nameDe: text("name_de").notNull(),
  description: text("description").notNull(),
  descriptionRo: text("description_ro").notNull(),
  descriptionFr: text("description_fr").notNull(),
  descriptionDe: text("description_de").notNull(),
  distance: integer("distance").notNull(), // in km
  elevation: integer("elevation").notNull(), // in meters
  difficulty: difficultyEnum("difficulty").notNull(),
  date: text("date").notNull(), // ISO date string
  price: integer("price").notNull(), // in EUR
  imageUrl: text("image_url"),
});

export const insertRaceSchema = createInsertSchema(races).omit({
  id: true,
});

// Participant schema
export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  country: text("country").notNull(),
  birthDate: text("birth_date").notNull(), // ISO date string
  raceId: integer("race_id").notNull(),
  bibNumber: text("bib_number"),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  medicalInfo: text("medical_info"),
  registrationDate: timestamp("registration_date").defaultNow(),
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
});

// FAQ schema
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  questionRo: text("question_ro").notNull(),
  questionFr: text("question_fr").notNull(),
  questionDe: text("question_de").notNull(),
  answer: text("answer").notNull(),
  answerRo: text("answer_ro").notNull(),
  answerFr: text("answer_fr").notNull(),
  answerDe: text("answer_de").notNull(),
  order: integer("order").notNull(),
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
});

// Program event schema
export const programEvents = pgTable("program_events", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // ISO date string
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time"), // HH:MM format, optional for events with no specific end time
  title: text("title").notNull(),
  titleRo: text("title_ro").notNull(),
  titleFr: text("title_fr").notNull(),
  titleDe: text("title_de").notNull(),
  description: text("description").notNull(),
  descriptionRo: text("description_ro").notNull(),
  descriptionFr: text("description_fr").notNull(),
  descriptionDe: text("description_de").notNull(),
  location: text("location").notNull(),
  order: integer("order").notNull(),
});

export const insertProgramEventSchema = createInsertSchema(programEvents).omit({
  id: true,
});

// Sponsor schema
export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  descriptionRo: text("description_ro").notNull(),
  descriptionFr: text("description_fr").notNull(),
  descriptionDe: text("description_de").notNull(),
  logoPlaceholder: text("logo_placeholder").notNull(), // Text for placeholder
  website: text("website").notNull(),
  level: text("level").notNull(), // premium or standard
  order: integer("order").notNull(),
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
