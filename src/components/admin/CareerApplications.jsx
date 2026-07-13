import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiCheck, FiX, FiBriefcase, FiFilter } from 'react-icons/fi';
import api from '../../services/api';

export default function AdminCareers() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/accounts/admin/careers/');
      const data = res.data.data || res.data;
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    // Note: You'll need a backend endpoint to update application status
    // For now, this shows the UI pattern
    try {
      // await api.patch(`/accounts/admin/careers/${id}/`, { status: newStatus });
      toast.success(`Application ${newStatus.toLowerCase()} successfully!`);
      // Update local state
      setApplications(apps =>
        apps.map(a => a.id === id ? { ...a, status: newStatus } : a)
      );
    } catch (error) {
      toast.error('Failed to update application.');
    }
  };

  const filtered = filter === 'ALL'
    ? applications
    : applications.filter(a => a.status === filter);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#718096]">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Career Applications
        </h1>
        <p className="text-[#718096] text-sm mt-1">Review and manage staff job applications.</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filter === status
                ? 'bg-[#2e7d32] text-white'
                : 'bg-[#f0f7f0] text-[#2d3748] hover:bg-[#e0efe0]'
            }`}
          >
            {status} {status !== 'ALL' && `(${applications.filter(a => a.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Applications */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center">
          <FiBriefcase size={40} className="mx-auto text-[#e2e8f0] mb-3" />
          <p className="text-[#718096]">No applications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-[#e2e8f0] p-6 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[#2d3748]">{app.full_name}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    <div>
                      <p className="text-xs text-[#718096]">Role Applied</p>
                      <p className="text-sm font-medium text-[#2e7d32]">{app.role_applied?.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#718096]">Email</p>
                      <p className="text-sm text-[#2d3748]">{app.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#718096]">Phone</p>
                      <p className="text-sm text-[#2d3748]">{app.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#718096]">Qualification</p>
                      <p className="text-sm text-[#2d3748]">{app.qualification}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#718096]">Experience</p>
                      <p className="text-sm text-[#2d3748]">{app.years_of_experience} years</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#718096]">License Number</p>
                      <p className="text-sm text-[#2d3748] font-mono">{app.license_number}</p>
                    </div>
                  </div>

                  {app.message && (
                    <div className="mt-3 bg-[#f8faf8] rounded-lg p-3">
                      <p className="text-xs text-[#718096] mb-1">Message</p>
                      <p className="text-sm text-[#2d3748]">{app.message}</p>
                    </div>
                  )}

                  <p className="text-xs text-[#718096] mt-3">
                    Applied: {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                {app.status === 'PENDING' && (
                  <div className="flex flex-col gap-2 ml-4 shrink-0">
                    <button onClick={() => handleStatusChange(app.id, 'APPROVED')}
                      className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                      <FiCheck size={13} />
                      Approve
                    </button>
                    <button onClick={() => handleStatusChange(app.id, 'REJECTED')}
                      className="flex items-center gap-1 text-xs bg-red-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                      <FiX size={13} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}