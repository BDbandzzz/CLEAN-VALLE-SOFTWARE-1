import { Navigate } from 'react-router-dom';

import { USER_ROLE_IDS } from '@/core/constants/domainConstants';
import { useAuth } from '@/core/context/AuthContext';

const HOME_BY_ROLE = Object.freeze({
  [USER_ROLE_IDS.STUDENT]: '/reports/view',
  [USER_ROLE_IDS.TEACHER]: '/reports/view',
  [USER_ROLE_IDS.OPERATOR]: '/operator',
  [USER_ROLE_IDS.MANAGER]: '/manager',
  [USER_ROLE_IDS.ADMIN]: '/admin',
});

export function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={HOME_BY_ROLE[user?.roleId] ?? '/profile'} replace />;
}
