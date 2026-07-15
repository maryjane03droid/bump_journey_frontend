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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      {}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-[#e2e8f0] overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
        
        {}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2d3748] tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Welcome Back
            </h1>
            <p className="mt-1.5 text-sm text-[#718096]">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#718096] mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/20 transition-all"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#718096] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/20 transition-all pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#2d3748] focus:outline-none"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2e7d32] text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#256d2b] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
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
            </div>

            <p className="text-center text-sm text-[#718096] mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#2e7d32] font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>

        {}
        <div className="hidden md:block relative bg-[#f4f7f4] overflow-hidden">
          {}
          <img 
            src="public/images/download.jpg" 
            alt="Bump Journey banner" 
            className="w-full h-full object-cover"
            onError={(e) => {
              
              e.target.style.display = 'none';
            }}
          />
          
          {}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12 text-white">
            <span className="text-xs uppercase tracking-widest text-[#e2e8f0] font-semibold mb-2">Welcome to</span>
            <h2 className="text-3xl font-bold mb-3 leading-tight tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Bump Journey
            </h2>
            <p className="text-white/90 text-sm max-w-sm leading-relaxed">
              Guiding you gracefully and elegantly through every beautiful step of your motherhood journey.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}