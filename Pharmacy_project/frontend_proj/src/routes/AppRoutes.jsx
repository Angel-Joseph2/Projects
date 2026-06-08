import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import MedicinePage from '../pages/MedicinePage';
import AdminsPage from '../pages/AdminsPage';
import DoctorsPage from '../pages/DoctorsPage';
import PharmacistsPage from '../pages/PharmacistsPage';
import PrescriptionsPage from '../pages/PrescriptionsPage';
import BillingPage from '../pages/BillingPage';
import ReportsPage from '../pages/ReportsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="medicines" element={<MedicinePage />} />
        <Route path="admins" element={<AdminsPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="pharmacists" element={<PharmacistsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      {/* Doctor Routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="medicines" element={<MedicinePage />} />
        <Route path="prescriptions" element={<PrescriptionsPage />} />
      </Route>

      {/* Pharmacist Routes */}
      <Route
        path="/pharmacist"
        element={
          <ProtectedRoute allowedRoles={['pharmacist']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/pharmacist/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="medicines" element={<MedicinePage />} />
        <Route path="billing" element={<BillingPage />} />
      </Route>

      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
