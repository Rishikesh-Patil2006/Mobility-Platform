import { Routes, Route } from 'react-router-dom';
import AdminLoginPage from '../pages/AdminLoginPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import VendorListPage from '../pages/VendorListPage';
import CustomerListPage from '../pages/CustomerListPage';
import BookingsPage from '../pages/BookingsPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';
import ProtectedRoute from './ProtectedRoute';
import PrivateLayout from '../components/layout/PrivateLayout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLoginPage />} />
      <Route 
        element={
          <ProtectedRoute>
            <PrivateLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/vendors" element={<VendorListPage />} />
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
