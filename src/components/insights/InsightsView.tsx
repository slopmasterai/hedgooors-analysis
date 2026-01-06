import { useMemo } from 'react';
import { usePredictions } from '../../context/PredictionContext';
import { generateInsights } from '../../utils/insights';

const InsightsView = () => {
  const { filteredPredictions, forecasters } = usePredictions();

  const insights = useMemo(() => {
    return generateInsights(filteredPredictions, forecasters);
  }, [filteredPredictions, forecasters]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-500/10';
      case 'notable':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-blue-500 bg-blue-500/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'notable':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'accuracy':
        return '🎯';
      case 'bias':
        return '📊';
      case 'diversity':
        return '🌐';
      case 'cluster':
        return '🔗';
      case 'consensus':
        return '🤝';
      default:
        return '💡';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-dark-card rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Insights & Analysis</h2>
        <p className="text-gray-400">
          Automated analysis of forecaster patterns, biases, and market consensus
        </p>
      </div>

      {insights.length === 0 ? (
        <div className="bg-dark-card rounded-lg p-12 border border-dark-border text-center">
          <p className="text-gray-400 text-lg">No insights available for current filters</p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your year or market filters to see more analysis
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`rounded-lg p-6 border-l-4 ${getSeverityColor(insight.severity)}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{getTypeIcon(insight.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {insight.title}
                    </h3>
                    <span className="text-xl">{getSeverityIcon(insight.severity)}</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{insight.description}</p>

                  <div className="mt-3 flex gap-2">
                    <span className="px-2 py-1 bg-dark-bg rounded text-xs text-gray-400 uppercase">
                      {insight.type}
                    </span>
                    <span className="px-2 py-1 bg-dark-bg rounded text-xs text-gray-400 uppercase">
                      {insight.severity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <h3 className="text-lg font-semibold text-white mb-3">About Insights</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              <strong className="text-gray-300">Accuracy:</strong> Overall forecaster
              performance and participation metrics
            </p>
            <p>
              <strong className="text-gray-300">Bias:</strong> Systematic tendencies toward
              bullish/bearish predictions or wide/narrow ranges
            </p>
            <p>
              <strong className="text-gray-300">Diversity:</strong> Level of disagreement
              among forecasters for specific markets
            </p>
            <p>
              <strong className="text-gray-300">Consensus:</strong> Strong agreements among
              the forecaster group
            </p>
          </div>
        </div>

        <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
          <h3 className="text-lg font-semibold text-white mb-3">Severity Levels</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">ℹ️</span>
              <span className="text-gray-400">
                <strong className="text-blue-400">Info:</strong> General observations and
                statistics
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="text-gray-400">
                <strong className="text-yellow-400">Notable:</strong> Interesting patterns
                worth attention
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚨</span>
              <span className="text-gray-400">
                <strong className="text-red-400">Critical:</strong> Significant findings or
                strong consensus
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsView;
