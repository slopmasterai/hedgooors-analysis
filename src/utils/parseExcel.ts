import * as XLSX from 'xlsx';
import { YearPredictions, Forecaster, MarketPrediction } from '../types';
import { parseNumber } from './statistics';

interface RawRow {
  [key: string]: string | number | null | undefined;
}

/**
 * Parse Excel file and extract all predictions
 */
export const parseExcelFile = async (
  filePath: string
): Promise<YearPredictions[]> => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const allPredictions: YearPredictions[] = [];

    // Parse each sheet (2023-2026)
    const sheets = ['2023', '2024', '2025', '2026 Financial', '2026 goals'];

    for (const sheetName of sheets) {
      if (workbook.SheetNames.includes(sheetName)) {
        const year = sheetName.startsWith('2026') ? 2026 : parseInt(sheetName);
        const predictions = parseSheet(workbook.Sheets[sheetName], year);
        allPredictions.push(...predictions);
      }
    }

    return allPredictions;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw error;
  }
};

/**
 * Parse a single sheet
 */
const parseSheet = (
  sheet: XLSX.WorkSheet,
  year: number
): YearPredictions[] => {
  const data: RawRow[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

  const predictions: YearPredictions[] = [];

  for (const row of data) {
    // Skip aggregate rows (Mean, Median, Min, Max, Results)
    const name = row['Name / TG Handle'] || row['f'];
    const nameStr = String(name).toLowerCase().trim();

    if (
      !name ||
      name === '' ||
      nameStr === 'mean' ||
      nameStr === 'median' ||
      nameStr === 'min' ||
      nameStr === 'max' ||
      nameStr === 'results' ||
      nameStr === 'result' ||
      nameStr === 'actual' ||
      nameStr === 'actuals'
    ) {
      continue;
    }

    // Parse name and handle
    const parts = String(name).split('/');
    const realName = parts[0]?.trim();
    const handle = parts[1]?.trim();

    // Prefer @ handle over real name for display
    const displayName = handle || realName;

    const forecaster: Forecaster = {
      id: `${year}-${displayName}`,
      name: displayName,
      twitterHandle: handle,
    };

    // Parse recession prediction
    const recession = parseNumber(row['Recession (0 no, 1 yes)']) || 0;

    // Parse market predictions
    const markets: Record<string, MarketPrediction> = {};

    // S&P 500
    const sp500High = parseNumber(row['S&P High']);
    const sp500Low = parseNumber(row['S&P Low']);
    const sp500Close = parseNumber(row['S&P Close']);
    if (sp500High !== null || sp500Low !== null || sp500Close !== null) {
      markets['SP500'] = {
        market: 'SP500',
        high: sp500High,
        low: sp500Low,
        close: sp500Close,
      };
    }

    // Nasdaq
    const ndqHigh = parseNumber(row['NDQ High']);
    const ndqLow = parseNumber(row['NDQ Low']);
    const ndqClose = parseNumber(row['NDQ Close']);
    if (ndqHigh !== null || ndqLow !== null || ndqClose !== null) {
      markets['NDQ'] = {
        market: 'NDQ',
        high: ndqHigh,
        low: ndqLow,
        close: ndqClose,
      };
    }

    // Gold
    const goldHigh = parseNumber(row['GOLD High']);
    const goldLow = parseNumber(row['GOLD Low']);
    const goldClose = parseNumber(row['GOLD Close']);
    if (goldHigh !== null || goldLow !== null || goldClose !== null) {
      markets['GOLD'] = {
        market: 'GOLD',
        high: goldHigh,
        low: goldLow,
        close: goldClose,
      };
    }

    // Bitcoin
    const btcHigh = parseNumber(row['BTC High']);
    const btcLow = parseNumber(row['BTC Low']);
    const btcClose = parseNumber(row['BTC Close']);
    if (btcHigh !== null || btcLow !== null || btcClose !== null) {
      markets['BTC'] = {
        market: 'BTC',
        high: btcHigh,
        low: btcLow,
        close: btcClose,
      };
    }

    // Ethereum
    const ethHigh = parseNumber(row['ETH High']);
    const ethLow = parseNumber(row['ETH Low']);
    const ethClose = parseNumber(row['ETH Close']);
    if (ethHigh !== null || ethLow !== null || ethClose !== null) {
      markets['ETH'] = {
        market: 'ETH',
        high: ethHigh,
        low: ethLow,
        close: ethClose,
      };
    }

    // Solana
    const solHigh = parseNumber(row['SOL High']);
    const solLow = parseNumber(row['SOL Low']);
    const solClose = parseNumber(row['SOL Close']);
    if (solHigh !== null || solLow !== null || solClose !== null) {
      markets['SOL'] = {
        market: 'SOL',
        high: solHigh,
        low: solLow,
        close: solClose,
      };
    }

    // Fartcoin
    const fartHigh = parseNumber(row['Fartcoin High']);
    const fartLow = parseNumber(row['Fartcoin Low']);
    const fartClose = parseNumber(row['Fartcoin Close']);
    if (fartHigh !== null || fartLow !== null || fartClose !== null) {
      markets['FARTCOIN'] = {
        market: 'FARTCOIN',
        high: fartHigh,
        low: fartLow,
        close: fartClose,
      };
    }

    // Categorical predictions
    const categorical = {
      bestLLM: row['Best LLM Model Provider EoY']
        ? String(row['Best LLM Model Provider EoY'])
        : undefined,
      willIPO: row['Will OAI/Anthropic File for IPO By EoY?']
        ? String(row['Will OAI/Anthropic File for IPO By EoY?'])
        : undefined,
      bestMag7: row['Best Mag 7 Performer']
        ? String(row['Best Mag 7 Performer'])
        : undefined,
    };

    predictions.push({
      year,
      forecaster,
      recession,
      markets,
      categorical,
    });
  }

  return predictions;
};

/**
 * Get unique forecasters across all years
 */
export const getUniqueForecasters = (
  predictions: YearPredictions[]
): Forecaster[] => {
  const forecasterMap = new Map<string, Forecaster>();

  for (const prediction of predictions) {
    const key = prediction.forecaster.name.toLowerCase();
    if (!forecasterMap.has(key)) {
      forecasterMap.set(key, {
        id: prediction.forecaster.name,
        name: prediction.forecaster.name,
        twitterHandle: prediction.forecaster.twitterHandle,
      });
    }
  }

  return Array.from(forecasterMap.values()).sort((a, b) => {
    // Sort by name, treating @ handles specially (remove @ for sorting)
    const nameA = a.name.replace(/^@/, '');
    const nameB = b.name.replace(/^@/, '');
    return nameA.localeCompare(nameB);
  });
};
