import { usePredictions } from '../../context/PredictionContext';
import { MARKET_LABELS, MarketKey } from '../../types';

const FilterPanel = () => {
  const {
    selectedYears,
    setSelectedYears,
    selectedMarkets,
    setSelectedMarkets,
    selectedForecasters,
    setSelectedForecasters,
    forecasters,
  } = usePredictions();

  const allYears = [2023, 2024, 2025, 2026];
  const allMarkets: MarketKey[] = ['SP500', 'NDQ', 'GOLD', 'BTC', 'ETH', 'SOL', 'FARTCOIN'];

  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      const newYears = selectedYears.filter((y) => y !== year);
      if (newYears.length > 0) {
        setSelectedYears(newYears);
      }
    } else {
      setSelectedYears([...selectedYears, year].sort());
    }
  };

  const toggleMarket = (market: MarketKey) => {
    if (selectedMarkets.includes(market)) {
      const newMarkets = selectedMarkets.filter((m) => m !== market);
      if (newMarkets.length > 0) {
        setSelectedMarkets(newMarkets);
      }
    } else {
      setSelectedMarkets([...selectedMarkets, market]);
    }
  };

  const toggleForecaster = (name: string) => {
    if (selectedForecasters.includes(name)) {
      const newForecasters = selectedForecasters.filter((f) => f !== name);
      if (newForecasters.length > 0) {
        setSelectedForecasters(newForecasters);
      }
    } else {
      setSelectedForecasters([...selectedForecasters, name]);
    }
  };

  const selectAllForecasters = () => {
    setSelectedForecasters(forecasters.map((f) => f.name));
  };

  const deselectAllForecasters = () => {
    if (forecasters.length > 0) {
      setSelectedForecasters([forecasters[0].name]);
    }
  };

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          📅 Years
        </h3>
        <div className="flex flex-wrap gap-2">
          {allYears.map((year) => (
            <button
              key={year}
              onClick={() => toggleYear(year)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedYears.includes(year)
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-bg text-gray-400 hover:bg-dark-bg/80'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          💹 Markets
        </h3>
        <div className="flex flex-wrap gap-2">
          {allMarkets.map((market) => (
            <button
              key={market}
              onClick={() => toggleMarket(market)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedMarkets.includes(market)
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-bg text-gray-400 hover:bg-dark-bg/80'
              }`}
            >
              {MARKET_LABELS[market]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            👥 Forecasters ({selectedForecasters.length}/{forecasters.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={selectAllForecasters}
              className="text-xs px-3 py-1 bg-dark-bg text-gray-400 hover:text-white rounded transition-colors"
            >
              Select All
            </button>
            <button
              onClick={deselectAllForecasters}
              className="text-xs px-3 py-1 bg-dark-bg text-gray-400 hover:text-white rounded transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {forecasters.map((forecaster) => (
            <label
              key={forecaster.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-dark-bg cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedForecasters.includes(forecaster.name)}
                onChange={() => toggleForecaster(forecaster.name)}
                className="w-4 h-4 rounded border-gray-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-dark-card"
              />
              <span className="text-gray-300 text-sm">{forecaster.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
