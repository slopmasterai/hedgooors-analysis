import { MarketKey } from '../types';

/**
 * Actual market data for 2023-2025
 * Source: Historical market close values
 */
export const ACTUAL_DATA: Record<number, Record<MarketKey, { high: number; low: number; close: number }>> = {
  2023: {
    SP500: { high: 4793, low: 3808, close: 4770 },
    NDQ: { high: 16969, low: 10440, close: 16825 },
    GOLD: { high: 2135, low: 1810, close: 2063 },
    BTC: { high: 44700, low: 16500, close: 42300 },
    ETH: { high: 2445, low: 1196, close: 2290 },
    SOL: { high: 126, low: 10, close: 102 },
    FARTCOIN: { high: 0, low: 0, close: 0 }, // Did not exist in 2023
  },
  2024: {
    SP500: { high: 6051, low: 4742, close: 5881 },
    NDQ: { high: 21615, low: 16200, close: 21012 },
    GOLD: { high: 2790, low: 1984, close: 2625 },
    BTC: { high: 106490, low: 38500, close: 92380 },
    ETH: { high: 3986, low: 2150, close: 3355 },
    SOL: { high: 252, low: 80, close: 191 },
    FARTCOIN: { high: 0, low: 0, close: 0 }, // Need actual data if available
  },
  2025: {
    SP500: { high: 6945, low: 4835, close: 6902 },
    NDQ: { high: 26182, low: 19145, close: 25250 },
    GOLD: { high: 4584, low: 2624, close: 4336 },
    BTC: { high: 126000, low: 75000, close: 87500 },
    ETH: { high: 4600, low: 1552, close: 2965 },
    SOL: { high: 257, low: 106, close: 124 },
    FARTCOIN: { high: 0, low: 0, close: 0 }, // Need actual data if available
  },
};

/**
 * Get actual close price for a given year and market
 */
export const getActualClose = (year: number, market: MarketKey): number | undefined => {
  return ACTUAL_DATA[year]?.[market]?.close;
};

/**
 * Get actual high price for a given year and market
 */
export const getActualHigh = (year: number, market: MarketKey): number | undefined => {
  return ACTUAL_DATA[year]?.[market]?.high;
};

/**
 * Get actual low price for a given year and market
 */
export const getActualLow = (year: number, market: MarketKey): number | undefined => {
  return ACTUAL_DATA[year]?.[market]?.low;
};

/**
 * Check if actual data exists for a given year
 */
export const hasActualData = (year: number): boolean => {
  return year in ACTUAL_DATA;
};
