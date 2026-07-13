import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';

export default function Navbar() {
  const { user, isAuthenticated, isPatient, isAnyStaff, isAdmin, logout, getDashboardRoute } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/careers', label: 'Careers' },
    { to: '/pregnancy-tips', label: 'Tips' },
    { to: '/shop', label: 'Shop' },
  ];

  const patientLinks = [
    { to: '/patient/dashboard', label: 'Dashboard' },
    { to: '/patient/profile', label: 'Profile' },
    { to: '/patient/tracker', label: 'Vitals' },
    { to: '/patient/appointments', label: 'Appointments' },
    { to: '/patient/audit-trail', label: 'Audit Trail' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const staffLinks = [
    { to: '/staff/dashboard', label: 'Dashboard' },
    { to: '/staff/appointments', label: 'Appointments' },
    { to: '/staff/referrals', label: 'Referrals' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/careers', label: 'Applications' },
    { to: '/admin/messages', label: 'Messages' },
  ];

  const getLinks = () => {
    if (!isAuthenticated) return publicLinks;
    if (isAdmin) return adminLinks;
    if (isAnyStaff) return staffLinks;
    return patientLinks;
  };

  const links = getLinks();

  return (
    <nav className="bg-[#2e7d32] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link to={isAuthenticated ? getDashboardRoute() : '/'} className="flex items-center gap-2">
            <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Bump Journey
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive(link.to)
                    ? 'text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {!isAuthenticated ? (
              <div className="flex items-center gap-3 ml-4">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-semibold transition-colors"
                >
                  <FiLogIn size={16} />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-[#2e7d32] px-5 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <span className="flex items-center gap-2 bg-white/15 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                  <FiUser size={14} />
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-red-200 border border-red-200/40 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-red-200/10 transition-all duration-200"
                >
                  <FiLogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#256d2b] border-t border-white/10 px-4 pb-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block py-2.5 text-sm font-semibold ${
                isActive(link.to) ? 'text-white' : 'text-white/75 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {!isAuthenticated ? (
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/10">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="text-white/90 text-sm font-semibold py-2">
                Login
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="bg-white text-[#2e7d32] px-5 py-2 rounded-full text-sm font-bold text-center">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="mt-3 pt-3 border-t border-white/10">
              <span className="block text-white/80 text-sm mb-2">
                Logged in as <strong>{user.username}</strong>
              </span>
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="text-red-200 text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}