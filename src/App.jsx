import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './core/context/AuthContext';
import { ReportsProvider } from './modules/reports/context/ReportsContext';
import AppRouter from './core/router/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReportsProvider>
          <AppRouter />
        </ReportsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
