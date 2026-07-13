import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiFileText, FiClock, FiUser } from 'react-icons/fi';
import api from '../../services/api';

export default function AuditTrail() {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrails();
  }, []);

  const fetchTrails = async () => {
    try {
      const res = await api.get('/staff/audit-trail/');
      const data = res.data.data || res.data;
      setTrails(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load audit trail.');
    } finally {
      setLoading(false);
    }
  };

  const getActionStyle = (action) => {
    if (action.includes('APPOINTMENT')) return 'bg-blue-100 text-blue-700';
    if (action.includes('VITALS')) return 'bg-green-100 text-green-700';
    if (action.includes('REFERRED')) return 'bg-purple-100 text-purple-700';
    if (action.includes('LOCKED')) return 'bg-orange-100 text-orange-700';
    if (action.includes('PROFILE')) return 'bg-teal-100 text-teal-700';
    if (action.includes('NOTE')) return 'bg-indigo-100 text-indigo-700';
    return 'bg-gray-100 text-gray-600';
  };

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#718096]">Loading audit trail...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Audit Trail
        </h1>
        <p className="text-[#718096] text-sm mt-1">A complete history of actions on your care.</p>
      </div>

      {trails.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center">
          <FiFileText size={40} className="mx-auto text-[#e2e8f0] mb-3" />
          <p className="text-[#718096]">No audit records yet. Actions will appear here as your care progresses.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-[#e2e8f0]"></div>

          <div className="space-y-4">
            {trails.map((trail) => (
              <div key={trail.id} className="relative pl-14">
                {/* Timeline dot */}
                <div className="absolute left-[18px] top-5 w-3 h-3 rounded-full bg-[#2e7d32] border-2 border-white shadow-sm"></div>

                <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getActionStyle(trail.action)}`}>
                      {formatAction(trail.action)}
                    </span>
                    <span className="text-xs text-[#718096] flex items-center gap-1">
                      <FiUser size={11} />
                      {trail.username}
                    </span>
                    {trail.user_role && (
                      <span className="text-xs text-[#718096]">({trail.user_role})</span>
                    )}
                  </div>

                  {trail.description && (
                    <p className="text-sm text-[#2d3748] mb-2">{trail.description}</p>
                  )}

                  <p className="text-xs text-[#718096] flex items-center gap-1">
                    <FiClock size={11} />
                    {new Date(trail.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}