import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiBriefcase, FiMail, FiCheckCircle, FiClock } from 'react-icons/fi';
import api from '../../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, appsRes, msgsRes] = await Promise.all([
        api.get('/accounts/admin/users/').catch(() => ({ data: { data: [] } })),
        api.get('/accounts/admin/careers/').catch(() => ({ data: { data: [] } })),
        api.get('/accounts/admin/messages/').catch(() => ({ data: { data: [] } })),
      ]);

      const usersData = usersRes.data.data || usersRes.data;
      setUsers(Array.isArray(usersData) ? usersData : []);

      const appsData = appsRes.data.data || appsRes.data;
      setApplications(Array.isArray(appsData) ? appsData : []);

      const msgsData = msgsRes.data.data || msgsRes.data;
      setMessages(Array.isArray(msgsData) ? msgsData : []);
    } catch (error) {
      console.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const totalStaff = users.filter(u => u.role !== 'PATIENT' && u.role !== 'ADMIN').length;
  const totalPatients = users.filter(u => u.role === 'PATIENT').length;
  const pendingApprovals = users.filter(u => u.role !== 'PATIENT' && u.role !== 'ADMIN' && !u.is_approved).length;
  const pendingApplications = applications.filter(a => a.status === 'PENDING').length;
  const unreadMessages = messages.filter(m => !m.is_read).length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#718096]">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Admin Dashboard
        </h1>
        <p className="text-[#718096] mt-1">Welcome, {user.username}. Here's your system overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FiUsers size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2d3748]">{totalPatients}</p>
              <p className="text-xs text-[#718096]">Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <FiCheckCircle size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2d3748]">{totalStaff}</p>
              <p className="text-xs text-[#718096]">Staff</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <FiClock size={18} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2d3748]">{pendingApprovals}</p>
              <p className="text-xs text-[#718096]">Pending Approvals</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <FiBriefcase size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2d3748]">{pendingApplications}</p>
              <p className="text-xs text-[#718096]">Applications</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <FiMail size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2d3748]">{unreadMessages}</p>
              <p className="text-xs text-[#718096]">Messages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link to="/admin/users"
          className="bg-[#2e7d32] text-white rounded-xl p-5 hover:bg-[#256d2b] transition-colors">
          <FiUsers size={20} className="mb-2" />
          <p className="font-semibold text-sm">Manage Users</p>
          <p className="text-xs text-white/70 mt-1">View, approve, or reject staff registrations</p>
        </Link>

        <Link to="/admin/careers"
          className="bg-white border border-[#e2e8f0] rounded-xl p-5 hover:border-[#8FBC8F] hover:shadow-sm transition-all">
          <FiBriefcase size={20} className="text-[#2e7d32] mb-2" />
          <p className="font-semibold text-sm text-[#2d3748]">Career Applications</p>
          <p className="text-xs text-[#718096] mt-1">Review and manage job applications</p>
        </Link>

        <Link to="/admin/messages"
          className="bg-white border border-[#e2e8f0] rounded-xl p-5 hover:border-[#8FBC8F] hover:shadow-sm transition-all">
          <FiMail size={20} className="text-[#2e7d32] mb-2" />
          <p className="font-semibold text-sm text-[#2d3748]">Contact Messages</p>
          <p className="text-xs text-[#718096] mt-1">View and respond to user messages</p>
        </Link>
      </div>

      {/* Recent Staff Registrations */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-[#2d3748]">Recent Staff Registrations</h2>
          <Link to="/admin/users" className="text-[#2e7d32] text-sm font-semibold hover:underline">View All</Link>
        </div>

        {users.filter(u => u.role !== 'PATIENT' && u.role !== 'ADMIN').length === 0 ? (
          <p className="text-sm text-[#718096] py-4">No staff registrations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="text-left py-3 text-xs font-semibold text-[#718096] uppercase">Username</th>
                  <th className="text-left py-3 text-xs font-semibold text-[#718096] uppercase">Role</th>
                  <th className="text-left py-3 text-xs font-semibold text-[#718096] uppercase">Email</th>
                  <th className="text-left py-3 text-xs font-semibold text-[#718096] uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(u => u.role !== 'PATIENT' && u.role !== 'ADMIN')
                  .slice(0, 6)
                  .map((u) => (
                    <tr key={u.id} className="border-b border-[#f7f7f7]">
                      <td className="py-3 font-medium text-[#2d3748]">{u.username}</td>
                      <td className="py-3 text-[#718096]">{u.role}</td>
                      <td className="py-3 text-[#718096]">{u.email}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          u.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {u.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}