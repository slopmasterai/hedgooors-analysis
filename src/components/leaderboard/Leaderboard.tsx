import { useMemo, useState } from 'react';
import { usePredictions } from '../../context/PredictionContext';
import { calculateLeaderboard, getAccuracyGrade } from '../../utils/accuracy';
import { HistoricalAccuracy } from '../../types';

type SortKey = 'rank' | 'name' | 'mape' | 'bias' | 'rangeCapture';
type SortDirection = 'asc' | 'desc';

const Leaderboard = () => {
  const { filteredPredictions, forecasters } = usePredictions();
  const [sortKey, setSortKey] = useState<SortKey>('mape');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const leaderboard = useMemo(() => {
    return calculateLeaderboard(filteredPredictions, forecasters);
  }, [filteredPredictions, forecasters]);

  const sortedLeaderboard = useMemo(() => {
    const sorted = [...leaderboard];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case 'name':
          comparison = a.forecaster.name.localeCompare(b.forecaster.name);
          break;
        case 'mape':
          comparison = a.overallMAPE - b.overallMAPE;
          break;
        case 'bias':
          comparison = Math.abs(a.bias) - Math.abs(b.bias);
          break;
        case 'rangeCapture':
          comparison = b.rangeCapture - a.rangeCapture; // Higher is better
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [leaderboard, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection(key === 'rangeCapture' ? 'desc' : 'asc');
    }
  };

  const SortIndicator = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <span className="text-gray-600 ml-1">⇅</span>;
    return (
      <span className="text-primary-400 ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-dark-card rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Forecaster Rankings</h2>
        <p className="text-gray-400 mb-6">
          Based on actual market data from 2023-2025
          <span className="text-xs ml-2 text-green-400">
            ✓ Using real MAPE calculations
          </span>
        </p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Rank
                </th>
                <th
                  className="text-left py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Forecaster
                  <SortIndicator columnKey="name" />
                </th>
                <th
                  className="text-left py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('mape')}
                >
                  Score
                  <SortIndicator columnKey="mape" />
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Grade
                </th>
                <th
                  className="text-left py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('bias')}
                >
                  Bias
                  <SortIndicator columnKey="bias" />
                </th>
                <th
                  className="text-left py-3 px-4 text-gray-400 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('rangeCapture')}
                >
                  Range Capture
                  <SortIndicator columnKey="rangeCapture" />
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">
                  Predictions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedLeaderboard.map((entry, index) => (
                <LeaderboardRow
                  key={entry.forecaster.id}
                  entry={entry}
                  rank={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Forecasters"
          value={forecasters.length.toString()}
          icon="👥"
        />
        <StatCard
          title="Total Predictions"
          value={filteredPredictions.length.toString()}
          icon="📊"
        />
        <StatCard
          title="Markets Tracked"
          value="7"
          description="S&P 500, Nasdaq, Gold, BTC, ETH, SOL, Fartcoin"
          icon="💹"
        />
      </div>
    </div>
  );
};

interface LeaderboardRowProps {
  entry: HistoricalAccuracy;
  rank: number;
}

const LeaderboardRow = ({ entry, rank }: LeaderboardRowProps) => {
  const { grade, color } = getAccuracyGrade(entry.overallMAPE);

  const getBiasDisplay = (bias: number) => {
    if (Math.abs(bias) < 1) return { text: 'Neutral', color: 'text-gray-400' };
    if (bias > 0) return { text: `+${bias.toFixed(1)}% Bull`, color: 'text-green-400' };
    return { text: `${bias.toFixed(1)}% Bear`, color: 'text-red-400' };
  };

  const biasDisplay = getBiasDisplay(entry.bias);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <tr className="border-b border-dark-border hover:bg-dark-bg/50 transition-colors">
      <td className="py-4 px-4">
        <span className="text-lg font-semibold text-white">
          {getRankBadge(rank)}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="font-semibold text-white">{entry.forecaster.name}</div>
      </td>
      <td className="py-4 px-4">
        <span className="text-white font-mono text-lg">
          {entry.overallMAPE.toFixed(1)}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className={`text-xl font-bold ${color}`}>{grade}</span>
      </td>
      <td className="py-4 px-4">
        <span className={`font-medium ${biasDisplay.color}`}>
          {biasDisplay.text}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-dark-bg rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary-500 h-full rounded-full"
              style={{ width: `${entry.rangeCapture}%` }}
            />
          </div>
          <span className="text-white font-mono text-sm w-12 text-right">
            {entry.rangeCapture.toFixed(0)}%
          </span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-gray-400">
          {Object.keys(entry.marketMAPE).length} markets
        </span>
      </td>
    </tr>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: string;
}

const StatCard = ({ title, value, description, icon }: StatCardProps) => {
  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};

export default Leaderboard;
