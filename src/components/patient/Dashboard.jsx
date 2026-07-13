import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiActivity, FiCalendar, FiAlertCircle, FiShoppingCart, FiFileText } from 'react-icons/fi';
import api from '../../services/api';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, vitalsRes, appointmentsRes] = await Promise.all([
        api.get('/tracker/pregnancy-profiles/').catch(() => ({ data: { data: [] } })),
        api.get('/tracker/health-logs/').catch(() => ({ data: { data: [] } })),
        api.get('/staff/appointments/').catch(() => ({ data: { data: [] } })),
      ]);

      const profiles = profileRes.data.data || profileRes.data;
      setProfile(Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : null);

      const vitalsData = vitalsRes.data.data || vitalsRes.data;
      setVitals(Array.isArray(vitalsData) ? vitalsData : []);

      const apptData = appointmentsRes.data.data || appointmentsRes.data;
      setAppointments(Array.isArray(apptData) ? apptData : []);
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const isDueDateClose = () => {
    if (!profile?.estimated_due_date) return false;
    const due = new Date(profile.estimated_due_date);
    const now = new Date();
    const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return daysLeft <= 14 && daysLeft >= 0;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#718096]">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Welcome back, {user.username} 👋
        </h1>
        <p className="text-[#718096] mt-1">Here's your pregnancy overview.</p>
      </div>

      {/* Due Date Alert */}
      {isDueDateClose() && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <FiAlertCircle size={20} className="text-orange-500 shrink-0" />
          <div>
            <p className="font-medium text-orange-800 text-sm">Your due date is approaching!</p>
            <p className="text-xs text-orange-600 mt-0.5">
              Expected: {profile.estimated_due_date}.
              <Link to="/patient/appointments" className="underline ml-1 font-semibold">Book midwife appointment</Link>
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <Link to={profile ? '/patient/profile' : '/patient/profile'} className="group bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#8FBC8F] hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-[#2e7d32] group-hover:text-white text-[#2e7d32] transition-colors">
            <FiUser size={18} />
          </div>
          <p className="text-xs font-medium text-[#2d3748]">{profile ? 'Profile' : 'Create Profile'}</p>
        </Link>

        <Link to="/patient/tracker" className="group bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#8FBC8F] hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-[#2e7d32] group-hover:text-white text-[#2e7d32] transition-colors">
            <FiActivity size={18} />
          </div>
          <p className="text-xs font-medium text-[#2d3748]">Log Vitals</p>
        </Link>

        <Link to="/patient/appointments" className="group bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#8FBC8F] hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-[#2e7d32] group-hover:text-white text-[#2e7d32] transition-colors">
            <FiCalendar size={18} />
          </div>
          <p className="text-xs font-medium text-[#2d3748]">Appointments</p>
        </Link>

        <Link to="/patient/audit-trail" className="group bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#8FBC8F] hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-[#2e7d32] group-hover:text-white text-[#2e7d32] transition-colors">
            <FiFileText size={18} />
          </div>
          <p className="text-xs font-medium text-[#2d3748]">Audit Trail</p>
        </Link>

        <Link to="/shop" className="group bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#8FBC8F] hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-[#2e7d32] group-hover:text-white text-[#2e7d32] transition-colors">
            <FiShoppingCart size={18} />
          </div>
          <p className="text-xs font-medium text-[#2d3748]">Shop</p>
        </Link>

        <Link to="/pregnancy-tips" className="group bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#8FBC8F] hover:shadow-sm transition-all">
          <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-[#2e7d32] group-hover:text-white text-[#2e7d32] transition-colors">
            <FiAlertCircle size={18} />
          </div>
          <p className="text-xs font-medium text-[#2d3748]">Tips</p>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Profile Summary */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
          <h3 className="font-semibold text-[#2d3748] mb-3">Profile</h3>
          {profile ? (
            <div className="space-y-2">
              <p className="text-sm text-[#718096]">Week: <span className="font-medium text-[#2d3748]">{profile.current_week}</span></p>
              <p className="text-sm text-[#718096]">Due: <span className="font-medium text-[#2d3748]">{profile.estimated_due_date || 'Calculating...'}</span></p>
              <p className="text-sm text-[#718096]">Blood Group: <span className="font-medium text-[#2d3748]">{profile.blood_group}</span></p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-[#718096] mb-3">No profile yet.</p>
              <Link to="/patient/profile" className="text-[#2e7d32] text-sm font-semibold hover:underline">Create Profile →</Link>
            </div>
          )}
        </div>

        {/* Recent Vitals */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
          <h3 className="font-semibold text-[#2d3748] mb-3">Latest Vitals</h3>
          {vitals.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-[#718096]">BP: <span className="font-medium text-[#2d3748]">{vitals[0].blood_pressure}</span></p>
              <p className="text-sm text-[#718096]">Weight: <span className="font-medium text-[#2d3748]">{vitals[0].weight_kg} kg</span></p>
              <p className="text-sm text-[#718096]">Kicks: <span className="font-medium text-[#2d3748]">{vitals[0].fetal_kick_count || 'N/A'}</span></p>
              <p className="text-xs text-[#718096] mt-2">Recorded: {new Date(vitals[0].recorded_at).toLocaleDateString()}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-[#718096] mb-3">No vitals recorded yet.</p>
              <Link to="/patient/tracker" className="text-[#2e7d32] text-sm font-semibold hover:underline">Log Vitals →</Link>
            </div>
          )}
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
          <h3 className="font-semibold text-[#2d3748] mb-3">Appointments</h3>
          {appointments.length > 0 ? (
            <div className="space-y-2">
              {appointments.slice(0, 3).map((appt) => (
                <div key={appt.id} className="flex justify-between items-center">
                  <p className="text-sm text-[#718096] truncate">{appt.reason || 'Appointment'}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    appt.status === 'SCHEDULED' ? 'bg-green-100 text-green-700' :
                    appt.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-700' :
                    appt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-sm text-[#718096] mb-3">No appointments yet.</p>
              <Link to="/patient/appointments" className="text-[#2e7d32] text-sm font-semibold hover:underline">Request Appointment →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}