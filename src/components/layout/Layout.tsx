import { useState } from 'react';
import { usePredictions } from '../../context/PredictionContext';
import Header from './Header';
import Leaderboard from '../leaderboard/Leaderboard';
import ChartsView from '../charts/ChartsView';
import InsightsView from '../insights/InsightsView';

type ViewType = 'leaderboard' | 'charts' | 'insights';

const Layout = () => {
  const { loading, error } = usePredictions();
  const [activeView, setActiveView] = useState<ViewType>('leaderboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading predictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header activeView={activeView} setActiveView={setActiveView} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {activeView === 'leaderboard' && <Leaderboard />}
        {activeView === 'charts' && <ChartsView />}
        {activeView === 'insights' && <InsightsView />}
      </main>
    </div>
  );
};

export default Layout;
