export interface Forecaster {
  id: string;
  name: string;
  twitterHandle?: string;
}

export interface MarketPrediction {
  market: string;
  high: number | null;
  low: number | null;
  close: number | null;
  actual?: number;
}

export interface YearPredictions {
  year: number;
  forecaster: Forecaster;
  recession: number; // 0 = no, 1 = yes
  markets: Record<string, MarketPrediction>; // 'SP500', 'NDQ', 'GOLD', 'BTC', 'ETH', 'SOL', 'FARTCOIN'
  categorical?: {
    bestLLM?: string;
    willIPO?: string;
    bestMag7?: string;
  };
}

export interface HistoricalAccuracy {
  forecaster: Forecaster;
  overallMAPE: number;
  marketMAPE: Record<string, number>;
  bias: number; // Mean signed error
  brierScore?: number; // For binary predictions
  rangeCapture: number; // % of actuals within predicted ranges
  yearlyMAPE?: Record<number, number>; // MAPE by year
}

export interface ConsensusMetrics {
  year: number;
  market: string;
  meanPrediction: number;
  medianPrediction: number;
  minPrediction: number;
  maxPrediction: number;
  stdDev: number;
  diversity: number;
  actual?: number;
}

export interface Insight {
  type: 'accuracy' | 'bias' | 'diversity' | 'cluster' | 'consensus';
  title: string;
  description: string;
  severity: 'info' | 'notable' | 'critical';
  data?: unknown;
}

export type MarketKey = 'SP500' | 'NDQ' | 'GOLD' | 'BTC' | 'ETH' | 'SOL' | 'FARTCOIN';

export const MARKET_LABELS: Record<MarketKey, string> = {
  SP500: 'S&P 500',
  NDQ: 'Nasdaq',
  GOLD: 'Gold',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
  FARTCOIN: 'Fartcoin',
};

export const MARKET_COLORS: Record<MarketKey, string> = {
  SP500: '#3b82f6',
  NDQ: '#8b5cf6',
  GOLD: '#eab308',
  BTC: '#f97316',
  ETH: '#6366f1',
  SOL: '#14b8a6',
  FARTCOIN: '#ec4899',
};
