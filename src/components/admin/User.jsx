import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiCheck, FiX, FiFilter } from 'react-icons/fi';
import api from '../../services/api';

const ROLE_FILTERS = ['ALL', 'PATIENT', 'DOCTOR', 'PEDIATRICIAN', 'NURSE', 'MIDWIFE', 'NUTRITIONIST', 'LAB_TECHNICIAN', 'THERAPIST'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/accounts/admin/users/');
      const data = res.data.data || res.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, approve) => {
    try {
      await api.patch(`/accounts/admin/users/${userId}/approve/`, { is_approved: approve });
      toast.success(approve ? 'Staff approved successfully!' : 'Staff rejected.');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user.');
    }
  };

  const filteredUsers = filter === 'ALL'
    ? users.filter(u => u.role !== 'ADMIN')
    : users.filter(u => u.role === filter);

  const staffUsers = filteredUsers.filter(u => u.role !== 'PATIENT');
  const patientUsers = filteredUsers.filter(u => u.role === 'PATIENT');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#718096]">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          User Management
        </h1>
        <p className="text-[#718096] text-sm mt-1">Manage all users, approve or reject staff registrations.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ROLE_FILTERS.map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filter === role
                ? 'bg-[#2e7d32] text-white'
                : 'bg-[#f0f7f0] text-[#2d3748] hover:bg-[#e0efe0]'
            }`}
          >
            {role.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Staff Section */}
      {(filter === 'ALL' || filter !== 'PATIENT') && staffUsers.length > 0 && (
        <div className="mb-10">
          <h2 className="font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2e7d32]"></span>
            Staff ({staffUsers.length})
          </h2>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f8faf8]">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Username</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">License</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffUsers.map((u) => (
                    <tr key={u.id} className="border-t border-[#f0f0f0] hover:bg-[#fcfdfc]">
                      <td className="px-5 py-4 font-medium text-[#2d3748]">{u.username}</td>
                      <td className="px-5 py-4 text-[#718096]">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-[#f0f7f0] text-[#2e7d32] px-2 py-1 rounded-full font-medium">
                          {u.role.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#718096] font-mono text-xs">{u.license_number || '-'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          u.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {u.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {!u.is_approved ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(u.id, true)}
                              className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-700 transition-colors">
                              <FiCheck size={12} />
                              Approve
                            </button>
                            <button onClick={() => handleApprove(u.id, false)}
                              className="flex items-center gap-1 text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 transition-colors">
                              <FiX size={12} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => handleApprove(u.id, false)}
                            className="text-xs text-red-500 hover:underline font-medium">
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Patients Section */}
      {(filter === 'ALL' || filter === 'PATIENT') && patientUsers.length > 0 && (
        <div>
          <h2 className="font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Patients ({patientUsers.length})
          </h2>
          <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f8faf8]">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Username</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {patientUsers.map((u) => (
                    <tr key={u.id} className="border-t border-[#f0f0f0] hover:bg-[#fcfdfc]">
                      <td className="px-5 py-4 font-medium text-[#2d3748]">{u.username}</td>
                      <td className="px-5 py-4 text-[#718096]">{u.email}</td>
                      <td className="px-5 py-4 text-[#718096]">{new Date(u.date_joined).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center">
          <p className="text-[#718096]">No users found for this filter.</p>
        </div>
      )}
    </div>
  );
}
