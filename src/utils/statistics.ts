/**
 * Statistical utility functions for analyzing forecaster predictions
 */

/**
 * Calculate MAPE (Mean Absolute Percentage Error)
 */
export const calculateMAPE = (predicted: number, actual: number): number => {
  if (actual === 0) return 0;
  return (Math.abs(predicted - actual) / actual) * 100;
};

/**
 * Calculate average MAPE across multiple predictions
 */
export const calculateAverageMAPE = (
  predictions: number[],
  actuals: number[]
): number => {
  if (predictions.length !== actuals.length || predictions.length === 0) {
    return 0;
  }

  const mapes = predictions
    .map((pred, i) => calculateMAPE(pred, actuals[i]))
    .filter((mape) => !isNaN(mape) && isFinite(mape));

  return mapes.length > 0
    ? mapes.reduce((sum, mape) => sum + mape, 0) / mapes.length
    : 0;
};

/**
 * Brier Score (for binary predictions like recession)
 * Lower is better, ranges from 0 to 1
 */
export const brierScore = (probability: number, outcome: number): number => {
  return Math.pow(probability - outcome, 2);
};

/**
 * Calculate average Brier score
 */
export const calculateAverageBrierScore = (
  probabilities: number[],
  outcomes: number[]
): number => {
  if (probabilities.length !== outcomes.length || probabilities.length === 0) {
    return 0;
  }

  const scores = probabilities.map((prob, i) => brierScore(prob, outcomes[i]));
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

/**
 * Check if actual value falls within predicted range
 */
export const rangeCapture = (
  high: number,
  low: number,
  actual: number
): boolean => {
  return actual >= low && actual <= high;
};

/**
 * Calculate range capture rate as percentage
 */
export const calculateRangeCaptureRate = (
  highs: number[],
  lows: number[],
  actuals: number[]
): number => {
  if (
    highs.length !== lows.length ||
    lows.length !== actuals.length ||
    highs.length === 0
  ) {
    return 0;
  }

  const captures = highs.filter((high, i) =>
    rangeCapture(high, lows[i], actuals[i])
  ).length;

  return (captures / highs.length) * 100;
};

/**
 * Calculate implied volatility from high/low/close
 */
export const impliedVolatility = (
  high: number,
  low: number,
  close: number
): number => {
  if (close === 0) return 0;
  return (high - low) / close;
};

/**
 * Calculate bias (directional error)
 * Positive = bullish bias, Negative = bearish bias
 */
export const calculateBias = (
  predictions: number[],
  actuals: number[]
): number => {
  if (predictions.length !== actuals.length || predictions.length === 0) {
    return 0;
  }

  const errors = predictions
    .map((pred, i) => (actuals[i] !== 0 ? (pred - actuals[i]) / actuals[i] : 0))
    .filter((error) => !isNaN(error) && isFinite(error));

  return errors.length > 0
    ? (errors.reduce((sum, error) => sum + error, 0) / errors.length) * 100
    : 0;
};

/**
 * Calculate diversity score (standard deviation of predictions)
 */
export const diversityScore = (predictions: number[]): number => {
  if (predictions.length === 0) return 0;

  const mean =
    predictions.reduce((sum, pred) => sum + pred, 0) / predictions.length;
  const variance =
    predictions.reduce((sum, pred) => sum + Math.pow(pred - mean, 2), 0) /
    predictions.length;

  return Math.sqrt(variance);
};

/**
 * Calculate mean (average)
 */
export const mean = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Calculate median
 */
export const median = (values: number[]): number => {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

/**
 * Calculate standard deviation
 */
export const standardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;

  const avg = mean(values);
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
    values.length;

  return Math.sqrt(variance);
};

/**
 * Calculate Pearson correlation coefficient between two arrays
 */
export const correlation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;

  const meanX = mean(x);
  const meanY = mean(y);

  const numerator = x.reduce(
    (sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY),
    0
  );

  const denominatorX = Math.sqrt(
    x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0)
  );

  const denominatorY = Math.sqrt(
    y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0)
  );

  if (denominatorX === 0 || denominatorY === 0) return 0;

  return numerator / (denominatorX * denominatorY);
};

/**
 * Parse number from string, handling commas
 */
export const parseNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return value;

  const cleaned = value.toString().replace(/,/g, '');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? null : parsed;
};
