import { db } from "./db";
import { listings, submissions, ads, Listing, InsertListing, Submission, InsertSubmission, Ad, InsertAd } from "../shared/schema";
import { eq, and, sql, or, ilike } from "drizzle-orm";

export const storage = {
  // Listings
  async getListings(filters?: { type?: string; status?: string; category?: string }) {
    const conditions = [];
    if (filters?.type) conditions.push(eq(listings.type, filters.type as any));
    if (filters?.status) conditions.push(eq(listings.status, filters.status as any));
    if (filters?.category) conditions.push(eq(listings.category, filters.category));
    if (conditions.length > 0) {
      return db.select().from(listings).where(and(...conditions)).orderBy(sql`${listings.upvotes} DESC`);
    }
    return db.select().from(listings).orderBy(sql`${listings.upvotes} DESC`);
  },

  async searchListings(q: string, type?: string) {
    const term = `%${q}%`;
    const conditions: any[] = [
      or(
        ilike(listings.name, term),
        ilike(listings.description, term),
        ilike(listings.category, term),
        ilike(listings.author, term),
      ),
      eq(listings.status, "approved"),
    ];
    if (type) conditions.push(eq(listings.type, type as any));
    return db.select().from(listings)
      .where(and(...conditions))
      .orderBy(sql`${listings.upvotes} DESC`)
      .limit(50);
  },

  async getListingById(id: number) {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  },

  async createListing(data: InsertListing) {
    const [listing] = await db.insert(listings).values(data).returning();
    return listing;
  },

  async updateListing(id: number, data: Partial<InsertListing>) {
    const [listing] = await db.update(listings).set(data).where(eq(listings.id, id)).returning();
    return listing;
  },

  async deleteListing(id: number) {
    await db.delete(listings).where(eq(listings.id, id));
  },

  async incrementViews(id: number) {
    await db.update(listings).set({ views: sql`${listings.views} + 1` }).where(eq(listings.id, id));
  },

  async upvoteListing(id: number) {
    const [listing] = await db.update(listings)
      .set({ upvotes: sql`${listings.upvotes} + 1` })
      .where(eq(listings.id, id))
      .returning();
    return listing;
  },

  // Submissions
  async getSubmissions(status?: string) {
    if (status) {
      return db.select().from(submissions).where(eq(submissions.status, status as any)).orderBy(sql`${submissions.submitted_at} DESC`);
    }
    return db.select().from(submissions).orderBy(sql`${submissions.submitted_at} DESC`);
  },

  async createSubmission(data: InsertSubmission) {
    const [submission] = await db.insert(submissions).values(data).returning();
    return submission;
  },

  async updateSubmissionStatus(id: number, status: "approved" | "pending" | "rejected") {
    const [submission] = await db.update(submissions).set({ status }).where(eq(submissions.id, id)).returning();
    if (status === "approved") {
      const { id: _id, submitted_at, submitter_email, ...listingData } = submission;
      await storage.createListing({ ...listingData, status: "approved" });
    }
    return submission;
  },

  async deleteSubmission(id: number) {
    await db.delete(submissions).where(eq(submissions.id, id));
  },

  // Ads
  async getAds(activeOnly = false) {
    if (activeOnly) {
      return db.select().from(ads).where(eq(ads.active, true));
    }
    return db.select().from(ads);
  },

  async createAd(data: InsertAd) {
    const [ad] = await db.insert(ads).values(data).returning();
    return ad;
  },

  async updateAd(id: number, data: Partial<InsertAd>) {
    const [ad] = await db.update(ads).set(data).where(eq(ads.id, id)).returning();
    return ad;
  },

  async deleteAd(id: number) {
    await db.delete(ads).where(eq(ads.id, id));
  },
};
