import { type ReactNode } from 'react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { StoreProvider, useStore } from './lib/store';
import { Shell } from './components/layout/Shell';

import ManagerDashboard from './pages/ManagerDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import StudentDashboard from './pages/StudentDashboard';

function AppContent() {
  const { activeRole } = useStore();

  return (
    <Shell>
      {activeRole === 'manager' && <ManagerDashboard />}
      {activeRole === 'supervisor' && <SupervisorDashboard />}
      {activeRole === 'student' && <StudentDashboard />}
    </Shell>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;