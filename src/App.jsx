import { AppProviders } from '@/core/providers/AppProviders';
import AppRouter from '@/core/router/AppRouter';

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
