import { RequestHandler } from "express";

// TODO: Import Stripe
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// TODO: Import Supabase client
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const handleCreatePaymentIntent: RequestHandler = async (req, res) => {
  try {
    const { automation_id } = req.body;
    const userId = req.headers["x-user-id"] as string; // TODO: Extract from JWT token

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // TODO: Fetch automation to get price
    // const { data: automation, error: automationError } = await supabase
    //   .from("automations")
    //   .select("*")
    //   .eq("id", automation_id)
    //   .single();
    // if (automationError) throw automationError;

    // TODO: Check if user has already purchased this automation
    // const { data: existingPurchase } = await supabase
    //   .from("purchases")
    //   .select("id")
    //   .eq("automation_id", automation_id)
    //   .eq("buyer_id", userId)
    //   .eq("status", "completed")
    //   .single();
    // if (existingPurchase) {
    //   return res.status(400).json({ error: "You have already purchased this automation" });
    // }

    // TODO: Create Stripe payment intent with automation price
    // const amount = Math.round(automation.price * 100); // Convert to cents
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount,
    //   currency: "usd",
    //   metadata: {
    //     automation_id,
    //     buyer_id: userId,
    //     creator_id: automation.creator_id,
    //   },
    // });

    res.json({
      success: true,
      // clientSecret: paymentIntent.client_secret,
      // paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

export const handleConfirmPurchase: RequestHandler = async (req, res) => {
  try {
    const { automation_id, payment_intent_id, stripe_charge_id } = req.body;
    const userId = req.headers["x-user-id"] as string; // TODO: Extract from JWT token

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // TODO: Fetch automation details
    // const { data: automation, error: automationError } = await supabase
    //   .from("automations")
    //   .select("*")
    //   .eq("id", automation_id)
    //   .single();
    // if (automationError) throw automationError;

    // TODO: Calculate platform fee (10-20% depending on creator tier)
    // const platformFeePercentage = 0.15; // 15% default
    // const platformFee = Math.round(automation.price * platformFeePercentage * 100) / 100;
    // const creatorEarnings = automation.price - platformFee;

    // TODO: Create purchase record in database
    // const { data: purchase, error: purchaseError } = await supabase
    //   .from("purchases")
    //   .insert({
    //     automation_id,
    //     buyer_id: userId,
    //     creator_id: automation.creator_id,
    //     amount: automation.price,
    //     platform_fee: platformFee,
    //     creator_earnings: creatorEarnings,
    //     stripe_payment_intent_id: payment_intent_id,
    //     stripe_charge_id,
    //     status: "completed",
    //   })
    //   .select()
    //   .single();
    // if (purchaseError) throw purchaseError;

    // TODO: Update automation purchase count
    // await supabase.from("automations")
    //   .update({ total_purchases: automation.total_purchases + 1 })
    //   .eq("id", automation_id);

    // TODO: Send confirmation email to buyer
    // TODO: Send earnings notification to creator

    res.json({
      success: true,
      message: "Purchase confirmed successfully",
      // purchase,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to confirm purchase" });
  }
};

export const handleGetUserPurchases: RequestHandler = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] as string; // TODO: Extract from JWT token

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // TODO: Fetch all purchases for user
    // const { data: purchases, error } = await supabase
    //   .from("purchases")
    //   .select(
    //     `*,
    //      automation:automations(id, title, preview_image_url, file_url)
    //    `
    //   )
    //   .eq("buyer_id", userId)
    //   .order("created_at", { ascending: false });

    // if (error) throw error;

    res.json({
      success: true,
      // data: purchases,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
};

export const handleDownloadAutomation: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers["x-user-id"] as string; // TODO: Extract from JWT token

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // TODO: Verify user has purchased this automation
    // const { data: purchase, error: purchaseError } = await supabase
    //   .from("purchases")
    //   .select("*")
    //   .eq("automation_id", id)
    //   .eq("buyer_id", userId)
    //   .eq("status", "completed")
    //   .single();
    // if (purchaseError) throw purchaseError;

    // TODO: Get download URL from Supabase Storage
    // const { data: automationData } = await supabase
    //   .from("automations")
    //   .select("file_url, file_type")
    //   .eq("id", id)
    //   .single();

    // TODO: Generate signed URL for file download (expires in 1 hour)
    // const { data: signedUrl, error: urlError } = await supabase.storage
    //   .from("automations")
    //   .createSignedUrl(automationData.file_url, 3600);

    // if (urlError) throw urlError;

    res.json({
      success: true,
      // downloadUrl: signedUrl.signedUrl,
      // expiresIn: 3600,
    });
  } catch (error) {
    res.status(404).json({ error: "Cannot download this automation" });
  }
};

// TODO: Implement Stripe webhook handler for payment confirmation
// This should listen to stripe payment_intent.succeeded events
export const handleStripeWebhook: RequestHandler = async (req, res) => {
  try {
    // TODO: Verify webhook signature with Stripe
    // const sig = req.headers["stripe-signature"] as string;
    // const event = stripe.webhooks.constructEvent(
    //   req.body,
    //   sig,
    //   process.env.STRIPE_WEBHOOK_SECRET
    // );

    // TODO: Handle different event types
    // if (event.type === "payment_intent.succeeded") {
    //   const paymentIntent = event.data.object;
    //   // Process successful payment
    // }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: "Webhook Error" });
  }
};
