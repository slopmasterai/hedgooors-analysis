import { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { usePredictions } from '../../context/PredictionContext';
import { MARKET_COLORS, MARKET_LABELS, MarketKey } from '../../types';

const PredictionScatter = () => {
  const { filteredPredictions, selectedMarkets } = usePredictions();

  const scatterData = useMemo(() => {
    const data: Array<{
      market: string;
      forecaster: string;
      high: number;
      low: number;
      close: number;
      range: number;
      color: string;
    }> = [];

    for (const prediction of filteredPredictions) {
      for (const marketKey of selectedMarkets) {
        const market = prediction.markets[marketKey];
        if (market && market.close !== null) {
          const range =
            market.high !== null && market.low !== null
              ? market.high - market.low
              : 0;

          data.push({
            market: MARKET_LABELS[marketKey as MarketKey],
            forecaster: prediction.forecaster.name,
            high: market.high || 0,
            low: market.low || 0,
            close: market.close,
            range,
            color: MARKET_COLORS[marketKey as MarketKey],
          });
        }
      }
    }

    return data;
  }, [filteredPredictions, selectedMarkets]);

  // Group by market for separate scatter series
  const dataByMarket = useMemo(() => {
    const grouped = new Map<string, typeof scatterData>();

    for (const point of scatterData) {
      if (!grouped.has(point.market)) {
        grouped.set(point.market, []);
      }
      grouped.get(point.market)!.push(point);
    }

    return grouped;
  }, [scatterData]);

  if (scatterData.length === 0) {
    return (
      <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
        <p className="text-gray-400 text-center py-8">
          No prediction data available for selected filters
        </p>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
      <h3 className="text-xl font-bold text-white mb-4">
        Prediction Distribution
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        Close predictions vs prediction range (high - low) by market
      </p>

      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            type="number"
            dataKey="close"
            name="Predicted Close"
            stroke="#94a3b8"
            label={{ value: 'Predicted Close', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
          />
          <YAxis
            type="number"
            dataKey="range"
            name="Range"
            stroke="#94a3b8"
            label={{ value: 'Prediction Range', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
          />
          <ZAxis range={[50, 400]} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0) {
                const data = payload[0].payload;
                return (
                  <div className="bg-dark-bg border border-dark-border rounded p-3">
                    <p className="text-white font-semibold mb-1">{data.market}</p>
                    <p className="text-gray-400 text-sm mb-2">{data.forecaster}</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-300">Close: {data.close.toLocaleString()}</p>
                      <p className="text-gray-300">High: {data.high.toLocaleString()}</p>
                      <p className="text-gray-300">Low: {data.low.toLocaleString()}</p>
                      <p className="text-gray-300">Range: {data.range.toLocaleString()}</p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          {Array.from(dataByMarket.entries()).map(([market, data]) => (
            <Scatter
              key={market}
              name={market}
              data={data}
              fill={data[0]?.color || '#3b82f6'}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionScatter;
