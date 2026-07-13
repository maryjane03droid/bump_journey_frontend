import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, getDashboardRoute } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      toast.success('Login successful!');
      setTimeout(() => {
        navigate(getDashboardRoute());
      }, 500);
    } catch (error) {
      const msg = error.response?.data?.detail || error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Welcome Back
          </h1>
          <p className="mt-2 text-[#718096]">Sign in to continue your journey</p>
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
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all pr-12"
                placeholder="Enter your password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2e7d32] text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#256d2b] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <FiLogIn size={18} />
                Login
              </>
            )}
          </button>

          <p className="text-center text-sm text-[#718096] mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#2e7d32] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}