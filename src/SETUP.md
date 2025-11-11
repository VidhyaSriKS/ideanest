# 🪶 IdeaNest - Setup Instructions

## Quick Start

IdeaNest is now ready to use! Follow these steps to get started:

### 1. Add Your OpenAI API Key

You've already been prompted to add your OpenAI API key to the `OPENAI_API_KEY` environment variable.

If you need to add it later or update it:
1. Get your API key from https://platform.openai.com/api-keys
2. Add it to the Supabase environment variables in your project settings

### 2. Start Using IdeaNest

That's it! You can now:

1. **Enter your startup idea** - Describe your vision in detail (minimum 150 characters)
2. **Get AI evaluation** - Receive a comprehensive VC-style report with:
   - Problem statement analysis
   - Market potential assessment
   - SWOT analysis
   - Business model recommendations
   - Innovation, Feasibility, and Scalability scores (out of 10)
   - Actionable improvements

3. **Explore additional features**:
   - 💡 **Idea Refinement** - Get 3 alternative versions of your idea
   - 📊 **Competitor Analysis** - See top 3 competitors in your space
   - 🎯 **Market Strategy** - Get go-to-market and revenue model suggestions
   - 📄 **Download PDF Report** - Export your full evaluation as a PDF

## Features

### Core Functionality
- ✨ AI-powered startup idea evaluation using GPT-4o-mini
- 📊 Interactive radar chart for VC scores
- 🎉 Confetti celebration when report is ready
- 📱 Fully responsive design
- 🌙 Dark theme with glassmorphism UI
- 💾 Ideas are automatically saved to the database

### UI/UX
- Neon gradient buttons with hover glow effects
- Smooth Motion/Framer Motion animations
- Expandable/collapsible report sections
- Real-time character counter for idea description
- Loading states with animated indicators

### Additional Tools
- PDF export functionality
- Idea refinement suggestions
- Competitor overview
- Market strategy generator

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase Edge Functions (Hono)
- **AI**: OpenAI GPT-4o-mini API
- **Animations**: Motion (Framer Motion)
- **Charts**: Recharts
- **PDF Export**: jsPDF
- **Notifications**: Sonner
- **Database**: Supabase KV Store

## API Endpoints

The backend server provides these endpoints:

- `POST /evaluate` - Main idea evaluation
- `POST /refine` - Generate refinement suggestions
- `POST /competitors` - Analyze competitors
- `POST /market-strategy` - Generate market strategy
- `GET /idea/:id` - Retrieve saved idea
- `GET /ideas` - Get all ideas (leaderboard)

## Notes

- Minimum 150 characters required for idea description
- Each API call may take 10-20 seconds
- Ideas are stored in the Supabase database with unique IDs
- All responses are in JSON format for easy parsing

## Support

If you encounter any issues:
1. Make sure your OpenAI API key is valid and has credits
2. Check the browser console for error messages
3. Verify that the Supabase connection is active

---

**Built with 🪶 IdeaNest - Powered by OpenAI API**
