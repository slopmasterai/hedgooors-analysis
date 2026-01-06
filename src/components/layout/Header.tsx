import { useState } from 'react';
import FilterPanel from '../filters/FilterPanel';

interface HeaderProps {
  activeView: 'leaderboard' | 'charts' | 'insights';
  setActiveView: (view: 'leaderboard' | 'charts' | 'insights') => void;
}

const Header = ({ activeView, setActiveView }: HeaderProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const tabs = [
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: '🏆' },
    { id: 'charts' as const, label: 'Charts', icon: '📊' },
    { id: 'insights' as const, label: 'Insights', icon: '💡' },
  ];

  return (
    <header className="bg-dark-card border-b border-dark-border">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Hedgooors Prediction Analysis
            </h1>
            <p className="text-gray-400">
              Historical accuracy & insights from 2023-2026 predictions
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-dark-bg hover:bg-dark-bg/80 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <span>🔍</span>
            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
          </button>
        </div>

        <nav className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${
                  activeView === tab.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-dark-bg text-gray-400 hover:bg-dark-bg/80 hover:text-white'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {showFilters && (
          <div className="mt-4">
            <FilterPanel />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
