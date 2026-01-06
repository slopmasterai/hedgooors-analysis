# Hedgooors Prediction Analysis Dashboard

A professional React + TypeScript application for analyzing financial predictions from the Hedgooors forecasting group across 2023-2026.

## Features

### 📊 Leaderboard
- Sortable rankings of all forecasters
- Multiple metrics: Overall score, bias, range capture rate
- Letter grades (A+ to F) based on prediction precision
- Visual indicators for top performers (🥇🥈🥉)
- Detailed stats including number of markets predicted

### 📈 Charts
- **Consensus Chart**: Bar chart showing mean/median predictions across all markets
- **Prediction Scatter**: Visualize prediction distributions and ranges
- Market-specific statistics with color coding
- Interactive tooltips with detailed information

### 💡 Insights
- Automated analysis of forecaster patterns
- Diversity insights (market disagreement levels)
- Bias detection (conservative vs aggressive forecasters)
- Consensus analysis (recession predictions, market sentiment)
- Participation metrics

### 🔍 Filters
- Filter by year (2023, 2024, 2025, 2026)
- Filter by market (S&P 500, Nasdaq, Gold, BTC, ETH, SOL, Fartcoin)
- Select/deselect individual forecasters
- Real-time updates across all views

## Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data Processing**: xlsx, lodash
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/           # Header, Layout components
│   ├── leaderboard/      # Leaderboard table and rankings
│   ├── charts/           # Visualization components
│   ├── insights/         # Insights and analysis
│   └── filters/          # Filter controls
├── context/
│   └── PredictionContext.tsx  # Global state management
├── types/
│   └── index.ts          # TypeScript type definitions
├── utils/
│   ├── parseExcel.ts     # Excel file parser
│   ├── statistics.ts     # Statistical calculations
│   ├── accuracy.ts       # Accuracy metrics
│   └── insights.ts       # Insight generation
├── App.tsx
├── main.tsx
└── index.css

public/
└── data/
    └── predictions.xlsx  # Source data
```

## Key Metrics

### MAPE (Mean Absolute Percentage Error)
Measures average prediction error. Lower is better.
- A+ Grade: < 5%
- A Grade: 5-10%
- B Grade: 10-15%
- C Grade: 15-20%
- D Grade: 20-30%
- F Grade: > 30%

### Bias
Directional error showing bullish (+) or bearish (-) tendencies.

### Range Capture Rate
Percentage of actual values that fall within predicted high/low ranges.

### Diversity Score
Standard deviation of predictions showing forecaster disagreement.

## Data Source

The application parses an Excel file with 5 sheets:
- 2023 predictions
- 2024 predictions
- 2025 predictions
- 2026 Financial predictions
- 2026 Goals predictions

Each sheet contains predictions from ~16 forecasters for:
- Traditional markets: S&P 500, Nasdaq, Gold
- Crypto: BTC, ETH, SOL, Fartcoin
- Categorical predictions: Best LLM provider, IPO predictions, Mag 7 performance

## Future Enhancements

- [ ] Add actual market data for 2023-2025 to calculate real accuracy metrics
- [ ] Correlation heatmap showing forecaster clustering
- [ ] Time series charts showing prediction evolution
- [ ] Export filtered data as CSV
- [ ] Forecaster detail pages with drill-down analysis
- [ ] Real-time market data integration
- [ ] Historical track record visualization
- [ ] Custom metric definitions

## Development Notes

### Styling
- Dark mode theme optimized for financial data
- Color-coded markets for easy identification
- Responsive design (desktop-first)
- Accessible UI with proper contrast ratios

### Performance
- Memoized calculations for expensive operations
- Lazy loading for chart components
- Efficient data transformations
- Context-based state management

### Data Flow
1. Excel file loaded from `/public/data/predictions.xlsx`
2. Parsed on app mount using `xlsx` library
3. Cached in React Context
4. Filtered based on user selections
5. Statistics calculated on-demand with memoization

## License

MIT

## Contributing

This is a personal project for the Hedgooors forecasting group.
