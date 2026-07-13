import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiCalendar, FiClock, FiUser, FiX } from 'react-icons/fi';
import api from '../../services/api';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/staff/appointments/');
      const data = res.data.data || res.data;
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please enter a reason for your appointment.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/staff/appointments/', { reason });
      toast.success('Appointment requested successfully! Awaiting staff confirmation.');
      setReason('');
      setShowForm(false);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to request appointment.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'REQUESTED': return 'bg-yellow-100 text-yellow-700';
      case 'SCHEDULED': return 'bg-green-100 text-green-700';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700';
      case 'REFERRED': return 'bg-purple-100 text-purple-700';
      case 'LOCKED': return 'bg-gray-100 text-gray-700';
      default:
        if (status?.startsWith('NEEDS_')) return 'bg-orange-100 text-orange-700';
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatStatus = (status) => {
    return status?.replace(/_/g, ' ').replace('NEEDS ', 'Needs ') || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#718096]">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            My Appointments
          </h1>
          <p className="text-[#718096] text-sm mt-1">Request and track your appointments.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#2e7d32] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#256d2b] transition-colors">
          <FiPlus size={16} />
          Request Appointment
        </button>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center">
          <FiCalendar size={40} className="mx-auto text-[#e2e8f0] mb-3" />
          <p className="text-[#718096] mb-3">No appointments yet.</p>
          <button onClick={() => setShowForm(true)} className="text-[#2e7d32] font-semibold text-sm hover:underline">
            Request your first appointment →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div key={appt.id} className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-[#2d3748] text-sm">{appt.reason || 'Appointment'}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusStyle(appt.status)}`}>
                      {formatStatus(appt.status)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-[#718096]">
                    {appt.date && (
                      <span className="flex items-center gap-1">
                        <FiCalendar size={12} />
                        {appt.date}
                      </span>
                    )}
                    {appt.time && (
                      <span className="flex items-center gap-1">
                        <FiClock size={12} />
                        {appt.time}
                      </span>
                    )}
                    {appt.doctor_username && (
                      <span className="flex items-center gap-1">
                        <FiUser size={12} />
                        Dr. {appt.doctor_username}
                      </span>
                    )}
                  </div>

                  {/* Referral info */}
                  {appt.referred_to_username && (
                    <p className="text-xs text-purple-600 mt-2 font-medium">
                      Referred to: {appt.referred_to_username}
                    </p>
                  )}
                  {appt.referred_by_username && (
                    <p className="text-xs text-[#718096] mt-1">
                      Referred by: {appt.referred_by_username}
                    </p>
                  )}
                </div>

                <p className="text-xs text-[#718096] shrink-0 ml-4">
                  {new Date(appt.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-[#718096] hover:text-[#2d3748]">
              <FiX size={22} />
            </button>

            <h2 className="text-xl font-bold text-[#2d3748] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Request Appointment
            </h2>
            <p className="text-sm text-[#718096] mb-6">A staff member will schedule a date and time for you.</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#2d3748] mb-1">Reason for appointment *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 resize-none"
                  placeholder="e.g. Routine prenatal checkup, feeling dizzy, baby not moving..."
                />
              </div>

              <button type="submit" disabled={saving}
                className="w-full bg-[#2e7d32] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#256d2b] disabled:opacity-60 transition-colors">
                {saving ? 'Requesting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}