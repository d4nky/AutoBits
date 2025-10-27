import { RequestHandler } from "express";
import { z } from "zod";

// TODO: Import Supabase client
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string(),
  user_type: z.enum(["buyer", "creator"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);

    // TODO: Use Supabase Auth to create user
    // const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    //   email: data.email,
    //   password: data.password,
    //   email_confirm: false,
    // });
    // if (authError) throw authError;

    // TODO: Create user profile in users table
    // const { error: profileError } = await supabase.from("users").insert({
    //   id: authData.user.id,
    //   email: data.email,
    //   full_name: data.full_name,
    //   user_type: data.user_type,
    // });
    // if (profileError) throw profileError;

    // TODO: If user_type is 'creator', create creator_subscriptions record with free tier

    res.json({
      success: true,
      message:
        "Account created successfully. Please check your email to verify.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Signup failed" });
    }
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    // TODO: Use Supabase Auth to authenticate user
    // const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    //   email: data.email,
    //   password: data.password,
    // });
    // if (authError) throw authError;

    // TODO: Return session token (JWT) for client to store
    // res.json({
    //   success: true,
    //   session: {
    //     access_token: authData.session.access_token,
    //     refresh_token: authData.session.refresh_token,
    //     user: authData.user,
    //   },
    // });

    res.json({
      success: true,
      message: "Login successful",
      // session: { ... }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  }
};

export const handleLogout: RequestHandler = async (req, res) => {
  try {
    // TODO: Invalidate session token on client

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};

export const handleGetCurrentUser: RequestHandler = async (req, res) => {
  try {
    // TODO: Get auth token from request headers (Authorization: Bearer <token>)
    // TODO: Verify JWT token with Supabase
    // const { data: userData, error } = await supabase.auth.getUser(token);
    // if (error) throw error;

    // TODO: Fetch user profile from users table
    // const { data: profile } = await supabase.from("users")
    //   .select("*")
    //   .eq("id", userData.user.id)
    //   .single();

    res.json({
      success: true,
      // user: { id: userData.user.id, email: userData.user.email, ...profile }
    });
  } catch (error) {
    res.status(401).json({ error: "Not authenticated" });
  }
};

export const handleOAuthGoogle: RequestHandler = async (req, res) => {
  try {
    const { code } = req.body;

    // TODO: Exchange Google auth code for user info
    // TODO: Create or update user in database
    // TODO: Return session token

    res.json({
      success: true,
      message: "Google login successful",
    });
  } catch (error) {
    res.status(500).json({ error: "Google OAuth failed" });
  }
};

export const handleOAuthGitHub: RequestHandler = async (req, res) => {
  try {
    const { code } = req.body;

    // TODO: Exchange GitHub auth code for user info
    // TODO: Create or update user in database
    // TODO: Return session token

    res.json({
      success: true,
      message: "GitHub login successful",
    });
  } catch (error) {
    res.status(500).json({ error: "GitHub OAuth failed" });
  }
};
