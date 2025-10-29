import { Request, Response, RequestHandler } from "express";
import { UserType } from "../middleware/auth";
import { z } from "zod";
import { Listing } from "../models/Listing";

// For development: declare req.user
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; userType: UserType };
    }
  }
}

const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  location: z.object({
    address: z.string(),
    mapUrl: z.string().min(1, "Google Maps link is required"),
  }),
  imageUrl: z.string().min(1, "Image is required"),
});

export const handleGetAllListings: RequestHandler = async (req, res) => {
  try {
    const { search, minPrice, maxPrice } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .populate('business', 'businessName');

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

export const handleCreateListing: RequestHandler = async (req, res) => {
  try {
    console.log('Creating listing with data:', req.body);
    
    // Expect JSON body with listing fields
    const { location, ...rest } = req.body;
    
    const data = listingSchema.parse({
      ...rest,
      location: {
        address: location.address || '',
        mapUrl: location.mapUrl || '',
      }
    });

    // For testing, use a valid ObjectId. In production, this will come from auth
    const businessId = req.user?.userId || '6500000000000000000000aa';
    
    const listing = new Listing({
      ...data,
      business: businessId,
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    console.error('Create listing error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: error.errors.map(e => e.message).join(', '),
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Failed to create listing' });
  }
};

export const handleGetBusinessListings: RequestHandler = async (req, res) => {
  try {
    // For testing: use the same test business ID
    const businessId = req.user?.id || '6500000000000000000000aa';

    const listings = await Listing.find({ business: businessId })
      .sort({ createdAt: -1 })
      .select('-__v');  // Exclude version field
    
    res.json(listings);
  } catch (error) {
    console.error('Error fetching business listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

export const handleDeleteListing: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const businessId = req.user?.id;
    if (!businessId) return res.status(401).json({ error: 'Unauthorized' });

    const listing = await Listing.findOneAndDelete({ _id: id, business: businessId });
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete listing' });
  }
};

export default {};
