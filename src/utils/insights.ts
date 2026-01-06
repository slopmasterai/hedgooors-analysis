import { YearPredictions, Insight, Forecaster, MarketKey, MARKET_LABELS } from '../types';
import { mean, standardDeviation } from './statistics';

/**
 * Generate automated insights from prediction data
 */
export const generateInsights = (
  predictions: YearPredictions[],
  forecasters: Forecaster[]
): Insight[] => {
  const insights: Insight[] = [];

  // 1. Diversity insights - which markets show the most disagreement
  const diversityInsights = analyzeDiversity(predictions);
  insights.push(...diversityInsights);

  // 2. Bias insights - who is most bullish/bearish
  const biasInsights = analyzeBias(predictions);
  insights.push(...biasInsights);

  // 3. Consensus insights
  const consensusInsights = analyzeConsensus(predictions);
  insights.push(...consensusInsights);

  // 4. Participation insights
  const participationInsights = analyzeParticipation(predictions, forecasters);
  insights.push(...participationInsights);

  return insights;
};

const analyzeDiversity = (predictions: YearPredictions[]): Insight[] => {
  const insights: Insight[] = [];
  const markets: MarketKey[] = ['SP500', 'NDQ', 'GOLD', 'BTC', 'ETH', 'SOL'];

  const diversityByMarket: Array<{ market: string; stdDev: number; predictions: number[] }> = [];

  for (const market of markets) {
    const preds: number[] = [];

    for (const prediction of predictions) {
      const marketData = prediction.markets[market];
      if (marketData && marketData.close !== null) {
        preds.push(marketData.close);
      }
    }

    if (preds.length > 2) {
      const stdDev = standardDeviation(preds);
      const meanVal = mean(preds);
      const coefficientOfVariation = (stdDev / meanVal) * 100;

      diversityByMarket.push({
        market: MARKET_LABELS[market],
        stdDev,
        predictions: preds,
      });

      if (coefficientOfVariation > 15) {
        insights.push({
          type: 'diversity',
          title: `High Disagreement on ${MARKET_LABELS[market]}`,
          description: `Forecasters show significant disagreement on ${MARKET_LABELS[market]} with a standard deviation of ${stdDev.toLocaleString(undefined, { maximumFractionDigits: 0 })}. This suggests uncertainty about the market direction.`,
          severity: 'notable',
          data: { market, stdDev, coefficientOfVariation },
        });
      }
    }
  }

  // Find the market with highest diversity
  if (diversityByMarket.length > 0) {
    const mostDiverse = diversityByMarket.reduce((a, b) => (a.stdDev > b.stdDev ? a : b));
    insights.push({
      type: 'diversity',
      title: 'Most Divided Predictions',
      description: `${mostDiverse.market} shows the highest disagreement among forecasters with predictions ranging widely across ${mostDiverse.predictions.length} forecasters.`,
      severity: 'info',
      data: mostDiverse,
    });
  }

  return insights;
};

const analyzeBias = (predictions: YearPredictions[]): Insight[] => {
  const insights: Insight[] = [];

  // Analyze forecaster biases by calculating their prediction ranges
  const forecasterRanges = new Map<string, { total: number; count: number; ranges: number[] }>();

  for (const prediction of predictions) {
    const name = prediction.forecaster.name;

    if (!forecasterRanges.has(name)) {
      forecasterRanges.set(name, { total: 0, count: 0, ranges: [] });
    }

    const forecasterData = forecasterRanges.get(name)!;

    for (const market of Object.values(prediction.markets)) {
      if (market.high !== null && market.low !== null && market.close !== null) {
        const range = market.high - market.low;
        const rangePercent = (range / market.close) * 100;

        forecasterData.ranges.push(rangePercent);
        forecasterData.total += rangePercent;
        forecasterData.count++;
      }
    }
  }

  // Find most conservative (narrow ranges) and most aggressive (wide ranges)
  const forecasterStats = Array.from(forecasterRanges.entries()).map(([name, data]) => ({
    name,
    avgRange: data.count > 0 ? data.total / data.count : 0,
    count: data.count,
  }));

  forecasterStats.sort((a, b) => a.avgRange - b.avgRange);

  if (forecasterStats.length > 0) {
    const mostConservative = forecasterStats[0];
    const mostAggressive = forecasterStats[forecasterStats.length - 1];

    if (mostConservative.count > 2) {
      insights.push({
        type: 'bias',
        title: 'Most Precise Forecaster',
        description: `${mostConservative.name} provides the narrowest prediction ranges (avg ${mostConservative.avgRange.toFixed(1)}% range), suggesting high confidence in their forecasts.`,
        severity: 'info',
        data: mostConservative,
      });
    }

    if (mostAggressive.count > 2 && mostAggressive.avgRange > 25) {
      insights.push({
        type: 'bias',
        title: 'Most Cautious Forecaster',
        description: `${mostAggressive.name} uses the widest prediction ranges (avg ${mostAggressive.avgRange.toFixed(1)}% range), indicating more uncertainty or hedging in their predictions.`,
        severity: 'info',
        data: mostAggressive,
      });
    }
  }

  return insights;
};

const analyzeConsensus = (predictions: YearPredictions[]): Insight[] => {
  const insights: Insight[] = [];

  // Analyze how many forecasters agree on recession
  const recessionPredictions = predictions.map((p) => p.recession);
  const recessionYes = recessionPredictions.filter((r) => r === 1).length;
  const recessionNo = recessionPredictions.filter((r) => r === 0).length;

  if (recessionPredictions.length > 0) {
    const recessionPercent = (recessionYes / recessionPredictions.length) * 100;

    if (recessionPercent > 70) {
      insights.push({
        type: 'consensus',
        title: 'Strong Recession Consensus',
        description: `${recessionPercent.toFixed(0)}% of forecasters (${recessionYes} out of ${recessionPredictions.length}) predict a recession, showing strong bearish consensus.`,
        severity: 'critical',
        data: { recessionYes, recessionNo, recessionPercent },
      });
    } else if (recessionPercent < 30) {
      insights.push({
        type: 'consensus',
        title: 'Optimistic Outlook',
        description: `Only ${recessionPercent.toFixed(0)}% of forecasters (${recessionYes} out of ${recessionPredictions.length}) predict a recession, indicating bullish sentiment.`,
        severity: 'notable',
        data: { recessionYes, recessionNo, recessionPercent },
      });
    }
  }

  return insights;
};

const analyzeParticipation = (
  predictions: YearPredictions[],
  forecasters: Forecaster[]
): Insight[] => {
  const insights: Insight[] = [];

  // Count predictions per forecaster
  const predictionCounts = new Map<string, number>();

  for (const prediction of predictions) {
    const name = prediction.forecaster.name;
    predictionCounts.set(name, (predictionCounts.get(name) || 0) + 1);
  }

  const avgPredictions = predictions.length / forecasters.length;

  insights.push({
    type: 'accuracy',
    title: 'Participation Summary',
    description: `${forecasters.length} forecasters contributed ${predictions.length} total predictions across all years (avg ${avgPredictions.toFixed(1)} predictions per forecaster).`,
    severity: 'info',
    data: { forecasters: forecasters.length, predictions: predictions.length, avgPredictions },
  });

  return insights;
};
