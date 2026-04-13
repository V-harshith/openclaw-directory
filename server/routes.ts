import { Router, Request, Response } from "express";
import { storage } from "./storage";
import { insertListingSchema, insertSubmissionSchema, insertAdSchema } from "../shared/schema";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "openclaw-secret-2026";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "openclaw2026";

function adminAuth(req: Request, res: Response, next: Function) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Auth
router.post("/admin/login", (req: Request, res: Response) => {
  const { password } = req.body;
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
    const { type, status, category } = req.query;
    const items = await storage.getListings({
      type: type as string,
      status: (status as string) || "approved",
      category: category as string,
    });
    res.json(items);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/listings/all", adminAuth, async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const items = await storage.getListings({ type: type as string });
    res.json(items);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/listings/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const listing = await storage.getListingById(id);
    if (!listing) return res.status(404).json({ error: "Not found" });
    await storage.incrementViews(id);
    res.json(listing);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/listings", adminAuth, async (req: Request, res: Response) => {
  try {
    const data = insertListingSchema.parse(req.body);
    const listing = await storage.createListing(data);
    res.json(listing);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.patch("/listings/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const listing = await storage.updateListing(id, req.body);
    res.json(listing);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/listings/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    await storage.deleteListing(parseInt(req.params.id));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/listings/:id/upvote", async (req: Request, res: Response) => {
  try {
    const listing = await storage.upvoteListing(parseInt(req.params.id));
    res.json(listing);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Submissions
router.get("/submissions", adminAuth, async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const items = await storage.getSubmissions(status as string);
    res.json(items);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/submissions", async (req: Request, res: Response) => {
  try {
    const data = insertSubmissionSchema.parse({ ...req.body, status: "pending" });
    const submission = await storage.createSubmission(data);
    res.json(submission);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.patch("/submissions/:id/status", adminAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = z.object({ status: z.enum(["approved", "pending", "rejected"]) }).parse(req.body);
    const submission = await storage.updateSubmissionStatus(id, status);
    res.json(submission);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/submissions/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    await storage.deleteSubmission(parseInt(req.params.id));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Ads
router.get("/ads", async (req: Request, res: Response) => {
  try {
    const items = await storage.getAds(true);
    res.json(items);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/ads/all", adminAuth, async (req: Request, res: Response) => {
  try {
    res.json(await storage.getAds(false));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/ads", adminAuth, async (req: Request, res: Response) => {
  try {
    const data = insertAdSchema.parse(req.body);
    res.json(await storage.createAd(data));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.patch("/ads/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    res.json(await storage.updateAd(parseInt(req.params.id), req.body));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/ads/:id", adminAuth, async (req: Request, res: Response) => {
  try {
    await storage.deleteAd(parseInt(req.params.id));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export { router };
