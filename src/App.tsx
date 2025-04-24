import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout components
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import CreatorPage from './pages/CreatorPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RecoveryPage from './pages/RecoveryPage';
import ProfilePage from './pages/ProfilePage';

// Admin pages
import AdminTemplatePage from './pages/admin/TemplatePage';
import AdminCategoryPage from './pages/admin/CategoryPage';
import AdminConfigPage from './pages/admin/ConfigPage';

// Auth context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="creator/:templateId" element={<CreatorPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="recovery" element={<RecoveryPage />} />
          </Route>
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminTemplatePage />} />
            <Route path="categories" element={<AdminCategoryPage />} />
            <Route path="config/:templateId" element={<AdminConfigPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;