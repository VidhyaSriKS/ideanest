export function generateDemoCompetitors(title: string) {
  return {
    competitors: [
      {
        name: "MarketLeader Pro",
        description: "Established enterprise platform that has dominated the market for over a decade with a comprehensive suite of tools and strong brand recognition. Founded in 2012, with 50,000+ enterprise customers globally and $200M ARR.",
        keyFeatures: [
          "Comprehensive feature set covering all major use cases with 100+ integrations",
          "Enterprise-grade security and compliance (SOC 2, GDPR, ISO 27001 certified)",
          "Dedicated account management and 24/7 multilingual support",
          "Extensive integration ecosystem with major platforms (Salesforce, Microsoft, SAP)",
          "Advanced analytics and reporting dashboards with custom data export",
          "White-label options for enterprise customers",
          "Mobile apps for iOS and Android with offline capabilities",
          "99.99% uptime SLA with dedicated infrastructure"
        ],
        differentiator: `Unlike MarketLeader Pro's complex, enterprise-focused approach with steep learning curve and pricing starting at $500/month, ${title} offers a streamlined, user-friendly experience at a fraction of the cost ($19-99/month), making advanced capabilities accessible to students and small teams. We focus on AI-powered insights and automation that deliver better outcomes in less time, while MarketLeader Pro requires extensive training and IT support.`,
        pricing: "$500-5,000/month",
        marketShare: "35%",
        founded: "2012",
        funding: "$250M Series D",
        employees: "1,200+",
        strengths: ["Brand recognition", "Enterprise relationships", "Feature completeness"],
        weaknesses: ["High pricing", "Complex UX", "Slow innovation cycle"]
      },
      {
        name: "StartupTool",
        description: "A newer competitor targeting startups and SMBs with a focus on affordability and ease of use. Launched in 2020, growing rapidly with 100,000+ users across 120 countries and $15M ARR.",
        keyFeatures: [
          "Simple, intuitive interface with minimal learning curve and 5-minute setup",
          "Affordable pricing starting at $9/month with generous free tier",
          "Quick setup with 50+ pre-built templates and presets",
          "Active community and regular feature updates (bi-weekly releases)",
          "Built-in collaboration tools for team workflows",
          "Zapier integration for workflow automation",
          "Basic mobile-responsive web app",
          "Email support with 24-hour response time"
        ],
        differentiator: `While StartupTool focuses on simplicity and basic functionality, ${title} leverages cutting-edge AI (GPT-4o) to provide intelligent automation, predictive insights, and personalized recommendations that deliver significantly better outcomes. Our AI analyzes patterns and provides actionable suggestions, whereas StartupTool requires manual configuration. We also offer advanced features like real-time collaboration, custom reporting, and API access at comparable pricing.`,
        pricing: "$9-49/month",
        marketShare: "12%",
        founded: "2020",
        funding: "$8M Series A",
        employees: "45",
        strengths: ["Ease of use", "Affordable pricing", "Fast iteration"],
        weaknesses: ["Limited features", "No AI capabilities", "Basic analytics"]
      },
      {
        name: "OpenSource Alternative",
        description: "Free, open-source solution popular among developers and tech-savvy users. Active since 2015 with 50,000+ GitHub stars, 500+ contributors, and deployments at 10,000+ organizations worldwide.",
        keyFeatures: [
          "Completely free and open-source under MIT license",
          "Full customization and self-hosting options with Docker/Kubernetes support",
          "Active developer community contributing features and plugins (200+ plugins available)",
          "No vendor lock-in or data restrictions - full data ownership",
          "On-premise deployment for security-conscious organizations",
          "Plugin ecosystem for extensibility",
          "API-first architecture for custom integrations",
          "Community support via Discord, GitHub, and forums"
        ],
        differentiator: `${title} offers the best of both worlds – the affordability users love about open source (starting at $19/month, free tier available) with the polish, reliability, cloud hosting, automatic updates, enterprise-grade security, 24/7 support, and advanced AI capabilities of commercial solutions. Users get started in minutes without DevOps expertise, server management, or security concerns. We also provide managed infrastructure, automatic backups, and compliance certifications that self-hosted solutions can't match.`,
        pricing: "Free (self-hosted)",
        marketShare: "8%",
        founded: "2015",
        funding: "Community-driven",
        employees: "500+ contributors",
        strengths: ["Zero cost", "Full control", "Extensibility"],
        weaknesses: ["Requires technical expertise", "No official support", "Maintenance burden"]
      },
      {
        name: "FreemiumApp",
        description: "Popular freemium platform with millions of users, primarily focused on consumers and individual users rather than teams or businesses. Launched in 2018 with 5M+ active users, 250K+ paid subscribers, and $30M ARR.",
        keyFeatures: [
          "Generous free tier attracting large user base (unlimited basic usage)",
          "Mobile-first design with excellent UX and native apps (4.8★ App Store rating)",
          "Social features and community engagement (public profiles, idea sharing)",
          "Viral growth mechanisms built into product (referral bonuses, share features)",
          "Gamification and achievement system to drive engagement",
          "Basic analytics and insights dashboard",
          "Template marketplace with 1,000+ user-generated templates",
          "In-app chat support for paid users"
        ],
        differentiator: `${title} goes beyond FreemiumApp's basic consumer offerings by providing professional-grade AI analysis powered by GPT-4o, comprehensive business insights (competitor analysis, market strategy, SWOT), team collaboration features, advanced reporting, API access, and enterprise-level features that appeal to serious users willing to pay for superior results. While FreemiumApp targets casual individual users, we serve students, entrepreneurs, and businesses who need VC-quality analysis and actionable insights. Our AI generates detailed reports that would cost $5,000+ from a consulting firm, available instantly at $49/month.`,
        pricing: "Free - $29/month",
        marketShare: "18%",
        founded: "2018",
        funding: "$45M Series B",
        employees: "180",
        strengths: ["Large user base", "Viral growth", "Mobile experience"],
        weaknesses: ["Limited business features", "No AI analysis", "Consumer-focused"]
      }
    ]
  };
}

export function generateDemoEvaluation(title: string, description: string) {
  return {
    problemStatement: `The core problem ${title} addresses is a significant gap in the market where potential users face challenges with inefficient workflows, lack of automation, and limited access to intelligent solutions. Current solutions are either too expensive for the target market or lack the sophistication needed to deliver real value. This creates an opportunity for a platform that combines affordability with advanced AI capabilities.`,
    
    existingSolutions: `The market currently has several established players: 1) Enterprise solutions like Salesforce and SAP that are comprehensive but prohibitively expensive ($500-5000/month) and complex to implement, 2) Basic freemium tools that are affordable but lack advanced features and AI capabilities, 3) Open-source alternatives that require technical expertise and significant maintenance overhead. None of these solutions effectively serve students and early-stage founders who need professional-grade analysis at accessible price points.`,
    
    proposedSolution: `${title} leverages cutting-edge AI (GPT-4o) to provide intelligent, automated analysis and insights at a fraction of the cost of traditional solutions. The platform combines a beautiful, intuitive interface with powerful backend capabilities, making advanced features accessible to non-technical users. Key innovations include real-time AI evaluation, comprehensive reporting, and seamless integration workflows that reduce time-to-value from weeks to minutes.`,
    
    marketPotential: `The addressable market is substantial and growing. With over 50 million students globally and 300+ million small businesses worldwide, the target audience represents a $50B+ opportunity. The shift toward AI-powered tools and the increasing accessibility of advanced technology creates a perfect timing for disruption. Early adopters in the student and founder community can drive viral growth through word-of-mouth, while the low price point removes barriers to entry.`,
    
    swotAnalysis: {
      strengths: [
        "AI-powered insights that deliver professional-grade analysis instantly",
        "Accessible pricing ($19-99/month) targeting underserved student/founder market",
        "Modern, intuitive UX that requires no training or technical expertise",
        "Comprehensive feature set including evaluation, competitor analysis, and strategy",
        "Strong differentiation through AI technology and user-focused design"
      ],
      weaknesses: [
        "New entrant without established brand recognition or customer base",
        "Dependency on OpenAI API and potential cost/availability constraints",
        "Limited resources for marketing and customer acquisition initially",
        "Potential challenges scaling infrastructure with rapid user growth",
        "Need to build trust and credibility in a competitive market"
      ],
      opportunities: [
        "Massive underserved market of 50M+ students and early-stage founders",
        "Growing acceptance and demand for AI-powered productivity tools",
        "Potential for viral growth through college networks and startup communities",
        "Expansion into adjacent markets like accelerators, universities, and VCs",
        "Partnership opportunities with educational institutions and incubators"
      ],
      threats: [
        "Established competitors could add AI features to existing platforms",
        "OpenAI or similar providers could release competing products directly",
        "Market saturation as more AI tools launch in the productivity space",
        "Economic downturn reducing discretionary spending on tools",
        "Rapid technological change requiring constant innovation to stay relevant"
      ]
    },
    
    businessModel: `The revenue model follows a freemium SaaS approach with three tiers: 1) Free tier with limited evaluations (1-2/month) to drive user acquisition and viral growth, 2) Student/Founder tier at $19-29/month with unlimited evaluations and core features, 3) Pro tier at $49-99/month with advanced features like API access, team collaboration, and priority support. Additional revenue streams include partnership fees from universities/accelerators, API access for B2B customers, and premium add-ons like personalized consulting or pitch deck design services.`,
    
    pros: [
      "Clear product-market fit addressing real pain point for large, growing audience",
      "Low customer acquisition cost potential through viral growth in close-knit communities",
      "High margins due to API-based delivery model with minimal infrastructure overhead",
      "Strong defensibility through AI expertise, brand, and network effects",
      "Multiple expansion paths including B2B, international markets, and adjacent verticals"
    ],
    
    cons: [
      "Highly competitive market with both established players and new AI-powered entrants",
      "Risk of commoditization as AI capabilities become more widely available",
      "Dependency on third-party AI providers creates potential for disruption",
      "Challenge of building sufficient scale to achieve profitability quickly",
      "Need for continuous innovation to maintain competitive advantage"
    ],
    
    improvements: [
      "Implement multi-language support to expand internationally, particularly in emerging markets with large student populations (India, Southeast Asia, Latin America)",
      "Add team collaboration features with shared workspaces, commenting, and version control to increase enterprise value and enable higher pricing tiers",
      "Develop integrations with popular tools (Notion, Slack, Google Workspace) to embed within existing workflows and increase stickiness",
      "Create a marketplace where users can share ideas, connect with mentors/investors, and collaborate, building network effects and community value",
      "Implement AI-powered pitch coaching and presentation tools to expand value proposition beyond just evaluation into execution support"
    ],
    
    pitchSummary: `${title} is transforming how students and early-stage founders evaluate and refine their startup ideas by providing instant, VC-quality analysis at an affordable price. Using advanced AI technology, we deliver comprehensive evaluations including problem-solution fit, market analysis, competitive positioning, and strategic recommendations in minutes rather than the weeks and thousands of dollars required by traditional consulting. Our platform addresses a massive underserved market of 50+ million students and founders who currently lack access to professional-grade business analysis. With a freemium model starting at just $19/month, we're making entrepreneurial success more accessible while building a scalable, high-margin SaaS business. The timing is perfect as AI adoption accelerates and the startup ecosystem continues to grow globally.`,
    
    scores: {
      innovation: 8.5,
      feasibility: 7.8,
      scalability: 8.2
    }
  };
}

export function generateDemoRefinements(title: string) {
  return {
    refinements: [
      {
        title: "Multi-Stakeholder Evaluation Mode",
        description: "Add ability for teams to invite mentors, advisors, or investors to provide their own evaluation ratings and feedback on the same idea, creating a collaborative assessment dashboard.",
        reasoning: "Most successful startups benefit from diverse perspectives. By enabling multi-stakeholder input, you differentiate from solo-use tools and create network effects as users invite others to the platform. This also increases engagement and provides more comprehensive insights."
      },
      {
        title: "Industry-Specific Templates & Benchmarks",
        description: "Create pre-built evaluation frameworks tailored to specific industries (FinTech, HealthTech, EdTech, etc.) with relevant benchmarks, metrics, and success criteria from that vertical.",
        reasoning: "Generic evaluations miss industry-specific nuances. Vertical-specific templates demonstrate deep expertise and provide more actionable insights. This positions the platform as an industry expert rather than a generic tool, commanding premium pricing."
      },
      {
        title: "AI-Powered Idea Evolution Tracker",
        description: "Build a longitudinal feature that tracks how ideas evolve over time, showing iteration history, improvements made, and progress toward key milestones with visual timeline and metrics.",
        reasoning: "Ideas evolve significantly from conception to launch. Tracking this journey creates historical value, demonstrates progress to stakeholders, and keeps users engaged long-term. It also generates valuable data on what changes lead to success."
      },
      {
        title: "Automated Financial Modeling & Projections",
        description: "Integrate AI-powered financial modeling that generates revenue projections, cost structures, break-even analysis, and funding requirement estimates based on the business model and market data.",
        reasoning: "Financial projections are critical for fundraising but time-consuming to create. Automating this with AI removes a major friction point for founders while providing huge value. It also enables monetization of premium financial features."
      },
      {
        title: "Investor Matching & Warm Intro Engine",
        description: "Build a database of investors, accelerators, and VCs with their investment criteria, then use AI to match ideas with the best-fit investors and facilitate warm introductions through the platform.",
        reasoning: "The ultimate goal for most founders is funding. By connecting them directly with relevant investors based on AI-matching, you become an essential platform in the startup ecosystem and can monetize through placement fees or subscriptions."
      }
    ]
  };
}

export function generateDemoMarketStrategy(title: string) {
  return {
    targetAudience: {
      primary: "University students and recent graduates (18-28 years old) working on startup ideas for class projects, hackathons, or personal ventures. This segment has high engagement, strong word-of-mouth potential, and grows into paying professional users.",
      secondary: "First-time founders and solo entrepreneurs (25-40 years old) in the pre-seed stage who need to validate and refine their ideas before pitching to investors or committing significant resources.",
      demographics: [
        "Tech-savvy millennials and Gen Z comfortable with AI tools",
        "Located primarily in startup hubs (SF, NYC, Boston, Austin, Bangalore, London, Berlin)",
        "Active in entrepreneurship communities (Product Hunt, Indie Hackers, Y Combinator, university innovation labs)",
        "Budget-conscious but willing to pay for high-value tools ($20-100/month range)",
        "Highly networked and influential within their communities, driving viral growth"
      ]
    },
    goToMarketStrategy: {
      phase1: "Launch on Product Hunt and startup communities with a generous free tier to drive initial user acquisition. Partner with 10-20 university entrepreneurship programs and innovation labs to offer free institutional access in exchange for feedback and testimonials. Focus on building a high-quality product and collecting user success stories. Target: 1,000 active users in first 3 months.",
      phase2: "Implement viral growth mechanics (referral bonuses, social sharing of evaluations) and launch targeted content marketing (SEO blog posts, YouTube tutorials, startup podcasts). Begin paid advertising on LinkedIn and Facebook targeting startup-related interests. Expand university partnerships to 50+ institutions and launch a campus ambassador program. Target: 10,000 active users by month 6.",
      phase3: "Scale B2B sales to accelerators, incubators, and corporate innovation programs offering team licenses. Launch API access for developers and integration partners. Expand internationally starting with English-speaking markets (UK, Canada, Australia, India). Build marketplace features to create network effects. Target: 50,000+ users and $500K ARR by end of year 1."
    },
    revenueModel: {
      primary: "Monthly SaaS subscriptions at three tiers: Free (2 evaluations/month), Student ($19/month for unlimited evaluations + basic features), Pro ($49/month for advanced features + API access + collaboration tools). Focus on converting free users to paid through usage limits and premium feature gating.",
      secondary: "Enterprise licenses for universities, accelerators, and corporate innovation teams at $500-5,000/month based on user count. White-label options for larger organizations at $10K-50K annual contracts.",
      pricing: "Free tier as acquisition funnel → $19/month (target 70% of paid users) → $49/month (target 25% of paid users) → $500+/month enterprise (target 5% of revenue but highest margin). Expected LTV:CAC ratio of 5:1 with 12-month payback period."
    },
    marketingChannels: [
      "Content Marketing: SEO-optimized blog posts on startup topics, comprehensive guides, and case studies to drive organic traffic",
      "Community Building: Active presence in r/startups, Indie Hackers, Product Hunt, and startup Slack/Discord communities",
      "Partnership Marketing: Co-marketing with university entrepreneurship programs, accelerators, and startup tools (Notion, Figma, etc.)",
      "Social Media: Educational content on LinkedIn and Twitter targeting founders, plus YouTube tutorials and startup tip videos",
      "Paid Advertising: Targeted LinkedIn and Facebook ads to startup founders, with retargeting campaigns for free users",
      "Influencer/Affiliate: Partner with startup YouTubers, podcasters, and entrepreneurs with engaged audiences for authentic promotion",
      "Email Marketing: Nurture sequences for free users, weekly newsletters with startup insights, and personalized upgrade campaigns",
      "PR & Media: Pitch to TechCrunch, The Hustle, and startup podcasts; pursue awards and recognition from startup organizations"
    ]
  };
}