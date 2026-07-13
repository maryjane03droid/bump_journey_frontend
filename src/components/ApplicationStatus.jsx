import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSearch, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import api from '../services/api';

export default function ApplicationStatus() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
     const res = await api.get(`/accounts/careers/status/?email=${email}`);

      const data = res.data.data || res.data;
      const applications = Array.isArray(data) ? data : [];

      // Find the most recent application for this email
      const match = applications.find(
        (app) => app.email.toLowerCase() === email.toLowerCase()
      );

      if (match) {
        setResult(match);
      } else {
        setResult(null);
      }
      setSearched(true);
    } catch (error) {
      // If admin-only endpoint, we need a public one. Fallback message:
      toast.error('Unable to check status. Please contact admin.');
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusUI = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: <FiCheckCircle size={48} className="text-green-500" />,
          color: 'bg-green-50 border-green-200',
          title: 'Application Approved!',
          message: 'Congratulations! You can now register as staff.',
        };
      case 'PENDING':
        return {
          icon: <FiClock size={48} className="text-yellow-500" />,
          color: 'bg-yellow-50 border-yellow-200',
          title: 'Application Pending',
          message: 'Your application is being reviewed. Please wait up to 24 hours.',
        };
      case 'REJECTED':
        return {
          icon: <FiXCircle size={48} className="text-red-500" />,
          color: 'bg-red-50 border-red-200',
          title: 'Application Not Approved',
          message: 'Unfortunately your application was not approved. You may reapply or contact us.',
        };
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Check Application Status
          </h1>
          <p className="mt-2 text-[#718096]">Enter the email you used to apply and check your status.</p>
        </div>

        <form onSubmit={handleCheck} className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8">
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Application Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all"
              placeholder="The email you applied with"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2e7d32] text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#256d2b] disabled:opacity-60 transition-colors"
          >
            {loading ? 'Checking...' : <><FiSearch size={16} /> Check Status</>}
          </button>
        </form>

        {/* Result */}
        {searched && result && (
          <div className={`mt-6 rounded-2xl border p-8 text-center ${getStatusUI(result.status).color}`}>
            <div className="flex justify-center mb-4">
              {getStatusUI(result.status).icon}
            </div>
            <h2 className="text-xl font-bold text-[#2d3748] mb-2">
              {getStatusUI(result.status).title}
            </h2>
            <p className="text-sm text-[#718096] mb-4">
              {getStatusUI(result.status).message}
            </p>

            <div className="text-left bg-white/60 rounded-xl p-4 mb-4">
              <p className="text-xs text-[#718096]">Role Applied: <span className="font-medium text-[#2d3748]">{result.role_applied?.replace(/_/g, ' ')}</span></p>
              <p className="text-xs text-[#718096] mt-1">Applied: <span className="font-medium text-[#2d3748]">{new Date(result.created_at).toLocaleDateString()}</span></p>
            </div>

            {result.status === 'APPROVED' && (
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-[#2e7d32] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#256d2b] transition-colors"
              >
                Register as Staff →
              </Link>
            )}
          </div>
        )}

        {searched && !result && (
          <div className="mt-6 rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center">
            <p className="text-[#718096] mb-3">No application found for this email.</p>
            <Link to="/careers" className="text-[#2e7d32] font-semibold text-sm hover:underline">
              Apply for a position →
            </Link>
          </div>
        )}

        <p className="text-center text-sm text-[#718096] mt-6">
          <Link to="/careers" className="text-[#2e7d32] font-semibold hover:underline">
            Back to Careers
          </Link>
        </p>
      </div>
    </div>
  );
}
