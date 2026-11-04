import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import LandingPage from './components/LandingPage';
import SearchPage from './pages/SearchPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import ComparePage from './pages/ComparePage';
import AiRecommendationPage from './pages/AiRecommendationPage';
import TenantDashboard from './pages/TenantDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuth();
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppContent() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenAuth={() => setShowAuthModal(true)} />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage onOpenAuth={() => setShowAuthModal(true)} />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage onOpenAuth={() => setShowAuthModal(true)} />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/ai-recommendations" element={<AiRecommendationPage />} />

          {/* Role Protected Routes */}
          <Route 
            path="/tenant/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_TENANT', 'ROLE_ADMIN']}>
                <TenantDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_OWNER', 'ROLE_ADMIN']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <CompareProvider>
            <AppContent />
          </CompareProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}
