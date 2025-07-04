import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const grantProposals = pgTable("grant_proposals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  organizationName: text("organization_name").notNull(),
  projectTitle: text("project_title").notNull(),
  mission: text("mission").notNull(),
  description: text("description").notNull(),
  targetPopulation: text("target_population").notNull(),
  amount: text("amount").notNull(), // Store as string to handle formatting
  timeline: text("timeline").notNull(),
  goals: text("goals").notNull(),
  generatedProposal: text("generated_proposal"),
  status: text("status").notNull().default("draft"), // draft, generated, completed
  shareToken: text("share_token").unique(), // For sharing proposals
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const collaborators = pgTable("collaborators", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull(),
  userId: integer("user_id"),
  guestName: text("guest_name"), // For anonymous collaborators
  role: text("role").notNull().default("editor"), // owner, editor, viewer
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const proposalUpdates = pgTable("proposal_updates", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull(),
  userId: integer("user_id"),
  guestName: text("guest_name"), // For anonymous updates
  field: text("field").notNull(), // Which field was updated
  oldValue: text("old_value"),
  newValue: text("new_value"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGrantProposalSchema = createInsertSchema(grantProposals).omit({
  id: true,
  userId: true,
  generatedProposal: true,
  status: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  organizationName: z.string().min(1, "Organization name is required"),
  projectTitle: z.string().min(1, "Project title is required"),
  mission: z.string().min(10, "Mission statement must be at least 10 characters").max(500, "Mission statement cannot exceed 500 characters"),
  description: z.string().min(10, "Project description must be at least 10 characters").max(1000, "Project description cannot exceed 1000 characters"),
  targetPopulation: z.string().min(10, "Target population must be at least 10 characters").max(400, "Target population cannot exceed 400 characters"),
  amount: z.string().min(1, "Amount is required"),
  timeline: z.string().min(1, "Timeline is required"),
  goals: z.string().min(10, "Goals must be at least 10 characters").max(800, "Goals cannot exceed 800 characters"),
});

export const updateGrantProposalSchema = insertGrantProposalSchema.partial().extend({
  generatedProposal: z.string().optional(),
  status: z.enum(["draft", "generated", "completed"]).optional(),
  shareToken: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const insertCollaboratorSchema = createInsertSchema(collaborators).omit({
  id: true,
  joinedAt: true,
});

export const insertProposalUpdateSchema = createInsertSchema(proposalUpdates).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGrantProposal = z.infer<typeof insertGrantProposalSchema>;
export type UpdateGrantProposal = z.infer<typeof updateGrantProposalSchema>;
export type GrantProposal = typeof grantProposals.$inferSelect;
export type InsertCollaborator = z.infer<typeof insertCollaboratorSchema>;
export type Collaborator = typeof collaborators.$inferSelect;
export type InsertProposalUpdate = z.infer<typeof insertProposalUpdateSchema>;
export type ProposalUpdate = typeof proposalUpdates.$inferSelect;
