import { motion } from "motion/react";
import { Sparkles, Lightbulb, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  const steps = [
    {
      icon: Lightbulb,
      title: "Enter Your Idea",
      description: "Describe your startup vision in detail"
    },
    {
      icon: Sparkles,
      title: "AI Evaluates",
      description: "Our AI analyzes it like a VC would"
    },
    {
      icon: TrendingUp,
      title: "Get Full Report",
      description: "Receive investor-ready insights"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-96 h-96 bg-[#38bdf8]/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#a855f7]/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 pt-24">
        {/* Header/Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-16"
        >
          <div className="text-4xl">🪶</div>
          <span className="text-3xl gradient-text font-bold">IdeaNest</span>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Turn your <span className="gradient-text">raw idea</span> into an{" "}
            <span className="gradient-text">investor-ready report</span> — instantly.
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            IdeaNest uses AI to evaluate your startup idea like a Venture Capitalist would,
            giving you actionable insights and a professional evaluation report.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={onGetStarted}
              className="px-8 py-6 text-lg bg-gradient-to-r from-[#38bdf8] to-[#a855f7] hover:opacity-90 transition-all neon-glow"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={onGetStarted}
              variant="outline"
              className="px-8 py-6 text-lg border-2 border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8]/10"
            >
              Evaluate Idea
            </Button>
          </div>
        </motion.div>

        {/* 3-Step Workflow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-center text-3xl font-bold mb-12 gradient-text">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                className="glass-card rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#a855f7] mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="text-center mt-20 space-y-4"
        >
          <div className="inline-block px-6 py-2 rounded-full glass-card border border-[#38bdf8]/30">
            <span className="text-sm text-slate-400">Powered by OpenAI API</span>
          </div>
          <div className="inline-block px-6 py-2 rounded-full glass-card border border-[#a855f7]/30 ml-4">
            <span className="text-sm text-slate-400">Built in 48 hours @ Hackathon</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}