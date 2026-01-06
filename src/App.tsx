import { PredictionProvider } from './context/PredictionContext';
import Layout from './components/layout/Layout';

function App() {
  return (
    <PredictionProvider>
      <Layout />
    </PredictionProvider>
  );
}

export default App;
