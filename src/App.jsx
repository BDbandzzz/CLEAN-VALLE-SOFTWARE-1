import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './core/context/AuthContext';
import { CatalogProvider } from './core/context/CatalogContext';
import { ReportsProvider } from './modules/reports/context/ReportsContext';
import { UserManagementProvider } from './modules/admin/users/context/UserManagementContext';
import AppRouter from './core/router/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <CatalogProvider>
        <AuthProvider>
          <UserManagementProvider>
            <ReportsProvider>
              <AppRouter />
            </ReportsProvider>
          </UserManagementProvider>
        </AuthProvider>
      </CatalogProvider>
    </BrowserRouter>
  );
}

export default App;
