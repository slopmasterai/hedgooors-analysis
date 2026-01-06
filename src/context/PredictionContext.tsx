import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { YearPredictions, Forecaster, MarketKey } from '../types';
import { parseExcelFile, getUniqueForecasters } from '../utils/parseExcel';

interface PredictionContextType {
  predictions: YearPredictions[];
  forecasters: Forecaster[];
  loading: boolean;
  error: string | null;

  // Filters
  selectedYears: number[];
  setSelectedYears: (years: number[]) => void;
  selectedMarkets: MarketKey[];
  setSelectedMarkets: (markets: MarketKey[]) => void;
  selectedForecasters: string[];
  setSelectedForecasters: (forecasters: string[]) => void;

  // Filtered data
  filteredPredictions: YearPredictions[];
}

const PredictionContext = createContext<PredictionContextType | undefined>(
  undefined
);

export const usePredictions = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePredictions must be used within PredictionProvider');
  }
  return context;
};

interface PredictionProviderProps {
  children: ReactNode;
}

export const PredictionProvider: React.FC<PredictionProviderProps> = ({
  children,
}) => {
  const [predictions, setPredictions] = useState<YearPredictions[]>([]);
  const [forecasters, setForecasters] = useState<Forecaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedYears, setSelectedYears] = useState<number[]>([
    2023, 2024, 2025, 2026,
  ]);
  const [selectedMarkets, setSelectedMarkets] = useState<MarketKey[]>([
    'SP500',
    'NDQ',
    'GOLD',
    'BTC',
    'ETH',
    'SOL',
    'FARTCOIN',
  ]);
  const [selectedForecasters, setSelectedForecasters] = useState<string[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await parseExcelFile('/data/predictions.xlsx');
        setPredictions(data);

        const uniqueForecasters = getUniqueForecasters(data);
        setForecasters(uniqueForecasters);
        setSelectedForecasters(uniqueForecasters.map((f) => f.name));

        setError(null);
      } catch (err) {
        console.error('Failed to load predictions:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load predictions'
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter predictions based on selected filters
  const filteredPredictions = predictions.filter((prediction) => {
    if (!selectedYears.includes(prediction.year)) return false;
    if (!selectedForecasters.includes(prediction.forecaster.name)) return false;

    // Check if prediction has data for at least one selected market
    const hasSelectedMarket = selectedMarkets.some(
      (market) => prediction.markets[market] !== undefined
    );

    return hasSelectedMarket;
  });

  const value: PredictionContextType = {
    predictions,
    forecasters,
    loading,
    error,
    selectedYears,
    setSelectedYears,
    selectedMarkets,
    setSelectedMarkets,
    selectedForecasters,
    setSelectedForecasters,
    filteredPredictions,
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};
