import PredictionScatter from './PredictionScatter';
import ConsensusChart from './ConsensusChart';

const ChartsView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-dark-card rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Prediction Visualizations
        </h2>
        <p className="text-gray-400">
          Visual analysis of forecaster predictions across markets and years
        </p>
      </div>

      <ConsensusChart />
      <PredictionScatter />
    </div>
  );
};

export default ChartsView;
