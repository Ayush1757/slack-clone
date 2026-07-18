import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';

const App = (): JSX.Element => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? '/app' : '/login'} replace />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={user ? <Navigate to="/app" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/app" replace /> : <RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
