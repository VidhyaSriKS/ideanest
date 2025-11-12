// Fixed version — no prompt or logic changed

import 'dotenv/config';

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { createClient } from "@supabase/supabase-js";
import * as kv from "./kv_store";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// CORS middleware
app.use('*', async (c, next) => {
  // Set CORS headers
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  c.header('Access-Control-Max-Age', '600');
  c.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204);
  }
  
  await next();
});

// Health check endpoint
app.get("/make-server-a61508a1/health", (c) => {
  return c.json({ status: "ok" });
});

// User signup endpoint
app.post("/make-server-a61508a1/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: "Password must be at least 6 characters" }, 400);
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("Supabase credentials missing in environment");
      return c.json({ error: "Supabase not configured" }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Creating new user account for:", email);

    // Create user with admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { name: name || email.split('@')[0] },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log("Supabase signup error:", error);
      if (error.message.includes('already registered')) {
        return c.json({ error: "Email already registered" }, 400);
      }
      return c.json({ error: error.message }, 400);
    }

    if (!data.user) {
      return c.json({ error: "Failed to create user" }, 500);
    }

    console.log("User account created successfully:", data.user.id);

    return c.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Server error during signup:', errorMessage);
    if (errorStack) console.error('Error stack:', errorStack);
    return c.json({
      error: "Internal server error during signup",
      details: errorMessage
    }, 500);
  }
});

// Main evaluation endpoint
app.post("/make-server-a61508a1/evaluate", async (c) => {
  try {
    const { title, description } = await c.req.json();

    if (!title || !description) {
      return c.json({ error: "Title and description are required" }, 400);
    }

    if (description.length < 150) {
      return c.json({ error: "Description must be at least 150 characters" }, 400);
    }

    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (!openrouterKey) {
      console.error("OpenRouter API key is not set in environment variables");
      return c.json({ error: "OpenRouter API key not configured. Please add your API key in the environment variables." }, 500);
    }

    console.log("Starting evaluation for idea:", title);

    const systemPrompt = `Act like an experienced Venture Capital analyst.  
Evaluate the idea given below and provide a structured report covering:
1. Problem Statement  
2. Existing Solutions / Competitors  
3. Proposed Solution  
4. Market Potential  
5. SWOT Analysis  
6. Business Model  
7. Pros, Cons, and Improvements  
8. Pitch Summary (100 words)  
9. Final VC-style Evaluation Scores (Innovation, Feasibility, Scalability – out of 10)

You must respond with a valid JSON object with these exact keys:
{
  "problemStatement": "detailed analysis of the problem",
  "existingSolutions": "description of existing solutions and competitors",
  "proposedSolution": "description of the proposed solution",
  "marketPotential": "analysis of market potential",
  "swotAnalysis": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
    "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
    "threats": ["threat 1", "threat 2", "threat 3"]
  },
  "businessModel": "description of business model",
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2", "con 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "pitchSummary": "100 word pitch summary",
  "scores": {
    "innovation": 8,
    "feasibility": 7,
    "scalability": 9
  }
}`;


    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openrouterKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "IdeaNest"
      },
      body: JSON.stringify({
        model: "openai/gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Title: ${title}\n\nIdea Description: ${description}` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    const responseText = await response.text();
    console.log("OpenRouter API response status:", response.status);

    if (!response.ok) {
      console.log(`OpenRouter API error during evaluation: ${response.status} - ${responseText}`);

      let errorMessage = "Failed to evaluate idea with OpenRouter API";
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
        console.log('Error parsing error response:', errorMessage);
      }

      return c.json({
        error: errorMessage,
        details: responseText
      }, response.status as any);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to parse response';
      console.log("Failed to parse OpenAI response as JSON:", responseText);
      console.log("Parse error:", errorMessage);
      return c.json({
        error: "Invalid response from OpenAI API",
        details: `Failed to parse response: ${errorMessage}`,
        response: responseText
      }, 500);
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.log("Unexpected OpenAI response structure:", data);
      return c.json({ error: "Unexpected response structure from OpenAI", details: data }, 500);
    }

    let evaluation;
    try {
      evaluation = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Invalid JSON format';
      console.log("Failed to parse evaluation JSON:", data.choices[0].message.content);
      console.log("Parse error:", errorMessage);
      return c.json({
        error: "Failed to parse evaluation data",
        details: `Invalid JSON format: ${errorMessage}`,
        content: data.choices[0].message.content
      }, 500);
    }

    console.log("Evaluation successful for idea:", title);

    const ideaId = `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
      await kv.set(ideaId, {
        title,
        description,
        evaluation,
        createdAt: new Date().toISOString()
      });
    } catch (kvError) {
      const errorMessage = kvError instanceof Error ? kvError.message : 'Unknown KV store error';
      console.log("Warning: Failed to store idea in KV store:", errorMessage);
      if (kvError instanceof Error && kvError.stack) {
        console.log("KV store error stack:", kvError.stack);
      }
    }

    return c.json({
      ideaId,
      title,
      evaluation
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.log(`Server error during idea evaluation: ${errorMessage}`);
    if (errorStack) console.log("Error stack:", errorStack);
    return c.json({
      error: "Internal server error during evaluation",
      details: errorMessage,
      ...(errorStack && { stack: errorStack })
    }, 500);
  }
});

// Export the Hono app for serverless functions
export default app;

// Start local server only when executed directly (e.g. npm run dev)
if (require.main === module) {
  const port = Number.parseInt(process.env.PORT ?? '3001', 10);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createServer } = require('node:http');

  serve(
    {
      fetch: app.fetch,
      port,
      createServer,
    },
    (info: { address: string; port: number }) => {
      console.log(`Server running on http://localhost:${info.port}`);
    }
  );
}
