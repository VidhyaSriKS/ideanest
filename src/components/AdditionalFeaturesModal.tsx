import { motion, AnimatePresence } from "motion/react";
import { X, Loader2, Lightbulb, TrendingUp, Target, DollarSign, Users, Globe, Shield, Zap, Award, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

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
    pricing: string;
    marketShare: string;
    founded: string;
    funding: string;
    employees: string;
    strengths: string[];
    weaknesses: string[];
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

interface AdditionalFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'refinement' | 'competitors' | 'market-strategy' | null;
  data: RefinementData | CompetitorData | MarketStrategyData | null;
  isLoading: boolean;
}

export function AdditionalFeaturesModal({
  isOpen,
  onClose,
  type,
  data,
  isLoading
}: AdditionalFeaturesModalProps) {
  const getTitle = () => {
    switch (type) {
      case 'refinement':
        return 'Idea Refinement Suggestions';
      case 'competitors':
        return 'Competitor Overview';
      case 'market-strategy':
        return 'Market Strategy';
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'refinement':
        return Lightbulb;
      case 'competitors':
        return TrendingUp;
      case 'market-strategy':
        return Target;
      default:
        return Lightbulb;
    }
  };

  const Icon = getIcon();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl p-8 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#38bdf8] to-[#a855f7]">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{getTitle()}</h2>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-[#38bdf8] animate-spin mb-4" />
                <p className="text-slate-400">Generating insights...</p>
              </div>
            )}

            {/* Content */}
            {!isLoading && data && (
              <div className="space-y-6">
                {type === 'refinement' && 'refinements' in data && (
                  <div className="space-y-6">
                    {data.refinements.map((refinement, index) => (
                      <div key={index} className="glass-card rounded-xl p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#a855f7] flex items-center justify-center flex-shrink-0">
                            <span className="font-bold text-white">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{refinement.title}</h3>
                            <p className="text-slate-300 mb-3">{refinement.description}</p>
                            <div className="bg-white/5 rounded-lg p-3 border-l-4 border-[#38bdf8]">
                              <p className="text-sm text-slate-400">
                                <span className="font-semibold text-[#38bdf8]">Why this works:</span> {refinement.reasoning}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {type === 'competitors' && 'competitors' in data && (
                  <div className="space-y-6">
                    {/* Competitor Comparison Table */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700 hover:bg-transparent">
                            <TableHead className="text-[#38bdf8]">Competitor</TableHead>
                            <TableHead className="text-[#38bdf8]">Pricing</TableHead>
                            <TableHead className="text-[#38bdf8]">Market Share</TableHead>
                            <TableHead className="text-[#38bdf8]">Founded</TableHead>
                            <TableHead className="text-[#38bdf8]">Funding</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.competitors.map((competitor: any, index) => (
                            <TableRow key={index} className="border-slate-700 hover:bg-white/5">
                              <TableCell className="font-semibold text-white">{competitor.name}</TableCell>
                              <TableCell className="text-slate-300">{competitor.pricing || 'N/A'}</TableCell>
                              <TableCell className="text-slate-300">{competitor.marketShare || 'N/A'}</TableCell>
                              <TableCell className="text-slate-300">{competitor.founded || 'N/A'}</TableCell>
                              <TableCell className="text-slate-300">{competitor.funding || 'N/A'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Detailed Competitor Analysis */}
                    <div className="space-y-6 mt-8">
                      <h3 className="text-xl font-semibold text-[#38bdf8] mb-4">Detailed Analysis</h3>
                      
                      {data.competitors.map((competitor: any, index) => (
                        <div key={index} className="glass-card rounded-xl p-6 border border-slate-700">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#a855f7] flex items-center justify-center flex-shrink-0">
                                <span className="font-bold text-white">{index + 1}</span>
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold mb-1">{competitor.name}</h3>
                                <p className="text-sm text-slate-400">{competitor.employees || 'N/A'} employees</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-400">Market Share</div>
                              <div className="text-xl font-bold text-[#38bdf8]">{competitor.marketShare || 'N/A'}</div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-slate-300 mb-4">{competitor.description}</p>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-sm text-slate-400">Pricing</div>
                              <div className="font-semibold text-white">{competitor.pricing || 'N/A'}</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-sm text-slate-400">Founded</div>
                              <div className="font-semibold text-white">{competitor.founded || 'N/A'}</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-sm text-slate-400">Funding</div>
                              <div className="font-semibold text-white">{competitor.funding || 'N/A'}</div>
                            </div>
                          </div>
                          
                          {/* Key Features */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-[#38bdf8] mb-3 flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              Key Features
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {competitor.keyFeatures.map((feature: string, i: number) => (
                                <div key={i} className="text-sm text-slate-300 flex items-start gap-2 bg-white/5 rounded p-2">
                                  <span className="text-[#38bdf8] mt-1">✓</span>
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Strengths & Weaknesses */}
                          {competitor.strengths && competitor.weaknesses && (
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                                  <Award className="w-4 h-4" />
                                  Strengths
                                </h4>
                                <ul className="space-y-1">
                                  {competitor.strengths.map((strength: string, i: number) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                      <span className="text-green-400">+</span>
                                      {strength}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Weaknesses
                                </h4>
                                <ul className="space-y-1">
                                  {competitor.weaknesses.map((weakness: string, i: number) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                      <span className="text-red-400">-</span>
                                      {weakness}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                          
                          {/* Your Differentiator */}
                          <div className="bg-gradient-to-r from-[#38bdf8]/10 to-[#a855f7]/10 rounded-lg p-4 border-l-4 border-[#a855f7]">
                            <h4 className="text-sm font-semibold text-[#a855f7] mb-2 flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              Your Competitive Advantage
                            </h4>
                            <p className="text-sm text-slate-300">{competitor.differentiator}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Market Positioning Summary */}
                    <div className="glass-card rounded-xl p-6 border border-[#38bdf8]/30 bg-[#38bdf8]/5">
                      <h3 className="text-xl font-semibold text-[#38bdf8] mb-4 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" />
                        Market Positioning Summary
                      </h3>
                      <div className="space-y-3 text-slate-300">
                        <p>
                          <strong className="text-white">Total Market Opportunity:</strong> The combined market share of these competitors represents a significant addressable market with room for disruption.
                        </p>
                        <p>
                          <strong className="text-white">White Space:</strong> Your unique positioning leverages AI technology to provide superior outcomes at accessible pricing, targeting the gap between enterprise complexity and consumer-grade simplicity.
                        </p>
                        <p>
                          <strong className="text-white">Strategy:</strong> Focus on students and early-stage founders who are underserved by expensive enterprise solutions and basic consumer tools. Build viral growth through exceptional UX and word-of-mouth from early adopters.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {type === 'market-strategy' && 'targetAudience' in data && (
                  <div className="space-y-6">
                    {/* Target Audience */}
                    <div className="glass-card rounded-xl p-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#38bdf8]"></div>
                        Target Audience
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-semibold text-[#38bdf8]">Primary:</span>
                          <p className="text-slate-300">{data.targetAudience.primary}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-[#38bdf8]">Secondary:</span>
                          <p className="text-slate-300">{data.targetAudience.secondary}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-[#38bdf8]">Demographics:</span>
                          <ul className="mt-2 space-y-1">
                            {data.targetAudience.demographics.map((demo, i) => (
                              <li key={i} className="text-slate-300 flex items-start gap-2">
                                <span className="text-[#38bdf8]">•</span>
                                {demo}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Go-to-Market Strategy */}
                    <div className="glass-card rounded-xl p-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#a855f7]"></div>
                        Go-to-Market Strategy
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-[#38bdf8] mb-2">Phase 1: Launch</h4>
                          <p className="text-slate-300">{data.goToMarketStrategy.phase1}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-[#a855f7] mb-2">Phase 2: Growth</h4>
                          <p className="text-slate-300">{data.goToMarketStrategy.phase2}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-[#06b6d4] mb-2">Phase 3: Scale</h4>
                          <p className="text-slate-300">{data.goToMarketStrategy.phase3}</p>
                        </div>
                      </div>
                    </div>

                    {/* Revenue Model */}
                    <div className="glass-card rounded-xl p-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#06b6d4]"></div>
                        Revenue Model
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-semibold text-[#38bdf8]">Primary Revenue Stream:</span>
                          <p className="text-slate-300">{data.revenueModel.primary}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-[#a855f7]">Secondary Revenue Stream:</span>
                          <p className="text-slate-300">{data.revenueModel.secondary}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-[#06b6d4]">Pricing Strategy:</span>
                          <p className="text-slate-300">{data.revenueModel.pricing}</p>
                        </div>
                      </div>
                    </div>

                    {/* Marketing Channels */}
                    <div className="glass-card rounded-xl p-6">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div>
                        Marketing Channels
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {data.marketingChannels.map((channel, i) => (
                          <div key={i} className="bg-white/5 rounded-lg p-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#a855f7]"></div>
                            <span className="text-slate-300">{channel}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}