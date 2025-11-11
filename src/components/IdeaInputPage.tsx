import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface IdeaInputPageProps {
  onBack: () => void;
  onEvaluate: (title: string, description: string) => void;
  isLoading: boolean;
}

export function IdeaInputPage({ onBack, onEvaluate, isLoading }: IdeaInputPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a title for your idea");
      return;
    }

    if (!description.trim()) {
      setError("Please describe your idea");
      return;
    }

    if (description.trim().length < 150) {
      setError("Description must be at least 150 characters");
      return;
    }

    onEvaluate(title.trim(), description.trim());
  };

  const charCount = description.length;
  const isValid = charCount >= 150;

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#38bdf8]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#a855f7]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 pt-24 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-6 text-slate-400 hover:text-white"
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="text-3xl">🪶</div>
            <span className="text-2xl gradient-text font-bold">IdeaNest</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Share Your <span className="gradient-text">Startup Idea</span>
          </h1>
          <p className="text-xl text-slate-400">
            Tell us about your vision and we'll analyze it like a VC would.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Title Input */}
          <div className="glass-card rounded-2xl p-8 backdrop-blur-xl">
            <label htmlFor="title" className="block mb-3 text-lg">
              Idea Title <span className="text-[#38bdf8]">*</span>
            </label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., AI-Powered Fitness Coach for Busy Professionals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#38bdf8] text-lg p-6"
            />
          </div>

          {/* Description Input */}
          <div className="glass-card rounded-2xl p-8 backdrop-blur-xl">
            <label htmlFor="description" className="block mb-3 text-lg">
              Describe Your Idea <span className="text-[#38bdf8]">*</span>
              <span className="text-sm text-slate-400 ml-2">
                (minimum 150 characters)
              </span>
            </label>
            <Textarea
              id="description"
              placeholder="Describe your startup idea in detail. What problem does it solve? Who is your target audience? What makes it unique? Include as much information as you can..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={12}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#38bdf8] text-lg p-6 resize-none"
            />
            <div className="mt-3 flex justify-between items-center">
              <span className={`text-sm ${isValid ? 'text-green-400' : 'text-slate-400'}`}>
                {charCount} / 150 characters {isValid && '✓'}
              </span>
              {!isValid && charCount > 0 && (
                <span className="text-sm text-amber-400">
                  {150 - charCount} more characters needed
                </span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4 border-l-4 border-red-500 bg-red-500/10"
            >
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !isValid || !title.trim()}
            className="w-full py-8 text-xl bg-gradient-to-r from-[#38bdf8] to-[#a855f7] hover:opacity-90 transition-all neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Analyzing your idea like a VC...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-6 w-6" />
                Evaluate Now
              </>
            )}
          </Button>
        </motion.form>

        {/* Loading Animation */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#38bdf8] to-[#a855f7] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <p className="text-lg text-slate-300 mb-2">AI is analyzing your idea...</p>
              <p className="text-sm text-slate-400">This may take 10-20 seconds</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}