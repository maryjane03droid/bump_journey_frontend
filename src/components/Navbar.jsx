import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiLogIn, FiChevronDown } from 'react-icons/fi';

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

  // Updated patientLinks to reduce clutter
  const patientLinks = [
    { to: '/patient/dashboard', label: 'Dashboard' },
    { to: '#', label: 'Profile' }, // This now acts as the dropdown trigger
    { to: '/pregnancy-tips', label: 'Tips' },
    { to: '/shop', label: 'Shop' },
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

  // Helper to check if any profile sub-link is active
  const isProfileActive = () => {
    return isActive('/patient/profile') || 
           isActive('/patient/tracker') || 
           isActive('/patient/appointments') || 
           isActive('/patient/audit-trail');
  };

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
            {links.map((link) => {
              //  Dropdown for Careers
              if (link.label === 'Careers') {
                return (
                  <div key="careers-dropdown" className="relative group py-5">
                    <button className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 ${(isActive('/careers') || isActive('/application-status')) ? 'text-white' : 'text-white/75 hover:text-white'}`}>
                      Careers
                      <FiChevronDown className="transition-transform duration-200 group-hover:rotate-180" size={16} />
                    </button>
                    
                    <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-lg overflow-hidden flex flex-col">
                        <Link 
                          to="/careers" 
                          className="px-4 py-3 text-sm font-medium text-[#2d3748] hover:bg-[#f0f7f0] hover:text-[#2e7d32] transition-colors border-b border-[#e2e8f0]"
                        >
                          View Open Positions
                        </Link>
                        <Link 
                          to="/application-status" 
                          className="px-4 py-3 text-sm font-medium text-[#718096] hover:bg-[#f0f7f0] hover:text-[#2e7d32] transition-colors"
                        >
                          Check Application Status
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              //  Dropdown Profile
              if (link.label === 'Profile') {
                return (
                  <div key="profile-dropdown" className="relative group py-5">
                    <button className={`flex items-center gap-1 text-sm font-semibold transition-colors duration-200 ${isProfileActive() ? 'text-white' : 'text-white/75 hover:text-white'}`}>
                      Profile
                      <FiChevronDown className="transition-transform duration-200 group-hover:rotate-180" size={16} />
                    </button>
                    
                    <div className="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-lg overflow-hidden flex flex-col">
                        <Link 
                          to="/patient/profile" 
                          className="px-4 py-3 text-sm font-medium text-[#2d3748] hover:bg-[#f0f7f0] hover:text-[#2e7d32] transition-colors border-b border-[#e2e8f0]"
                        >
                          My Profile
                        </Link>
                        <Link 
                          to="/patient/tracker" 
                          className="px-4 py-3 text-sm font-medium text-[#2d3748] hover:bg-[#f0f7f0] hover:text-[#2e7d32] transition-colors border-b border-[#e2e8f0]"
                        >
                          Vitals
                        </Link>
                        <Link 
                          to="/patient/appointments" 
                          className="px-4 py-3 text-sm font-medium text-[#2d3748] hover:bg-[#f0f7f0] hover:text-[#2e7d32] transition-colors border-b border-[#e2e8f0]"
                        >
                          Appointments
                        </Link>
                        <Link 
                          to="/patient/audit-trail" 
                          className="px-4 py-3 text-sm font-medium text-[#2d3748] hover:bg-[#f0f7f0] hover:text-[#2e7d32] transition-colors"
                        >
                          Audit Trail
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              
              return (
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
              );
            })}

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
                  {user?.username}
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
          {links.map((link) => {
            
            if (link.label === 'Careers') {
              return (
                <div key="careers-mobile" className="py-2.5">
                  <div className="text-white/75 font-semibold text-sm mb-2">Careers</div>
                  <div className="flex flex-col gap-2 pl-4 border-l border-white/20 ml-2">
                    <Link
                      to="/careers"
                      onClick={() => setMobileOpen(false)}
                      className={`block text-sm font-semibold ${isActive('/careers') ? 'text-white' : 'text-white/60 hover:text-white'}`}
                    >
                      View Open Positions
                    </Link>
                    <Link
                      to="/application-status"
                      onClick={() => setMobileOpen(false)}
                      className={`block text-sm font-semibold ${isActive('/application-status') ? 'text-white' : 'text-white/60 hover:text-white'}`}
                    >
                      Check Application Status
                    </Link>
                  </div>
                </div>
              );
            }

            
            if (link.label === 'Profile') {
              return (
                <div key="profile-mobile" className="py-2.5">
                  <div className="text-white/75 font-semibold text-sm mb-2">Profile Menu</div>
                  <div className="flex flex-col gap-2 pl-4 border-l border-white/20 ml-2">
                    <Link
                      to="/patient/profile"
                      onClick={() => setMobileOpen(false)}
                      className={`block text-sm font-semibold ${isActive('/patient/profile') ? 'text-white' : 'text-white/60 hover:text-white'}`}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/patient/tracker"
                      onClick={() => setMobileOpen(false)}
                      className={`block text-sm font-semibold ${isActive('/patient/tracker') ? 'text-white' : 'text-white/60 hover:text-white'}`}
                    >
                      Vitals
                    </Link>
                    <Link
                      to="/patient/appointments"
                      onClick={() => setMobileOpen(false)}
                      className={`block text-sm font-semibold ${isActive('/patient/appointments') ? 'text-white' : 'text-white/60 hover:text-white'}`}
                    >
                      Appointments
                    </Link>
                    <Link
                      to="/patient/audit-trail"
                      onClick={() => setMobileOpen(false)}
                      className={`block text-sm font-semibold ${isActive('/patient/audit-trail') ? 'text-white' : 'text-white/60 hover:text-white'}`}
                    >
                      Audit Trail
                    </Link>
                  </div>
                </div>
              );
            }

          
            return (
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
            );
          })}

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
                Logged in as <strong>{user?.username}</strong>
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