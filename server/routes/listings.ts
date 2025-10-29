import { RequestHandler } from "express";
import { z } from "zod";
import { Listing } from "../models/Listing";

const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  location: z.object({
    address: z.string(),
    mapUrl: z.string().url().optional(),
  }),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

export const handleGetAllListings: RequestHandler = async (req, res) => {
  try {
    const { search, minPrice, maxPrice } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(query).sort({ createdAt: -1 }).populate("business", "businessName");
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

export const handleCreateListing: RequestHandler = async (req, res) => {
  try {
    const data = listingSchema.parse(req.body);

    // @ts-ignore - auth middleware will set req.user
    const businessId = req.user?.id;
    if (!businessId) return res.status(401).json({ error: "Unauthorized" });

    const listing = new Listing({ ...data, business: businessId });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: "Failed to create listing" });
  }
};

export const handleGetBusinessListings: RequestHandler = async (req, res) => {
  try {
    // @ts-ignore
    const businessId = req.user?.id;
    if (!businessId) return res.status(401).json({ error: "Unauthorized" });

    const listings = await Listing.find({ business: businessId }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

export const handleDeleteListing: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const businessId = req.user?.id;
    if (!businessId) return res.status(401).json({ error: "Unauthorized" });

    const listing = await Listing.findOneAndDelete({ _id: id, business: businessId });
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete listing" });
  }
};