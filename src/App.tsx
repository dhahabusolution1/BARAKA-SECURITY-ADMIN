import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { AlertesList } from './pages/alertes/AlertesList';
import { AlerteDetail } from './pages/alertes/AlerteDetail';
import { CartePage } from './pages/carte/CartePage';
import { EquipesPage } from './pages/equipes/EquipesPage';
import { StatsPage } from './pages/stats/StatsPage';
import { UtilisateursPage } from './pages/utilisateurs/UtilisateursPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Supervision Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="alertes" element={<AlertesList />} />
          <Route path="alertes/:id" element={<AlerteDetail />} />
          <Route path="carte" element={<CartePage />} />
          <Route path="equipes" element={<EquipesPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route
            path="utilisateurs"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                <UtilisateursPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
