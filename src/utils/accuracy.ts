import { YearPredictions, HistoricalAccuracy, Forecaster, MarketKey } from '../types';
import { calculateAverageMAPE, calculateBias, calculateRangeCaptureRate } from './statistics';
import { ACTUAL_DATA, hasActualData } from '../data/actualData';

/**
 * Calculate historical accuracy for a forecaster using actual market data
 */
export const calculateForecasterAccuracy = (
  predictions: YearPredictions[],
  forecaster: Forecaster
): HistoricalAccuracy => {
  const forecasterPredictions = predictions.filter(
    (p) => p.forecaster.name === forecaster.name
  );

  if (forecasterPredictions.length === 0) {
    return {
      forecaster,
      overallMAPE: 0,
      marketMAPE: {},
      bias: 0,
      rangeCapture: 0,
    };
  }

  const markets: MarketKey[] = ['SP500', 'NDQ', 'GOLD', 'BTC', 'ETH', 'SOL', 'FARTCOIN'];
  const marketMAPE: Record<string, number> = {};
  const allPredictedCloses: number[] = [];
  const allActualCloses: number[] = [];
  const allHighs: number[] = [];
  const allLows: number[] = [];
  const yearlyMAPE: Record<number, number> = {};

  // Calculate MAPE for each market
  for (const market of markets) {
    const marketPreds: number[] = [];
    const marketActuals: number[] = [];

    for (const prediction of forecasterPredictions) {
      // Only calculate if we have actual data for this year
      if (!hasActualData(prediction.year)) continue;

      const marketPrediction = prediction.markets[market];
      const actualData = ACTUAL_DATA[prediction.year]?.[market];

      if (!marketPrediction || marketPrediction.close === null || !actualData) continue;

      const actualClose = actualData.close;

      // Skip if actual close is 0 (market didn't exist)
      if (actualClose === 0) continue;

      marketPreds.push(marketPrediction.close);
      marketActuals.push(actualClose);

      allPredictedCloses.push(marketPrediction.close);
      allActualCloses.push(actualClose);

      if (marketPrediction.high !== null && marketPrediction.low !== null) {
        allHighs.push(marketPrediction.high);
        allLows.push(marketPrediction.low);
      }
    }

    if (marketPreds.length > 0) {
      marketMAPE[market] = calculateAverageMAPE(marketPreds, marketActuals);
    }
  }

  // Calculate yearly MAPE
  for (const year of [2023, 2024, 2025]) {
    if (!hasActualData(year)) continue;

    const yearPreds = forecasterPredictions.filter(p => p.year === year);
    const yearPredictedCloses: number[] = [];
    const yearActualCloses: number[] = [];

    for (const prediction of yearPreds) {
      for (const market of markets) {
        const marketPrediction = prediction.markets[market];
        const actualData = ACTUAL_DATA[year]?.[market];

        if (!marketPrediction || marketPrediction.close === null || !actualData) continue;
        if (actualData.close === 0) continue;

        yearPredictedCloses.push(marketPrediction.close);
        yearActualCloses.push(actualData.close);
      }
    }

    if (yearPredictedCloses.length > 0) {
      yearlyMAPE[year] = calculateAverageMAPE(yearPredictedCloses, yearActualCloses);
    }
  }

  const overallMAPE =
    allPredictedCloses.length > 0
      ? calculateAverageMAPE(allPredictedCloses, allActualCloses)
      : 0;

  const bias =
    allPredictedCloses.length > 0
      ? calculateBias(allPredictedCloses, allActualCloses)
      : 0;

  const rangeCapture =
    allHighs.length > 0
      ? calculateRangeCaptureRate(allHighs, allLows, allActualCloses.slice(0, allHighs.length))
      : 0;

  return {
    forecaster,
    overallMAPE,
    marketMAPE,
    bias,
    rangeCapture,
    yearlyMAPE,
  };
};

/**
 * Calculate leaderboard rankings for all forecasters using actual data
 */
export const calculateLeaderboard = (
  predictions: YearPredictions[],
  forecasters: Forecaster[]
): HistoricalAccuracy[] => {
  const leaderboard: HistoricalAccuracy[] = [];

  for (const forecaster of forecasters) {
    const accuracy = calculateForecasterAccuracy(predictions, forecaster);

    // Only include forecasters who have made predictions with actual data
    if (accuracy.overallMAPE > 0 || Object.keys(accuracy.marketMAPE).length > 0) {
      leaderboard.push(accuracy);
    }
  }

  // Sort by overall MAPE (lower is better)
  return leaderboard.sort((a, b) => {
    // If one has no MAPE, put it at the end
    if (a.overallMAPE === 0 && b.overallMAPE === 0) return 0;
    if (a.overallMAPE === 0) return 1;
    if (b.overallMAPE === 0) return -1;
    return a.overallMAPE - b.overallMAPE;
  });
};

/**
 * Get a simplified accuracy score description
 */
export const getAccuracyGrade = (mape: number): { grade: string; color: string } => {
  if (mape === 0) return { grade: 'N/A', color: 'text-gray-400' };
  if (mape < 5) return { grade: 'A+', color: 'text-green-400' };
  if (mape < 10) return { grade: 'A', color: 'text-green-500' };
  if (mape < 15) return { grade: 'B', color: 'text-blue-400' };
  if (mape < 20) return { grade: 'C', color: 'text-yellow-400' };
  if (mape < 30) return { grade: 'D', color: 'text-orange-400' };
  return { grade: 'F', color: 'text-red-400' };
};

/**
 * Get market-specific MAPE for a forecaster
 */
export const getMarketMAPE = (
  predictions: YearPredictions[],
  forecasterName: string,
  market: MarketKey
): number => {
  const forecasterPreds = predictions.filter(p => p.forecaster.name === forecasterName);

  const preds: number[] = [];
  const actuals: number[] = [];

  for (const prediction of forecasterPreds) {
    if (!hasActualData(prediction.year)) continue;

    const marketPrediction = prediction.markets[market];
    const actualData = ACTUAL_DATA[prediction.year]?.[market];

    if (!marketPrediction || marketPrediction.close === null || !actualData) continue;
    if (actualData.close === 0) continue;

    preds.push(marketPrediction.close);
    actuals.push(actualData.close);
  }

  return preds.length > 0 ? calculateAverageMAPE(preds, actuals) : 0;
};
