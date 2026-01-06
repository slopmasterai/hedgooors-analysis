import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { usePredictions } from '../../context/PredictionContext';
import { mean, median, standardDeviation } from '../../utils/statistics';
import { MARKET_LABELS, MARKET_COLORS, MarketKey } from '../../types';

const ConsensusChart = () => {
  const { filteredPredictions, selectedMarkets } = usePredictions();

  const consensusData = useMemo(() => {
    const data: Array<{
      market: string;
      mean: number;
      median: number;
      stdDev: number;
      min: number;
      max: number;
      count: number;
      color: string;
    }> = [];

    for (const marketKey of selectedMarkets) {
      const predictions: number[] = [];

      for (const prediction of filteredPredictions) {
        const market = prediction.markets[marketKey];
        if (market && market.close !== null) {
          predictions.push(market.close);
        }
      }

      if (predictions.length > 0) {
        data.push({
          market: MARKET_LABELS[marketKey as MarketKey],
          mean: mean(predictions),
          median: median(predictions),
          stdDev: standardDeviation(predictions),
          min: Math.min(...predictions),
          max: Math.max(...predictions),
          count: predictions.length,
          color: MARKET_COLORS[marketKey as MarketKey],
        });
      }
    }

    return data;
  }, [filteredPredictions, selectedMarkets]);

  if (consensusData.length === 0) {
    return (
      <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
        <p className="text-gray-400 text-center py-8">
          No consensus data available for selected filters
        </p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
      <h3 className="text-xl font-bold text-white mb-4">Consensus Predictions</h3>
      <p className="text-gray-400 text-sm mb-6">
        Mean and median forecasts across all predictors by market
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={consensusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="market" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0) {
                const data = payload[0].payload;
                return (
                  <div className="bg-dark-bg border border-dark-border rounded p-3">
                    <p className="text-white font-semibold mb-2">{data.market}</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300">Mean: {data.mean.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      <p className="text-gray-300">Median: {data.median.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      <p className="text-gray-300">Std Dev: {data.stdDev.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      <p className="text-gray-300">Range: {data.min.toLocaleString(undefined, { maximumFractionDigits: 0 })} - {data.max.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      <p className="text-gray-400 text-xs mt-2">{data.count} predictions</p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="mean" name="Mean" fill="#3b82f6">
            {consensusData.map((entry, index) => (
              <Cell key={`cell-mean-${index}`} fill={entry.color} opacity={0.8} />
            ))}
          </Bar>
          <Bar dataKey="median" name="Median" fill="#8b5cf6">
            {consensusData.map((entry, index) => (
              <Cell key={`cell-median-${index}`} fill={entry.color} opacity={0.5} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {consensusData.map((item) => (
          <div
            key={item.market}
            className="bg-dark-bg rounded p-3 border-l-4"
            style={{ borderColor: item.color }}
          >
            <p className="text-xs text-gray-500 mb-1">{item.market}</p>
            <p className="text-lg font-bold text-white">
              {item.median.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-400">
              σ = {item.stdDev.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsensusChart;
