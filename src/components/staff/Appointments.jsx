import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiCalendar, FiLock, FiSend, FiCheck, FiX } from 'react-icons/fi';
import api from '../../services/api';

export default function StaffAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ patient: '', date: '', time: '', reason: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptRes, patientRes] = await Promise.all([
        api.get('/staff/appointments/'),
        api.get('/staff/patients/'),
      ]);
      const apptData = apptRes.data.data || apptRes.data;
      setAppointments(Array.isArray(apptData) ? apptData : []);

      const patientData = patientRes.data.data || patientRes.data;
      setPatients(Array.isArray(patientData) ? patientData : []);
    } catch (error) {
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLock = async (id) => {
    try {
      const res = await api.post(`/staff/appointments/${id}/lock/`);
      toast.success(res.data.message || 'Case locked successfully.');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to lock case.');
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/staff/appointments/', scheduleForm);
      toast.success('Appointment scheduled successfully!');
      setShowScheduleModal(false);
      setScheduleForm({ patient: '', date: '', time: '', reason: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule appointment.');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.patch(`/staff/appointments/${id}/`, { status: 'COMPLETED' });
      toast.success('Appointment marked as completed.');
      fetchData();
    } catch (error) {
      toast.error('Failed to update appointment.');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'REQUESTED': return 'bg-yellow-100 text-yellow-700';
      case 'SCHEDULED': return 'bg-green-100 text-green-700';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700';
      case 'LOCKED': return 'bg-gray-100 text-gray-700';
      case 'REFERRED': return 'bg-purple-100 text-purple-700';
      default:
        if (status?.startsWith('NEEDS_')) return 'bg-orange-100 text-orange-700';
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#718096]">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Appointments
          </h1>
          <p className="text-[#718096] text-sm mt-1">Manage patient appointments, lock cases, and schedule visits.</p>
        </div>
        <button onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2 bg-[#2e7d32] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#256d2b] transition-colors">
          <FiCalendar size={16} />
          Schedule New
        </button>
      </div>

      {/* Appointments Table */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center">
          <FiCalendar size={40} className="mx-auto text-[#e2e8f0] mb-3" />
          <p className="text-[#718096]">No appointments to display.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8faf8]">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Patient</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Reason</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#718096] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} className="border-t border-[#f0f0f0] hover:bg-[#fcfdfc]">
                    <td className="px-5 py-4 font-medium text-[#2d3748]">{appt.patient_username}</td>
                    <td className="px-5 py-4 text-[#718096] max-w-[180px] truncate">{appt.reason || '-'}</td>
                    <td className="px-5 py-4 text-[#718096]">{appt.date || 'TBD'}</td>
                    <td className="px-5 py-4 text-[#718096]">{appt.time || 'TBD'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusStyle(appt.status)}`}>
                        {appt.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {appt.status === 'REQUESTED' && (
                          <button onClick={() => handleLock(appt.id)}
                            className="flex items-center gap-1 text-xs bg-[#2e7d32] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#256d2b] transition-colors"
                            title="Lock this case">
                            <FiLock size={12} />
                            Lock
                          </button>
                        )}
                        {(appt.status === 'SCHEDULED' || appt.status === 'LOCKED') && (
                          <button onClick={() => handleComplete(appt.id)}
                            className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            title="Mark as completed">
                            <FiCheck size={12} />
                            Complete
                          </button>
                        )}
                        {!['COMPLETED', 'REVIEWED'].includes(appt.status) && (
                          <a href="/staff/referrals"
                            className="flex items-center gap-1 text-xs border border-purple-300 text-purple-600 px-3 py-1.5 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                            title="Refer to another staff">
                            <FiSend size={12} />
                            Refer
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 relative">
            <button onClick={() => setShowScheduleModal(false)} className="absolute top-4 right-4 text-[#718096] hover:text-[#2d3748]">
              <FiX size={22} />
            </button>

            <h2 className="text-xl font-bold text-[#2d3748] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Schedule Appointment
            </h2>

            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2d3748] mb-1">Patient *</label>
                <select value={scheduleForm.patient} onChange={(e) => setScheduleForm({ ...scheduleForm, patient: e.target.value })} required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30">
                  <option value="">Select patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.username} ({String(p.id).slice(0, 8)})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1">Date *</label>
                  <input type="date" value={scheduleForm.date} onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })} required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1">Time *</label>
                  <input type="time" value={scheduleForm.time} onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })} required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2d3748] mb-1">Reason</label>
                <input type="text" value={scheduleForm.reason} onChange={(e) => setScheduleForm({ ...scheduleForm, reason: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30"
                  placeholder="Reason for appointment" />
              </div>

              <button type="submit" disabled={saving}
                className="w-full bg-[#2e7d32] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#256d2b] disabled:opacity-60 transition-colors">
                {saving ? 'Scheduling...' : 'Schedule Appointment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
