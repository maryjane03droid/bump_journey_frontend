import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../services/api';

const STAFF_ROLES = [
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'PEDIATRICIAN', label: 'Pediatrician' },
  { value: 'NURSE', label: 'Nurse' },
  { value: 'MIDWIFE', label: 'Midwife' },
  { value: 'NUTRITIONIST', label: 'Nutritionist' },
  { value: 'LAB_TECHNICIAN', label: 'Lab Technician' },
  { value: 'THERAPIST', label: 'Therapist' },
];

export default function Signup() {
  const [userType, setUserType] = useState('PATIENT');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staffRole, setStaffRole] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    if (userType === 'STAFF') {
      if (!staffRole) {
        toast.error('Please select your staff role.');
        return;
      }
      if (!licenseNumber || licenseNumber.length !== 10 || !/^\d+$/.test(licenseNumber)) {
        toast.error('License number must be exactly 10 digits.');
        return;
      }
    }

    setLoading(true);

    try {
      if (userType === 'PATIENT') {
        // Register patient
        await api.post('/accounts/register/', { username, email, password });
        toast.success('Registration successful! Logging you in...');

        // Auto-login patient
        try {
          await login(username, password);
          navigate('/patient/dashboard');
        } catch (loginErr) {
          toast.info('Registered! Please login manually.');
          navigate('/login');
        }
      } else {
        // Register staff
        await api.post('/accounts/register/staff/', {
          username,
          email,
          password,
          role: staffRole,
          license_number: licenseNumber,
        });
        toast.success('Registration successful! Admin will approve within 24 hours.');
        navigate('/login');
      }
    } catch (error) {
      const data = error.response?.data;
      if (data) {
        const firstError = Object.values(data).flat()[0];
        toast.error(firstError || 'Registration failed.');
      } else {
        toast.error('Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      {/* Increased max-width to accommodate a 2-column layout */}
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Create Account
          </h1>
          <p className="mt-1 text-[#718096]">Join Bump Journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 md:p-8">
          
          {/* User Type Toggle - Spans full width */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#2d3748] mb-2">I am signing up as:</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUserType('PATIENT')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  userType === 'PATIENT'
                    ? 'bg-[#2e7d32] text-white'
                    : 'bg-[#f0f7f0] text-[#2d3748] hover:bg-[#e0efe0]'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setUserType('STAFF')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  userType === 'STAFF'
                    ? 'bg-[#2e7d32] text-white'
                    : 'bg-[#f0f7f0] text-[#2d3748] hover:bg-[#e0efe0]'
                }`}
              >
                Staff
              </button>
            </div>
          </div>

          {/* Staff notice - Spans full width */}
          {userType === 'STAFF' && (
            <div className="mb-5 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-xs text-yellow-800">
                Staff registration requires admin approval. You'll be able to login after approval (within 24 hours).
                Make sure you've submitted a career application first.
              </p>
            </div>
          )}

          {/* 2-Column Grid Container for Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all"
                placeholder="your@email.com"
              />
            </div>

            {/* Staff-specific fields */}
            {userType === 'STAFF' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Staff Role</label>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all"
                  >
                    <option value="">Select your role</option>
                    {STAFF_ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1.5">License Number</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    maxLength="10"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all font-mono"
                    placeholder="e.g. 1234567890"
                  />
                  <p className="text-[10px] text-[#718096] mt-1 text-right">{licenseNumber.length}/10 digits</p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all pr-12"
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#2d3748]"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all"
                placeholder="Repeat your password"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2e7d32] text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#256d2b] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <span>{userType === 'PATIENT' ? 'Creating account...' : 'Registering...'}</span>
            ) : (
              <>
                <FiUserPlus size={18} />
                {userType === 'PATIENT' ? 'Sign Up & Login' : 'Register as Staff'}
              </>
            )}
          </button>

          <p className="text-center text-sm text-[#718096] mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2e7d32] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}