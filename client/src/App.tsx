import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Certifications from './pages/Certifications';
import Achievements from './pages/Achievements';
import Internships from './pages/Internships';
import Activities from './pages/Activities';
import AIAdvisor from './pages/AIAdvisor';

const ProtectedPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/"         element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard"      element={<ProtectedPage><Dashboard /></ProtectedPage>} />
          <Route path="/profile"        element={<ProtectedPage><Profile /></ProtectedPage>} />
          <Route path="/certifications" element={<ProtectedPage><Certifications /></ProtectedPage>} />
          <Route path="/achievements"   element={<ProtectedPage><Achievements /></ProtectedPage>} />
          <Route path="/internships"    element={<ProtectedPage><Internships /></ProtectedPage>} />
          <Route path="/activities"     element={<ProtectedPage><Activities /></ProtectedPage>} />
          <Route path="/ai-advisor"     element={<ProtectedPage><AIAdvisor /></ProtectedPage>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
