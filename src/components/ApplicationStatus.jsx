import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSearch, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';

export default function ApplicationStatus() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(false);
    setResult(null);

    try {
      // Assuming your backend supports this filtered get
      const res = await api.get(`/accounts/careers/status/?email=${email}`);
      setResult(res.data); // Assuming backend returns the object directly
      setSearched(true);
    } catch (error) {
      if (error.response?.status === 404) {
        setSearched(true); // Will trigger the "No application found" UI
      } else {
        toast.error('Unable to connect to server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusUI = (status) => {
    const statusMap = {
      APPROVED: {
        icon: <FiCheckCircle size={48} className="text-green-500" />,
        color: 'bg-green-50 border-green-200',
        title: 'Application Approved!',
        message: 'Congratulations! You can now register as staff.',
      },
      PENDING: {
        icon: <FiClock size={48} className="text-yellow-500" />,
        color: 'bg-yellow-50 border-yellow-200',
        title: 'Application Pending',
        message: 'Your application is being reviewed. Please wait up to 24 hours.',
      },
      REJECTED: {
        icon: <FiXCircle size={48} className="text-red-500" />,
        color: 'bg-red-50 border-red-200',
        title: 'Application Not Approved',
        message: 'Unfortunately your application was not approved. You may reapply or contact us.',
      }
    };
    return statusMap[status] || {
      icon: <FiAlertCircle size={48} className="text-gray-400" />,
      color: 'bg-gray-50 border-gray-200',
      title: 'Status Unknown',
      message: 'Contact support for more information regarding your application.'
    };
  };

  const ui = result ? getStatusUI(result.status) : null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Check Application Status
          </h1>
          <p className="mt-2 text-[#718096]">Enter the email you used to apply.</p>
        </div>

        <form onSubmit={handleCheck} className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8">
          <div className="mb-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-[#2d3748] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30"
              placeholder="example@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2e7d32] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#256d2b] disabled:opacity-60 transition-colors"
          >
            {loading ? 'Searching...' : 'Check Status'}
          </button>
        </form>

        {searched && (
          <div className={`mt-6 rounded-2xl border p-8 text-center ${result ? ui.color : 'border-[#e2e8f0] bg-white'}`}>
            {result ? (
              <>
                <div className="flex justify-center mb-4">{ui.icon}</div>
                <h2 className="text-xl font-bold text-[#2d3748] mb-2">{ui.title}</h2>
                <p className="text-sm text-[#718096] mb-6">{ui.message}</p>
                <div className="text-left bg-white/60 rounded-xl p-4 mb-4">
                  <p className="text-xs text-[#718096]">Role: <span className="font-medium text-[#2d3748]">{result.role_applied?.replace(/_/g, ' ')}</span></p>
                  <p className="text-xs text-[#718096] mt-1">Applied: <span className="font-medium text-[#2d3748]">{new Date(result.created_at).toLocaleDateString()}</span></p>
                </div>
                {result.status === 'APPROVED' && (
                  <Link to="/signup" className="block w-full bg-[#2e7d32] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#256d2b]">
                    Register as Staff
                  </Link>
                )}
              </>
            ) : (
              <p className="text-[#718096]">No application found for this email.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}