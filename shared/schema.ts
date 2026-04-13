import { pgTable, serial, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const listingTypeEnum = pgEnum("listing_type", ["skill", "plugin", "mcp_server", "template", "job"]);
export const statusEnum = pgEnum("listing_status", ["approved", "pending", "rejected"]);
export const adPlacementEnum = pgEnum("ad_placement", ["header", "footer", "sidebar", "in-content"]);

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: listingTypeEnum("type").notNull().default("skill"),
  description: text("description").notNull(),
  category: text("category").notNull(),
  logo_url: text("logo_url").default(""),
  website_url: text("website_url").default(""),
  github_url: text("github_url").default(""),
  views: integer("views").default(0),
  upvotes: integer("upvotes").default(0),
  stars: integer("stars").default(0),
  status: statusEnum("status").default("pending"),
  is_sponsored: boolean("is_sponsored").default(false),
  is_featured: boolean("is_featured").default(false),
  tags: text("tags").array().default([]),
  author: text("author").notNull(),
  company: text("company"),
  location: text("location"),
  job_type: text("job_type"),
  salary_range: text("salary_range"),
  created_at: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: listingTypeEnum("type").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  website_url: text("website_url").default(""),
  github_url: text("github_url").default(""),
  tags: text("tags").array().default([]),
  author: text("author").notNull(),
  submitter_email: text("submitter_email").default(""),
  status: statusEnum("status").default("pending"),
  company: text("company"),
  location: text("location"),
  job_type: text("job_type"),
  salary_range: text("salary_range"),
  submitted_at: timestamp("submitted_at").defaultNow(),
});

export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  placement: adPlacementEnum("placement").notNull().default("header"),
  label: text("label").notNull(),
  target_url: text("target_url").default("#"),
  image_url: text("image_url").default(""),
  active: boolean("active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertListingSchema = createInsertSchema(listings).omit({ id: true, created_at: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, submitted_at: true });
export const insertAdSchema = createInsertSchema(ads).omit({ id: true, created_at: true });

export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Ad = typeof ads.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema>;
