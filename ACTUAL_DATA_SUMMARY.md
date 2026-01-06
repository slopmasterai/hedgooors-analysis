# Actual Market Data Summary

This document confirms the actual market data being used for MAPE calculations.

## 2023 Data

| Market | High | Low | Close |
|--------|------|-----|-------|
| S&P 500 | 4,793 | 3,808 | 4,770 |
| Nasdaq | 16,969 | 10,440 | 16,825 |
| Gold | 2,135 | 1,810 | 2,063 |
| Bitcoin | 44,700 | 16,500 | 42,300 |
| Ethereum | 2,445 | 1,196 | 2,290 |
| Solana | 126 | 10 | 102 |

## 2024 Data

| Market | High | Low | Close |
|--------|------|-----|-------|
| S&P 500 | 6,051 | 4,742 | 5,881 |
| Nasdaq | 21,615 | 16,200 | 21,012 |
| Gold | 2,790 | 1,984 | 2,625 |
| Bitcoin | 106,490 | 38,500 | 92,380 |
| Ethereum | 3,986 | 2,150 | 3,355 |
| Solana | 252 | 80 | 191 |

## 2025 Data

| Market | High | Low | Close |
|--------|------|-----|-------|
| S&P 500 | 6,945 | 4,835 | 6,902 |
| Nasdaq | 26,182 | 19,145 | 25,250 |
| Gold | 4,584 | 2,624 | 4,336 |
| Bitcoin | 126,000 | 75,000 | 87,500 |
| Ethereum | 4,600 | 1,552 | 2,965 |
| Solana | 257 | 106 | 124 |

## Data Location

The actual data is stored in: `/src/data/actualData.ts`

## How It's Used

1. **MAPE Calculation**: Compares each forecaster's predicted close values against actual close values
2. **Bias Calculation**: Determines if forecasters are systematically bullish or bearish
3. **Range Capture**: Checks if the actual close fell within the predicted high/low range
4. **Market-specific MAPE**: Calculates accuracy for each individual market

## Notes

- Fartcoin data is set to 0 (need actual data if available)
- 2026 predictions have no actual data yet (future year)
- All calculations automatically skip years/markets with no actual data

## Verification

✅ Data matches the provided actual market values
✅ Integrated into accuracy calculations
✅ Leaderboard now shows real MAPE scores
✅ No demo/placeholder data being used for 2023-2025
