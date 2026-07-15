import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiSend, FiX, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';

export default function Referrals() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [referTo, setReferTo] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apptRes, usersRes] = await Promise.all([
        api.get('/staff/appointments/'),
        api.get('/staff/users/')
           .catch(() => ({ data: { data: [] } })) 
      ]);

      
      const apptData = apptRes.data?.results || apptRes.data?.data || apptRes.data;
      setAppointments(Array.isArray(apptData) ? apptData : []);

      
      const usersData = usersRes.data?.data || usersRes.data?.results || usersRes.data;
      const staffRoles = ['DOCTOR', 'PEDIATRICIAN', 'NURSE', 'MIDWIFE', 'NUTRITIONIST', 'LAB_TECHNICIAN', 'THERAPIST'];
      
      const staff = Array.isArray(usersData)
        ? usersData.filter(u => {
            
            const hasValidRole = typeof u.role === 'string' && staffRoles.includes(u.role.toUpperCase());
            // 2. Check both id and userId 
            const isNotSelf = u.id !== user?.id && u.id !== user?.userId;
            // 3. Allow if is_approved is true OR if the field doesn't exist
            const isApproved = u.is_approved !== false; 
            
            return hasValidRole && isNotSelf && isApproved;
          })
        : [];
        
      setStaffList(staff);
    } catch (error) {
      console.error("Fetch data error:", error);
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const openReferModal = (appt) => {
    setSelectedAppt(appt);
    setReferTo('');
    setShowModal(true);
  };

  const handleRefer = async (e) => {
    e.preventDefault();
    if (!referTo) {
      toast.error('Please select a staff member.');
      return;
    }

    setSending(true);
    try {
      const res = await api.post(`/staff/appointments/${selectedAppt.id}/refer/`, { referred_to: referTo });
      toast.success(res.data.message || 'Referral sent successfully!');
      setShowModal(false);
      setSelectedAppt(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send referral.');
    } finally {
      setSending(false);
    }
  };

  const referrableAppointments = appointments.filter(a =>
    !['COMPLETED', 'REVIEWED'].includes(a.status)
  );

  const receivedReferrals = appointments.filter(a =>
    a.referred_to_username === user?.username
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#718096]">Loading referrals...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Referrals
        </h1>
        <p className="text-[#718096] text-sm mt-1">Send patient cases to other staff members or view referrals received.</p>
      </div>

      {/* Received Referrals */}
      {receivedReferrals.length > 0 && (
        <div className="mb-10">
          <h2 className="font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Referrals Received ({receivedReferrals.length})
          </h2>
          <div className="space-y-3">
            {receivedReferrals.map((appt) => (
              <div key={appt.id} className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-[#2d3748] text-sm">Patient: {appt.patient_username}</p>
                    <p className="text-xs text-[#718096] mt-1">Reason: {appt.reason || 'Not specified'}</p>
                    <p className="text-xs text-purple-600 mt-1 font-medium">Referred by: {appt.referred_by_username}</p>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                    {appt.status?.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Send Referrals */}
      <div>
        <h2 className="font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2e7d32]"></span>
          Send Referral
        </h2>

        {referrableAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center">
            <p className="text-[#718096]">No appointments available for referral.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrableAppointments.map((appt) => (
              <div key={appt.id} className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex justify-between items-center hover:shadow-sm transition-shadow">
                <div>
                  <p className="font-medium text-[#2d3748] text-sm">Patient: {appt.patient_username}</p>
                  <p className="text-xs text-[#718096] mt-0.5">Reason: {appt.reason || 'Not specified'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      appt.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-700' :
                      appt.status === 'LOCKED' ? 'bg-gray-100 text-gray-700' :
                      appt.status === 'SCHEDULED' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {appt.status?.replace(/_/g, ' ')}
                    </span>
                    {appt.is_locked && appt.locked_by_username && (
                      <span className="text-xs text-[#718096]">Locked by: {appt.locked_by_username}</span>
                    )}
                  </div>
                </div>
                <button onClick={() => openReferModal(appt)}
                  className="flex items-center gap-1.5 bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-purple-700 transition-colors">
                  <FiSend size={13} />
                  Refer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refer Modal */}
      {showModal && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-[#718096] hover:text-[#2d3748]">
              <FiX size={22} />
            </button>

            <h2 className="text-xl font-bold text-[#2d3748] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Refer Patient
            </h2>
            <p className="text-sm text-[#718096] mb-6">
              Referring <strong>{selectedAppt.patient_username}</strong> to another staff member.
            </p>

            <form onSubmit={handleRefer} className="space-y-5">
              <div className="bg-[#f0f7f0] rounded-xl p-4">
                <p className="text-xs text-[#718096]">Reason</p>
                <p className="text-sm font-medium text-[#2d3748]">{selectedAppt.reason || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2d3748] mb-1">Refer to *</label>
                <select value={referTo} onChange={(e) => setReferTo(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30">
                  <option value="">Select staff member</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.username} ({s.role})</option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={sending}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-purple-700 disabled:opacity-60 transition-colors">
                {sending ? 'Sending...' : <><FiArrowRight size={16} /> Send Referral</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}