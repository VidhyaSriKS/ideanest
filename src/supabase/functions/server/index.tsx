import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

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

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
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
    console.log(`Server error during signup: ${error}`);
    return c.json({ 
      error: "Internal server error during signup", 
      details: error.message 
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

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      console.log("OpenAI API key missing in environment");
      return c.json({ error: "OpenAI API key not configured. Please add your API key in the environment variables." }, 500);
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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Title: ${title}\n\nIdea Description: ${description}` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    const responseText = await response.text();
    console.log("OpenAI API response status:", response.status);

    if (!response.ok) {
      console.log(`OpenAI API error during evaluation: ${response.status} - ${responseText}`);
      
      let errorMessage = "Failed to evaluate idea with OpenAI API";
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch (e) {
        // Response is not JSON
      }
      
      return c.json({ 
        error: errorMessage,
        details: responseText,
        status: response.status 
      }, response.status);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.log("Failed to parse OpenAI response as JSON:", responseText);
      return c.json({ error: "Invalid response from OpenAI API", details: responseText }, 500);
    }

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.log("Unexpected OpenAI response structure:", data);
      return c.json({ error: "Unexpected response structure from OpenAI", details: data }, 500);
    }

    let evaluation;
    try {
      evaluation = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.log("Failed to parse evaluation JSON:", data.choices[0].message.content);
      return c.json({ 
        error: "Failed to parse evaluation data", 
        details: data.choices[0].message.content 
      }, 500);
    }

    console.log("Evaluation successful for idea:", title);

    // Store the evaluation with a unique ID
    const ideaId = `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
      await kv.set(ideaId, {
        title,
        description,
        evaluation,
        createdAt: new Date().toISOString()
      });
    } catch (kvError) {
      console.log("Warning: Failed to store idea in KV store:", kvError);
      // Don't fail the request if storage fails
    }

    return c.json({
      ideaId,
      title,
      evaluation
    });

  } catch (error) {
    console.log(`Server error during idea evaluation: ${error}`);
    console.log("Error stack:", error.stack);
    return c.json({ 
      error: "Internal server error during evaluation", 
      details: error.message,
      stack: error.stack 
    }, 500);
  }
});

// Refinement suggestions endpoint
app.post("/make-server-a61508a1/refine", async (c) => {
  try {
    const { title, description } = await c.req.json();

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return c.json({ error: "OpenAI API key not configured" }, 500);
    }

    const systemPrompt = `You are a startup advisor. Given a startup idea, suggest 3 improved versions or alternate domains that could make it more viable. Be creative and innovative.

Format your response as a valid JSON object:
{
  "refinements": [
    {
      "title": "string",
      "description": "string",
      "reasoning": "string"
    }
  ]
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Original Idea - Title: ${title}\n\nDescription: ${description}` }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`OpenAI API error during refinement: ${response.status} - ${errorText}`);
      return c.json({ error: "Failed to generate refinements", details: errorText }, response.status);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return c.json(result);

  } catch (error) {
    console.log(`Server error during refinement generation: ${error}`);
    return c.json({ error: "Internal server error during refinement", details: error.message }, 500);
  }
});

// Competitor analysis endpoint
app.post("/make-server-a61508a1/competitors", async (c) => {
  try {
    const { title, description } = await c.req.json();

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return c.json({ error: "OpenAI API key not configured" }, 500);
    }

    const systemPrompt = `You are a market research analyst. Identify the top 3 startups or companies solving similar problems. Provide realistic examples based on your knowledge.

Format your response as a valid JSON object:
{
  "competitors": [
    {
      "name": "string",
      "description": "string",
      "keyFeatures": ["string"],
      "differentiator": "string"
    }
  ]
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Idea - Title: ${title}\n\nDescription: ${description}` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`OpenAI API error during competitor analysis: ${response.status} - ${errorText}`);
      return c.json({ error: "Failed to analyze competitors", details: errorText }, response.status);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return c.json(result);

  } catch (error) {
    console.log(`Server error during competitor analysis: ${error}`);
    return c.json({ error: "Internal server error during competitor analysis", details: error.message }, 500);
  }
});

// Market strategy endpoint
app.post("/make-server-a61508a1/market-strategy", async (c) => {
  try {
    const { title, description } = await c.req.json();

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return c.json({ error: "OpenAI API key not configured" }, 500);
    }

    const systemPrompt = `You are a go-to-market strategist. Create a comprehensive market strategy for the given startup idea.

Format your response as a valid JSON object:
{
  "targetAudience": {
    "primary": "string",
    "secondary": "string",
    "demographics": ["string"]
  },
  "goToMarketStrategy": {
    "phase1": "string",
    "phase2": "string",
    "phase3": "string"
  },
  "revenueModel": {
    "primary": "string",
    "secondary": "string",
    "pricing": "string"
  },
  "marketingChannels": ["string"]
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Idea - Title: ${title}\n\nDescription: ${description}` }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`OpenAI API error during market strategy generation: ${response.status} - ${errorText}`);
      return c.json({ error: "Failed to generate market strategy", details: errorText }, response.status);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return c.json(result);

  } catch (error) {
    console.log(`Server error during market strategy generation: ${error}`);
    return c.json({ error: "Internal server error during market strategy", details: error.message }, 500);
  }
});

// Get saved idea by ID
app.get("/make-server-a61508a1/idea/:id", async (c) => {
  try {
    const ideaId = c.req.param('id');
    const idea = await kv.get(ideaId);

    if (!idea) {
      return c.json({ error: "Idea not found" }, 404);
    }

    return c.json(idea);

  } catch (error) {
    console.log(`Server error retrieving idea: ${error}`);
    return c.json({ error: "Internal server error retrieving idea", details: error.message }, 500);
  }
});

// Get all ideas (for leaderboard)
app.get("/make-server-a61508a1/ideas", async (c) => {
  try {
    const ideas = await kv.getByPrefix("idea_");
    
    // Helper to normalize scores to 0-10 scale
    const normalizeScore = (score: number) => score > 10 ? score / 10 : score;
    
    // Sort by average score
    const sortedIdeas = ideas
      .map(idea => {
        if (idea.evaluation?.scores) {
          const innovation = normalizeScore(idea.evaluation.scores.innovation);
          const feasibility = normalizeScore(idea.evaluation.scores.feasibility);
          const scalability = normalizeScore(idea.evaluation.scores.scalability);
          const avgScore = (innovation + feasibility + scalability) / 3;
          return { ...idea, avgScore };
        }
        return { ...idea, avgScore: 0 };
      })
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10); // Top 10

    return c.json({ ideas: sortedIdeas });

  } catch (error) {
    console.log(`Server error retrieving ideas: ${error}`);
    return c.json({ error: "Internal server error retrieving ideas", details: error.message }, 500);
  }
});

Deno.serve(app.fetch);