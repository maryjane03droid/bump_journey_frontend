import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiCalendar, FiUsers, FiActivity, FiFileText, FiAlertCircle } from 'react-icons/fi';
import api from '../../services/api';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptRes, patientRes] = await Promise.all([
        api.get('/staff/appointments/').catch(() => ({ data: { data: [] } })),
        api.get('/staff/patients/').catch(() => ({ data: { data: [] } })),
      ]);

      const apptData = apptRes.data.data || apptRes.data;
      setAppointments(Array.isArray(apptData) ? apptData : []);

      const patientData = patientRes.data.data || patientRes.data;
      setPatients(Array.isArray(patientData) ? patientData : []);
    } catch (error) {
      console.error('Failed to fetch staff dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const requested = appointments.filter(a => a.status === 'REQUESTED');
  const scheduled = appointments.filter(a => a.status === 'SCHEDULED');
  const referred = appointments.filter(a => a.status?.startsWith('NEEDS_') || a.status === 'REFERRED');
  const urgent = appointments.filter(a => a.status === 'REQUESTED');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#718096]">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Staff Dashboard
        </h1>
        <p className="text-[#718096] mt-1">Welcome, {user.username} ({user.role})</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <FiAlertCircle size={18} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2d3748]">{requested.length}</p>
              <p className="text-xs text-[#718096]">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <FiCalendar size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2d3748]">{scheduled.length}</p>
              <p className="text-xs text-[#718096]">Scheduled</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <FiActivity size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2d3748]">{referred.length}</p>
              <p className="text-xs text-[#718096]">Referrals</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FiUsers size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2d3748]">{patients.length}</p>
              <p className="text-xs text-[#718096]">Patients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link to="/staff/appointments"
          className="bg-[#2e7d32] text-white rounded-xl p-5 hover:bg-[#256d2b] transition-colors">
          <FiCalendar size={20} className="mb-2" />
          <p className="font-semibold text-sm">View Appointments</p>
          <p className="text-xs text-white/70 mt-1">Manage all patient appointments</p>
        </Link>

        <Link to="/staff/referrals"
          className="bg-white border border-[#e2e8f0] rounded-xl p-5 hover:border-[#8FBC8F] hover:shadow-sm transition-all">
          <FiActivity size={20} className="text-[#2e7d32] mb-2" />
          <p className="font-semibold text-sm text-[#2d3748]">Referrals</p>
          <p className="text-xs text-[#718096] mt-1">Send or receive patient referrals</p>
        </Link>

        <Link to="/staff/appointments"
          className="bg-white border border-[#e2e8f0] rounded-xl p-5 hover:border-[#8FBC8F] hover:shadow-sm transition-all">
          <FiFileText size={20} className="text-[#2e7d32] mb-2" />
          <p className="font-semibold text-sm text-[#2d3748]">Patient Vitals</p>
          <p className="text-xs text-[#718096] mt-1">View patient health logs</p>
        </Link>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-[#2d3748]">Recent Appointments</h2>
          <Link to="/staff/appointments" className="text-[#2e7d32] text-sm font-semibold hover:underline">
            View All
          </Link>
        </div>

        {appointments.length === 0 ? (
          <p className="text-sm text-[#718096] py-4">No appointments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  <th className="text-left py-3 text-xs font-semibold text-[#718096] uppercase">Patient</th>
                  <th className="text-left py-3 text-xs font-semibold text-[#718096] uppercase">Reason</th>
                  <th className="text-left py-3 text-xs font-semibold text-[#718096] uppercase">Date</th>
                  <th className="text-left py-3 text-xs font-semibold text-[#718096] uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 8).map((appt) => (
                  <tr key={appt.id} className="border-b border-[#f7f7f7]">
                    <td className="py-3 font-medium text-[#2d3748]">{appt.patient_username}</td>
                    <td className="py-3 text-[#718096] truncate max-w-[150px]">{appt.reason || '-'}</td>
                    <td className="py-3 text-[#718096]">{appt.date || 'TBD'}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        appt.status === 'SCHEDULED' ? 'bg-green-100 text-green-700' :
                        appt.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-700' :
                        appt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                        appt.status === 'LOCKED' ? 'bg-gray-100 text-gray-700' :
                        appt.status?.startsWith('NEEDS_') ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {appt.status?.replace(/_/g, ' ')}
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