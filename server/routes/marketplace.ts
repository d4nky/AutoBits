import { RequestHandler } from "express";

// TODO: Import Supabase client
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const handleListAutomations: RequestHandler = async (req, res) => {
  try {
    const {
      category,
      search,
      sort = "newest",
      minPrice = 0,
      maxPrice = 1000,
      minRating = 0,
      page = 1,
      limit = 20,
    } = req.query;

    // TODO: Build query with Supabase filters
    // let query = supabase
    //   .from("automations")
    //   .select("*, creator:users(id, full_name, avatar_url)")
    //   .eq("status", "published")
    //   .gte("price", minPrice)
    //   .lte("price", maxPrice)
    //   .gte("average_rating", minRating);

    // if (category) {
    //   query = query.eq("category", category);
    // }

    // if (search) {
    //   query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    // }

    // if (sort === "newest") {
    //   query = query.order("created_at", { ascending: false });
    // } else if (sort === "popular") {
    //   query = query.order("total_purchases", { ascending: false });
    // } else if (sort === "highest_rated") {
    //   query = query.order("average_rating", { ascending: false });
    // } else if (sort === "lowest_price") {
    //   query = query.order("price", { ascending: true });
    // }

    // TODO: Implement pagination
    // const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    // const { data: automations, error, count } = await query
    //   .range(offset, offset + parseInt(limit as string) - 1);

    // if (error) throw error;

    res.json({
      success: true,
      data: [],
      // {
      //   automations,
      //   pagination: {
      //     page: parseInt(page as string),
      //     limit: parseInt(limit as string),
      //     total: count,
      //     pages: Math.ceil((count || 0) / parseInt(limit as string)),
      //   },
      // },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch automations" });
  }
};

export const handleGetAutomation: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Fetch automation with creator info and reviews
    // const { data: automation, error } = await supabase
    //   .from("automations")
    //   .select(
    //     `*,
    //      creator:users(id, full_name, avatar_url, bio),
    //      reviews(id, rating, comment, reviewer:users(full_name, avatar_url), created_at)`
    //   )
    //   .eq("id", id)
    //   .eq("status", "published")
    //   .single();

    // if (error || !automation) throw new Error("Automation not found");

    res.json({
      success: true,
      // data: automation,
    });
  } catch (error) {
    res.status(404).json({ error: "Automation not found" });
  }
};

export const handleGetCategories: RequestHandler = async (req, res) => {
  try {
    // TODO: Fetch list of unique categories and automation counts per category
    // const { data: categories, error } = await supabase.from("automations")
    //   .select("category")
    //   .eq("status", "published")
    //   .distinct();

    // if (error) throw error;

    // TODO: Count automations per category
    // const categoryStats = await Promise.all(
    //   categories.map(async (cat) => {
    //     const { count } = await supabase
    //       .from("automations")
    //       .select("id", { count: "exact", head: true })
    //       .eq("category", cat.category)
    //       .eq("status", "published");
    //     return { name: cat.category, count };
    //   })
    // );

    res.json({
      success: true,
      data: [
        { name: "Social Media", count: 0 },
        { name: "Productivity", count: 0 },
        { name: "CRM & Sales", count: 0 },
        { name: "Finance", count: 0 },
        { name: "E-Commerce", count: 0 },
        { name: "Marketing", count: 0 },
        { name: "Development", count: 0 },
        { name: "HR & Recruitment", count: 0 },
        { name: "Customer Support", count: 0 },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const handleGetAutomationReviews: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // TODO: Fetch reviews for automation with pagination
    // const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    // const { data: reviews, error, count } = await supabase
    //   .from("reviews")
    //   .select(
    //     `*,
    //      reviewer:users(id, full_name, avatar_url)`
    //   )
    //   .eq("automation_id", id)
    //   .order("created_at", { ascending: false })
    //   .range(offset, offset + parseInt(limit as string) - 1);

    // if (error) throw error;

    res.json({
      success: true,
      // data: {
      //   reviews,
      //   pagination: {
      //     page: parseInt(page as string),
      //     limit: parseInt(limit as string),
      //     total: count,
      //   },
      // },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
