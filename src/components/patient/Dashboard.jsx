import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiActivity, FiCalendar, FiAlertCircle, FiShoppingCart, FiFileText } from 'react-icons/fi';
import { FaSmile } from 'react-icons/fa'; // Added FaSmile import
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
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#2d3748] flex items-center gap-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Welcome back, {user.username} 
         
        </h1>
        <p className="text-[#718096] mt-2 text-lg">Here's your pregnancy overview.</p>
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
        
        {/* Profile - Olive Green */}
        <Link to={profile ? '/patient/profile' : '/patient/profile'} className="group bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#7A8B56] hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#7A8B56]/15 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#7A8B56] group-hover:text-white text-[#7A8B56] transition-colors duration-300">
            <FiUser size={20} />
          </div>
          <p className="text-sm font-semibold text-[#2d3748]">{profile ? 'Profile' : 'Create Profile'}</p>
        </Link>

        {/* Log Vitals - Soft Pink */}
        <Link to="/patient/tracker" className="group bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#D88C9A] hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#D88C9A]/15 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#D88C9A] group-hover:text-white text-[#D88C9A] transition-colors duration-300">
            <FiActivity size={20} />
          </div>
          <p className="text-sm font-semibold text-[#2d3748]">Log Vitals</p>
        </Link>

        {/* Appointments - Slate Blue */}
        <Link to="/patient/appointments" className="group bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#729BBD] hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#729BBD]/15 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#729BBD] group-hover:text-white text-[#729BBD] transition-colors duration-300">
            <FiCalendar size={20} />
          </div>
          <p className="text-sm font-semibold text-[#2d3748]">Appointments</p>
        </Link>

        {/* Audit Trail - Soft Purple */}
        <Link to="/patient/audit-trail" className="group bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#9D84B6] hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#9D84B6]/15 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#9D84B6] group-hover:text-white text-[#9D84B6] transition-colors duration-300">
            <FiFileText size={20} />
          </div>
          <p className="text-sm font-semibold text-[#2d3748]">Audit Trail</p>
        </Link>

        {/* Shop - Soft Yellow/Gold */}
        <Link to="/shop" className="group bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#D4AF37] hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#D4AF37] group-hover:text-white text-[#D4AF37] transition-colors duration-300">
            <FiShoppingCart size={20} />
          </div>
          <p className="text-sm font-semibold text-[#2d3748]">Shop</p>
        </Link>

        {/* Tips - Theme Green */}
        <Link to="/pregnancy-tips" className="group bg-white rounded-xl border border-[#e2e8f0] p-4 text-center hover:border-[#2e7d32] hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#2e7d32]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#2e7d32] group-hover:text-white text-[#2e7d32] transition-colors duration-300">
            <FiAlertCircle size={20} />
          </div>
          <p className="text-sm font-semibold text-[#2d3748]">Tips</p>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Profile Summary */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-[#2d3748] mb-4 text-lg">Profile</h3>
          {profile ? (
            <div className="space-y-3">
              <p className="text-sm text-[#718096] flex justify-between"><span>Week:</span> <span className="font-bold text-[#2e7d32]">{profile.current_week}</span></p>
              <div className="h-px bg-gray-100"></div>
              <p className="text-sm text-[#718096] flex justify-between"><span>Due:</span> <span className="font-semibold text-[#2d3748]">{profile.estimated_due_date || 'Calculating...'}</span></p>
              <div className="h-px bg-gray-100"></div>
              <p className="text-sm text-[#718096] flex justify-between"><span>Blood Group:</span> <span className="font-semibold text-[#2d3748]">{profile.blood_group}</span></p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-[#718096] mb-3">No profile yet.</p>
              <Link to="/patient/profile" className="text-[#2e7d32] text-sm font-semibold hover:underline">Create Profile →</Link>
            </div>
          )}
        </div>

        {/* Recent Vitals */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-[#2d3748] mb-4 text-lg">Latest Vitals</h3>
          {vitals.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-[#718096] flex justify-between"><span>BP:</span> <span className="font-semibold text-[#2d3748]">{vitals[0].blood_pressure}</span></p>
              <div className="h-px bg-gray-100"></div>
              <p className="text-sm text-[#718096] flex justify-between"><span>Weight:</span> <span className="font-semibold text-[#2d3748]">{vitals[0].weight_kg} kg</span></p>
              <div className="h-px bg-gray-100"></div>
              <p className="text-sm text-[#718096] flex justify-between"><span>Kicks:</span> <span className="font-semibold text-[#2d3748]">{vitals[0].fetal_kick_count || 'N/A'}</span></p>
              <p className="text-xs text-[#a0aec0] mt-3 italic">Recorded: {new Date(vitals[0].recorded_at).toLocaleDateString()}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-[#718096] mb-3">No vitals recorded yet.</p>
              <Link to="/patient/tracker" className="text-[#2e7d32] text-sm font-semibold hover:underline">Log Vitals →</Link>
            </div>
          )}
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-bold text-[#2d3748] mb-4 text-lg">Appointments</h3>
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.slice(0, 3).map((appt) => (
                <div key={appt.id} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <p className="text-sm font-medium text-[#4a5568] truncate max-w-[120px]">{appt.reason || 'Appointment'}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold tracking-wide ${
                    appt.status === 'SCHEDULED' ? 'bg-green-100 text-green-700' :
                    appt.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-700' :
                    appt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-200 text-gray-700'
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