import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Download, 
  Presentation, 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import { ScoreRadarChart } from "./ScoreRadarChart";
import { PitchDeckGenerator } from "./PitchDeckGenerator";
import confetti from "canvas-confetti";
import jsPDF from "jspdf";
import { toast } from "sonner@2.0.3";

interface EvaluationData {
  problemStatement: string;
  existingSolutions: string;
  proposedSolution: string;
  marketPotential: string;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  businessModel: string;
  pros: string[];
  cons: string[];
  improvements: string[];
  pitchSummary: string;
  scores: {
    innovation: number;
    feasibility: number;
    scalability: number;
  };
}

interface ResultsPageProps {
  title: string;
  evaluation: EvaluationData;
  onBack: () => void;
  onRefinement: () => void;
  onCompetitors: () => void;
  onMarketStrategy: () => void;
}

export function ResultsPage({ 
  title, 
  evaluation, 
  onBack, 
  onRefinement, 
  onCompetitors, 
  onMarketStrategy 
}: ResultsPageProps) {
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#38bdf8', '#a855f7', '#06b6d4']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#38bdf8', '#a855f7', '#06b6d4']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Normalize scores to 0-10 scale
  const normalizeScore = (score: number) => {
    return score > 10 ? score / 10 : score;
  };

  const normalizedScores = {
    innovation: normalizeScore(evaluation.scores.innovation),
    feasibility: normalizeScore(evaluation.scores.feasibility),
    scalability: normalizeScore(evaluation.scores.scalability)
  };

  const avgScore = (
    (normalizedScores.innovation + 
     normalizedScores.feasibility + 
     normalizedScores.scalability) / 3
  ).toFixed(1);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 7;
    let yPos = 20;

    // Helper function to add text with wrapping
    const addText = (text: string, isBold = false) => {
      if (isBold) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, margin, yPos);
        yPos += lineHeight;
      });
    };

    // Title
    doc.setFontSize(20);
    addText(`IdeaNest Evaluation Report`, true);
    yPos += 5;
    
    doc.setFontSize(16);
    addText(title, true);
    yPos += 10;

    // Scores
    doc.setFontSize(12);
    addText(`Overall Score: ${avgScore}/10`, true);
    addText(`Innovation: ${normalizedScores.innovation}/10`);
    addText(`Feasibility: ${normalizedScores.feasibility}/10`);
    addText(`Scalability: ${normalizedScores.scalability}/10`);
    yPos += 5;

    // Pitch Summary
    doc.setFontSize(14);
    addText("Pitch Summary", true);
    doc.setFontSize(10);
    addText(evaluation.pitchSummary);
    yPos += 5;

    // Problem Statement
    doc.setFontSize(14);
    addText("Problem Statement", true);
    doc.setFontSize(10);
    addText(evaluation.problemStatement);
    yPos += 5;

    // Proposed Solution
    doc.setFontSize(14);
    addText("Proposed Solution", true);
    doc.setFontSize(10);
    addText(evaluation.proposedSolution);
    yPos += 5;

    // Market Potential
    doc.setFontSize(14);
    addText("Market Potential", true);
    doc.setFontSize(10);
    addText(evaluation.marketPotential);
    yPos += 5;

    // Business Model
    doc.setFontSize(14);
    addText("Business Model", true);
    doc.setFontSize(10);
    addText(evaluation.businessModel);
    yPos += 5;

    // Pros
    doc.setFontSize(14);
    addText("Strengths", true);
    doc.setFontSize(10);
    evaluation.pros.forEach((pro, i) => {
      addText(`${i + 1}. ${pro}`);
    });
    yPos += 5;

    // Cons
    doc.setFontSize(14);
    addText("Weaknesses", true);
    doc.setFontSize(10);
    evaluation.cons.forEach((con, i) => {
      addText(`${i + 1}. ${con}`);
    });
    yPos += 5;

    // Improvements
    doc.setFontSize(14);
    addText("Suggested Improvements", true);
    doc.setFontSize(10);
    evaluation.improvements.forEach((imp, i) => {
      addText(`${i + 1}. ${imp}`);
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100);
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.text("Generated by IdeaNest - Powered by OpenAI API", pageWidth / 2, footerY, { align: 'center' });

    doc.save(`${title.replace(/[^a-z0-9]/gi, '_')}_evaluation.pdf`);
  };

  const ScrollRevealCard = ({ 
    title: cardTitle, 
    icon: Icon, 
    children,
    delay = 0
  }: { 
    title: string; 
    icon: any; 
    children: React.ReactNode;
    delay?: number;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#a855f7]">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold">{cardTitle}</h3>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#38bdf8]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#a855f7]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 pt-24 max-w-6xl">
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
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Evaluation
          </Button>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="text-3xl">🪶</div>
            <span className="text-2xl gradient-text font-bold">IdeaNest</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-lg text-slate-400">VC-Style Evaluation Report</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <Button
            onClick={downloadPDF}
            className="bg-gradient-to-r from-[#38bdf8] to-[#a855f7] hover:opacity-90"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button
            onClick={() => setIsPitchDeckOpen(true)}
            variant="outline"
            className="border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d4]/10"
          >
            <Presentation className="mr-2 h-4 w-4" />
            Pitch Deck
          </Button>
          <Button
            onClick={onRefinement}
            variant="outline"
            className="border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8]/10"
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Refinement
          </Button>
          <Button
            onClick={onCompetitors}
            variant="outline"
            className="border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7]/10"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Competitors
          </Button>
          <Button
            onClick={onMarketStrategy}
            variant="outline"
            className="border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d4]/10"
          >
            <Target className="mr-2 h-4 w-4" />
            Market Strategy
          </Button>
        </motion.div>

        {/* Scores Card */}
        <div className="mb-8">
          <ScrollRevealCard title="VC Evaluation Scores" icon={Sparkles}>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <div className="text-5xl font-bold gradient-text mb-2">{avgScore}/10</div>
                  <p className="text-slate-400">Overall Score</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Innovation</span>
                      <span className="font-semibold">{normalizedScores.innovation}/10</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#38bdf8] to-[#a855f7]"
                        style={{ width: `${normalizedScores.innovation * 10}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Feasibility</span>
                      <span className="font-semibold">{normalizedScores.feasibility}/10</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#38bdf8] to-[#a855f7]"
                        style={{ width: `${normalizedScores.feasibility * 10}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Scalability</span>
                      <span className="font-semibold">{normalizedScores.scalability}/10</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#38bdf8] to-[#a855f7]"
                        style={{ width: `${normalizedScores.scalability * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <ScoreRadarChart
                  innovation={normalizedScores.innovation}
                  feasibility={normalizedScores.feasibility}
                  scalability={normalizedScores.scalability}
                />
              </div>
            </div>
          </ScrollRevealCard>
        </div>

        {/* Pitch Summary */}
        <div className="mb-8">
          <ScrollRevealCard title="Pitch Summary" icon={Presentation}>
            <p className="text-slate-300 leading-relaxed">{evaluation.pitchSummary}</p>
          </ScrollRevealCard>
        </div>

        {/* Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <ScrollRevealCard title="Problem Statement" icon={AlertTriangle}>
            <p className="text-slate-300 leading-relaxed">{evaluation.problemStatement}</p>
          </ScrollRevealCard>

          <ScrollRevealCard title="Proposed Solution" icon={CheckCircle2}>
            <p className="text-slate-300 leading-relaxed">{evaluation.proposedSolution}</p>
          </ScrollRevealCard>
        </div>

        {/* Market & Business */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <ScrollRevealCard title="Market Potential" icon={TrendingUp}>
            <p className="text-slate-300 leading-relaxed">{evaluation.marketPotential}</p>
          </ScrollRevealCard>

          <ScrollRevealCard title="Business Model" icon={DollarSign}>
            <p className="text-slate-300 leading-relaxed">{evaluation.businessModel}</p>
          </ScrollRevealCard>
        </div>

        {/* SWOT Analysis */}
        <div className="mb-8">
          <ScrollRevealCard title="SWOT Analysis" icon={Target}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-400 mb-3">Strengths</h4>
                <ul className="space-y-2">
                  {evaluation.swotAnalysis.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-red-400 mb-3">Weaknesses</h4>
                <ul className="space-y-2">
                  {evaluation.swotAnalysis.weaknesses.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-blue-400 mb-3">Opportunities</h4>
                <ul className="space-y-2">
                  {evaluation.swotAnalysis.opportunities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <TrendingUp className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-amber-400 mb-3">Threats</h4>
                <ul className="space-y-2">
                  {evaluation.swotAnalysis.threats.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollRevealCard>
        </div>

        {/* Pros, Cons, Improvements */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <ScrollRevealCard title="Pros" icon={CheckCircle2}>
            <ul className="space-y-3">
              {evaluation.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <span className="text-green-400 font-semibold flex-shrink-0">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </ScrollRevealCard>

          <ScrollRevealCard title="Cons" icon={AlertTriangle}>
            <ul className="space-y-3">
              {evaluation.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <span className="text-red-400 font-semibold flex-shrink-0">-</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </ScrollRevealCard>

          <ScrollRevealCard title="Improvements" icon={Lightbulb}>
            <ul className="space-y-3">
              {evaluation.improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <span className="text-[#38bdf8] font-semibold flex-shrink-0">→</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </ScrollRevealCard>
        </div>

        {/* Existing Solutions */}
        <ScrollRevealCard title="Existing Solutions / Competitors" icon={Users}>
          <p className="text-slate-300 leading-relaxed">{evaluation.existingSolutions}</p>
        </ScrollRevealCard>
      </div>

      {/* Pitch Deck Generator Modal */}
      <PitchDeckGenerator
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
        title={title}
        evaluation={evaluation}
      />
    </div>
  );
}