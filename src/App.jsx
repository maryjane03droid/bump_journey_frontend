import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Welcome from './components/Welcome';
import About from './components/About';
import Contact from './components/Contact';
import Careers from './components/Careers';
import Login from './components/Login';
import Signup from './components/Signup';
import PregnancyTips from './components/PregnancyTips';
import Shop from './components/Shop';

import PatientDashboard from './components/patient/Dashboard';
import Profile from './components/patient/Profile';
import Tracker from './components/patient/Tracker';
import PatientAppointments from './components/patient/Appointments';
import AuditTrail from './components/patient/AuditTrail';
import Cart from './components/patient/Cart';

import StaffDashboard from './components/staff/Dashboard';
import StaffAppointments from './components/staff/Appointments';
import Referrals from './components/staff/Referrals';

import AdminDashboard from './components/admin/Dashboard';
import AdminUsers from './components/admin/Users';
import AdminCareers from './components/admin/CareerApplications';
import AdminMessages from './components/admin/Messages';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PatientRoute({ children }) {
  const { isAuthenticated, isPatient } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isPatient) return <Navigate to="/" />;
  return children;
}

function StaffRoute({ children }) {
  const { isAuthenticated, isAnyStaff } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAnyStaff) return <Navigate to="/" />;
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
}

function PublicOnly({ children }) {
  const { isAuthenticated, getDashboardRoute } = useAuth();
  return !isAuthenticated ? children : <Navigate to={getDashboardRoute()} />;
}

function AppRoutes() {
  const { isAuthenticated, getDashboardRoute } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to={getDashboardRoute()} /> : <Welcome />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/pregnancy-tips" element={<PregnancyTips />} />
          <Route path="/shop" element={<Shop />} />

          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />

          <Route path="/patient/dashboard" element={<PatientRoute><PatientDashboard /></PatientRoute>} />
          <Route path="/patient/profile" element={<PatientRoute><Profile /></PatientRoute>} />
          <Route path="/patient/tracker" element={<PatientRoute><Tracker /></PatientRoute>} />
          <Route path="/patient/appointments" element={<PatientRoute><PatientAppointments /></PatientRoute>} />
          <Route path="/patient/audit-trail" element={<PatientRoute><AuditTrail /></PatientRoute>} />
          <Route path="/patient/cart" element={<PatientRoute><Cart /></PatientRoute>} />

          <Route path="/staff/dashboard" element={<StaffRoute><StaffDashboard /></StaffRoute>} />
          <Route path="/staff/appointments" element={<StaffRoute><StaffAppointments /></StaffRoute>} />
          <Route path="/staff/referrals" element={<StaffRoute><Referrals /></StaffRoute>} />

          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/careers" element={<AdminRoute><AdminCareers /></AdminRoute>} />
          <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />

          <Route path="*" element={<Navigate to={isAuthenticated ? getDashboardRoute() : "/"} />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;