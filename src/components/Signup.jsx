import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../services/api';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    setLoading(true);

    try {
      await api.post('/accounts/register/', { username, email, password });
      toast.success('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 1500);
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Create Account
          </h1>
          <p className="mt-2 text-[#718096]">Start tracking your pregnancy journey</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8">
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all"
              placeholder="Choose a username"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all pr-12"
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

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all"
              placeholder="Repeat your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2e7d32] text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#256d2b] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <FiUserPlus size={18} />
                Sign Up
              </>
            )}
          </button>

          <p className="text-center text-sm text-[#718096] mt-6">
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