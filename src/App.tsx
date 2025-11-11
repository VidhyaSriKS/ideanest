import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { IdeaInputPage } from "./components/IdeaInputPage";
import { ResultsPage } from "./components/ResultsPage";
import { AdditionalFeaturesModal } from "./components/AdditionalFeaturesModal";
import { AuthPage } from "./components/AuthPage";
import { Header } from "./components/Header";
import { ProfileSettingsModal } from "./components/ProfileSettingsModal";
import { projectId, publicAnonKey } from "./utils/supabase/info";
import { toast, Toaster } from "sonner@2.0.3";
import { generateDemoEvaluation, generateDemoRefinements, generateDemoCompetitors, generateDemoMarketStrategy } from "./utils/demoData";
import { AlertCircle } from "lucide-react";

type Page = 'auth' | 'home' | 'input' | 'results';

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

interface RefinementData {
  refinements: Array<{
    title: string;
    description: string;
    reasoning: string;
  }>;
}

interface CompetitorData {
  competitors: Array<{
    name: string;
    description: string;
    keyFeatures: string[];
    differentiator: string;
  }>;
}

interface MarketStrategyData {
  targetAudience: {
    primary: string;
    secondary: string;
    demographics: string[];
  };
  goToMarketStrategy: {
    phase1: string;
    phase2: string;
    phase3: string;
  };
  revenueModel: {
    primary: string;
    secondary: string;
    pricing: string;
  };
  marketingChannels: string[];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Additional features modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'refinement' | 'competitors' | 'market-strategy' | null>(null);
  const [modalData, setModalData] = useState<RefinementData | CompetitorData | MarketStrategyData | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Profile settings modal
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleEvaluate = async (title: string, description: string) => {
    setIsLoading(true);
    setIdeaTitle(title);
    setIdeaDescription(description);

    try {
      // Try API call first
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a61508a1/evaluate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ title, description }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Evaluation API error:', responseData);
        
        // Automatically fallback to demo mode for quota/auth issues
        if (response.status === 429 || 
            response.status === 401 ||
            responseData.error?.includes('quota') || 
            responseData.error?.includes('exceeded') ||
            responseData.error?.includes('insufficient_quota') ||
            responseData.error?.includes('rate limit') ||
            responseData.error?.includes('API key')) {
          
          console.log('🔄 Switching to demo mode due to API limitation');
          setIsDemoMode(true);
          
          // Simulate API delay for realistic feel
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const demoEvaluation = generateDemoEvaluation(title, description);
          setEvaluation(demoEvaluation);
          setCurrentPage('results');
          
          // Show friendly notification instead of error
          toast.success('Evaluation complete! (Demo Mode)', { 
            description: 'Using AI-powered demo data due to API limits',
            duration: 5000 
          });
          
          return;
        }
        
        // For other errors, still try demo mode as final fallback
        console.log('⚠️ API error, falling back to demo mode:', responseData.error);
        setIsDemoMode(true);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const demoEvaluation = generateDemoEvaluation(title, description);
        setEvaluation(demoEvaluation);
        setCurrentPage('results');
        toast.success('Evaluation complete! (Demo Mode)', { 
          description: 'Using sample evaluation data',
          duration: 4000 
        });
        
        return;
      }

      if (!responseData.evaluation) {
        console.error('Invalid response format:', responseData);
        
        // Fallback to demo mode
        console.log('📋 Invalid response, using demo mode');
        setIsDemoMode(true);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const demoEvaluation = generateDemoEvaluation(title, description);
        setEvaluation(demoEvaluation);
        setCurrentPage('results');
        toast.success('Evaluation complete! (Demo Mode)');
        
        return;
      }

      // Success - use real API data
      setIsDemoMode(false);
      setEvaluation(responseData.evaluation);
      setCurrentPage('results');
      toast.success('✨ Evaluation complete!');
    } catch (error) {
      console.error('Evaluation error:', error);
      
      // Final fallback to demo mode if anything goes wrong
      console.log('🛡️ Network error, activating demo mode');
      setIsDemoMode(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const demoEvaluation = generateDemoEvaluation(title, description);
      setEvaluation(demoEvaluation);
      setCurrentPage('results');
      toast.success('Evaluation complete! (Demo Mode)', { 
        description: 'Using sample data - check console for details',
        duration: 4000 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefinement = async () => {
    setModalType('refinement');
    setModalOpen(true);
    setModalLoading(true);
    setModalData(null);

    try {
      if (isDemoMode) {
        // Use demo data in demo mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        const demoData = generateDemoRefinements(ideaTitle);
        setModalData(demoData);
        setModalLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a61508a1/refine`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ title: ideaTitle, description: ideaDescription }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate refinements');
      }

      const data = await response.json();
      setModalData(data);
    } catch (error) {
      console.error('Refinement error:', error);
      
      // Fallback to demo mode
      console.log('Falling back to demo refinements');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const demoData = generateDemoRefinements(ideaTitle);
      setModalData(demoData);
      toast.info('Using demo refinements', { duration: 3000 });
    } finally {
      setModalLoading(false);
    }
  };

  const handleCompetitors = async () => {
    setModalType('competitors');
    setModalOpen(true);
    setModalLoading(true);
    setModalData(null);

    try {
      if (isDemoMode) {
        // Use demo data in demo mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        const demoData = generateDemoCompetitors(ideaTitle);
        setModalData(demoData);
        setModalLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a61508a1/competitors`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ title: ideaTitle, description: ideaDescription }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to analyze competitors');
      }

      const data = await response.json();
      setModalData(data);
    } catch (error) {
      console.error('Competitor analysis error:', error);
      
      // Fallback to demo mode
      console.log('Falling back to demo competitors');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const demoData = generateDemoCompetitors(ideaTitle);
      setModalData(demoData);
      toast.info('Using demo competitor analysis', { duration: 3000 });
    } finally {
      setModalLoading(false);
    }
  };

  const handleMarketStrategy = async () => {
    setModalType('market-strategy');
    setModalOpen(true);
    setModalLoading(true);
    setModalData(null);

    try {
      if (isDemoMode) {
        // Use demo data in demo mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        const demoData = generateDemoMarketStrategy(ideaTitle);
        setModalData(demoData);
        setModalLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a61508a1/market-strategy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ title: ideaTitle, description: ideaDescription }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate market strategy');
      }

      const data = await response.json();
      setModalData(data);
    } catch (error) {
      console.error('Market strategy error:', error);
      
      // Fallback to demo mode
      console.log('Falling back to demo market strategy');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const demoData = generateDemoMarketStrategy(ideaTitle);
      setModalData(demoData);
      toast.info('Using demo market strategy', { duration: 3000 });
    } finally {
      setModalLoading(false);
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setEvaluation(null);
    setIdeaTitle("");
    setIdeaDescription("");
  };

  const handleLogout = () => {
    setCurrentPage('auth');
    setEvaluation(null);
    setIdeaTitle("");
    setIdeaDescription("");
    setIsDemoMode(false);
  };

  return (
    <div className="dark">
      <Toaster position="top-right" theme="dark" />
      
      {/* Header - Show on all pages except auth */}
      {currentPage !== 'auth' && (
        <Header 
          onOpenSettings={() => setSettingsOpen(true)} 
          onLogout={handleLogout}
        />
      )}
      
      {/* Demo Mode Indicator */}
      {isDemoMode && (
        <div className={`fixed left-1/2 -translate-x-1/2 z-50 glass-card border-amber-500/50 bg-amber-500/10 px-6 py-3 rounded-full shadow-lg max-w-md ${currentPage !== 'auth' ? 'top-20' : 'top-4'}`}>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-semibold text-amber-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                Demo Mode Active
              </p>
              <p className="text-xs text-amber-200/80">OpenAI API quota exceeded - using sample data</p>
            </div>
          </div>
        </div>
      )}
      
      {currentPage === 'auth' && (
        <AuthPage onAuthSuccess={() => setCurrentPage('home')} />
      )}
      
      {currentPage === 'home' && (
        <HomePage onGetStarted={() => setCurrentPage('input')} />
      )}
      
      {currentPage === 'input' && (
        <IdeaInputPage
          onBack={handleBackToHome}
          onEvaluate={handleEvaluate}
          isLoading={isLoading}
        />
      )}
      
      {currentPage === 'results' && evaluation && (
        <ResultsPage
          title={ideaTitle}
          evaluation={evaluation}
          onBack={handleBackToHome}
          onRefinement={handleRefinement}
          onCompetitors={handleCompetitors}
          onMarketStrategy={handleMarketStrategy}
        />
      )}

      <AdditionalFeaturesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        data={modalData}
        isLoading={modalLoading}
      />

      <ProfileSettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}