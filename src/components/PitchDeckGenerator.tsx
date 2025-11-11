import { FileText, Download, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface PitchDeckGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  evaluation: any;
}

export function PitchDeckGenerator({ isOpen, onClose, title, evaluation }: PitchDeckGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const slides = [
    {
      number: 1,
      title: "The Problem",
      content: evaluation.problemStatement
    },
    {
      number: 2,
      title: "Our Solution",
      content: evaluation.proposedSolution
    },
    {
      number: 3,
      title: "Market Opportunity",
      content: evaluation.marketPotential
    },
    {
      number: 4,
      title: "Business Model",
      content: evaluation.businessModel
    },
    {
      number: 5,
      title: "Why Now?",
      content: evaluation.pitchSummary
    }
  ];

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple HTML-based pitch deck
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title} - Pitch Deck</title>
          <style>
            @page { size: landscape; margin: 0; }
            body { 
              margin: 0; 
              font-family: system-ui, -apple-system, sans-serif;
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            }
            .slide {
              width: 100vw;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 80px;
              box-sizing: border-box;
              page-break-after: always;
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              color: white;
              position: relative;
            }
            .slide::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.1), transparent 50%),
                          radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.1), transparent 50%);
              pointer-events: none;
            }
            .slide-number {
              position: absolute;
              top: 40px;
              right: 60px;
              font-size: 18px;
              color: rgba(148, 163, 184, 0.5);
            }
            .slide-title {
              font-size: 64px;
              font-weight: 700;
              background: linear-gradient(135deg, #38bdf8, #a855f7);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 40px;
              text-align: center;
            }
            .slide-content {
              font-size: 24px;
              line-height: 1.8;
              max-width: 1000px;
              text-align: center;
              color: #cbd5e1;
            }
            .title-slide {
              justify-content: center;
            }
            .title-slide h1 {
              font-size: 96px;
              margin-bottom: 20px;
            }
            .title-slide p {
              font-size: 32px;
              color: #94a3b8;
            }
            .logo {
              position: absolute;
              bottom: 40px;
              left: 60px;
              font-size: 24px;
              font-weight: 600;
              background: linear-gradient(135deg, #38bdf8, #a855f7);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          </style>
        </head>
        <body>
          <!-- Title Slide -->
          <div class="slide title-slide">
            <h1 class="slide-title">${title}</h1>
            <p>An AI-Evaluated Startup Idea</p>
            <div class="logo">IdeaNest</div>
          </div>

          <!-- Content Slides -->
          ${slides.map(slide => `
            <div class="slide">
              <div class="slide-number">${slide.number}/5</div>
              <h2 class="slide-title">${slide.title}</h2>
              <p class="slide-content">${slide.content}</p>
              <div class="logo">IdeaNest</div>
            </div>
          `).join('')}
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_')}_pitch_deck.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Pitch deck downloaded! Open in browser and print to PDF for best results.");
    } catch (error) {
      console.error('Pitch deck generation error:', error);
      toast.error("Failed to generate pitch deck");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-[#38bdf8]/30 max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-[#38bdf8] to-[#a855f7] bg-clip-text text-transparent">
            Pitch Deck Preview
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            5-slide investor-ready pitch deck for "{title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Slide Previews */}
          <div className="space-y-4">
            {slides.map((slide) => (
              <div key={slide.number} className="glass-card p-4 border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg text-[#38bdf8]">
                    Slide {slide.number}: {slide.title}
                  </h3>
                  <span className="text-sm text-slate-500">{slide.number}/5</span>
                </div>
                <p className="text-slate-300 text-sm line-clamp-3">{slide.content}</p>
              </div>
            ))}
          </div>

          {/* Download Button */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleDownload}
              disabled={isGenerating}
              className="neon-button flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download as HTML (Print to PDF)
                </>
              )}
            </Button>
          </div>

          <p className="text-sm text-slate-500 text-center">
            Tip: Open the HTML file in your browser and use "Print to PDF" for a professional deck
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}