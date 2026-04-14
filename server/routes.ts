import { Router, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { insertListingSchema, insertSubmissionSchema, insertAdSchema } from "../shared/schema";
import jwt from "jsonwebtoken";
import { z } from "zod";
import rateLimit from "express-rate-limit";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "openclaw-secret-2026";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "openclaw2026";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
});

const upvoteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many upvotes. Slow down!" },
});

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please wait before submitting again." },
});

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

function sanitizeString(str: string): string {
  return str.trim().slice(0, 2000);
}

// Auth
router.post("/admin/login", authLimiter, (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Password required" });
  }
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

router.get("/admin/me", adminAuth, (req: Request, res: Response) => {
  res.json({ role: "admin", ok: true });
});

// Listings
router.get("/listings", async (req: Request, res: Response) => {
  try {
    const allowedTypes = ["skill", "plugin", "mcp_server", "template", "job"];
    const type = req.query.type as string;
    const category = req.query.category as string;

    if (type && !allowedTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid listing type" });
    }

    const items = await storage.getListings({
      type: type || undefined,
      status: "approved",
      category: category || undefined,
    });
    res.json(items);
  } catch (e: any) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

router.get("/listings/search", async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || "").trim().slice(0, 200);
    const type = req.query.type as string;
    if (!q) return res.json([]);

    const items = await storage.searchListings(q, type);
    res.json(items);
  } catch (e: any) {
    res.status(500).json({ error: "Search failed" });
  }
});

router.get("/listings/all", adminAuth, async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string;
    const items = await storage.getListings({ type: type || undefined });
    res.json(items);
  } catch (e: any) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

router.get("/listings/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) return res.status(400).json({ error: "Invalid listing id" });
    const listing = await storage.getListingById(id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    if (listing.status !== "approved") return res.status(404).json({ error: "Listing not found" });
    await storage.incrementViews(id);
    res.json(listing);
  } catch (e: any) {
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});

router.post("/listings", adminAuth, async (req: Request, res: Response) => {
  try {
    const data = insertListingSchema.parse(req.body);
    const listing = await storage.createListing(data);
    res.json(listing);
  } catch (e: any) {
    if (e.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: e.errors });
    }
    res.status(400).json({ error: e.message });
  }
});

router.patch("/listings/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) return res.status(400).json({ error: "Invalid id" });
    const listing = await storage.updateListing(id, req.body);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/listings/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) return res.status(400).json({ error: "Invalid id" });
    await storage.deleteListing(id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: "Failed to delete listing" });
  }
});

router.post("/listings/:id/upvote", upvoteLimiter, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) return res.status(400).json({ error: "Invalid id" });
    const listing = await storage.upvoteListing(id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.json(listing);
  } catch (e: any) {
    res.status(500).json({ error: "Failed to upvote" });
  }
});

// Submissions
router.get("/submissions", adminAuth, async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const allowed = ["approved", "pending", "rejected"];
    if (status && !allowed.includes(status as string)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const items = await storage.getSubmissions(status as string);
    res.json(items);
  } catch (e: any) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

router.post("/submissions", submitLimiter, async (req: Request, res: Response) => {
  try {
    const body = {
      ...req.body,
      status: "pending",
      name: sanitizeString(req.body.name || ""),
      description: sanitizeString(req.body.description || ""),
      author: sanitizeString(req.body.author || ""),
    };
    const data = insertSubmissionSchema.parse(body);
    const submission = await storage.createSubmission(data);
    res.json(submission);
  } catch (e: any) {
    if (e.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: e.errors });
    }
    res.status(400).json({ error: e.message });
  }
});

router.patch("/submissions/:id/status", adminAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) return res.status(400).json({ error: "Invalid id" });
    const { status } = z.object({ status: z.enum(["approved", "pending", "rejected"]) }).parse(req.body);
    const submission = await storage.updateSubmissionStatus(id, status);
    res.json(submission);
  } catch (e: any) {
    if (e.name === "ZodError") {
      return res.status(400).json({ error: "Invalid status value" });
    }
    res.status(400).json({ error: e.message });
  }
});

router.delete("/submissions/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) return res.status(400).json({ error: "Invalid id" });
    await storage.deleteSubmission(id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: "Failed to delete submission" });
  }
});

// Ads
router.get("/ads", async (req: Request, res: Response) => {
  try {
    const items = await storage.getAds(true);
    res.json(items);
  } catch (e: any) {
    res.status(500).json({ error: "Failed to fetch ads" });
  }
});

router.get("/ads/all", adminAuth, async (req: Request, res: Response) => {
  try {
    res.json(await storage.getAds(false));
  } catch (e: any) {
    res.status(500).json({ error: "Failed to fetch ads" });
  }
});

router.post("/ads", adminAuth, async (req: Request, res: Response) => {
  try {
    const data = insertAdSchema.parse(req.body);
    res.json(await storage.createAd(data));
  } catch (e: any) {
    if (e.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: e.errors });
    }
    res.status(400).json({ error: e.message });
  }
});

router.patch("/ads/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) return res.status(400).json({ error: "Invalid id" });
    res.json(await storage.updateAd(id, req.body));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/ads/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) return res.status(400).json({ error: "Invalid id" });
    await storage.deleteAd(id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: "Failed to delete ad" });
  }
});

export { router };
