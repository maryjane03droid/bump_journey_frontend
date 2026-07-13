import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiSave, FiEdit2 } from 'react-icons/fi';
import api from '../../services/api';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    age: '',
    phone: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    last_menstrual_period_date: '',
    current_week: '',
    blood_group: '',
    existing_conditions: '',
    allergies: '',
    medical_history_notes: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/tracker/pregnancy-profiles/');
      const data = res.data.data || res.data;
      const profiles = Array.isArray(data) ? data : [];

      if (profiles.length > 0) {
        setProfile(profiles[0]);
        setForm({
          full_name: profiles[0].full_name || '',
          age: profiles[0].age || '',
          phone: profiles[0].phone || '',
          address: profiles[0].address || '',
          emergency_contact_name: profiles[0].emergency_contact_name || '',
          emergency_contact_phone: profiles[0].emergency_contact_phone || '',
          last_menstrual_period_date: profiles[0].last_menstrual_period_date || '',
          current_week: profiles[0].current_week || '',
          blood_group: profiles[0].blood_group || '',
          existing_conditions: profiles[0].existing_conditions || '',
          allergies: profiles[0].allergies || '',
          medical_history_notes: profiles[0].medical_history_notes || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        age: parseInt(form.age),
        current_week: parseInt(form.current_week),
      };

      if (profile) {
        await api.put(`/tracker/pregnancy-profiles/${profile.id}/`, payload);
        toast.success('Profile updated successfully!');
      } else {
        await api.post('/tracker/pregnancy-profiles/', payload);
        toast.success('Profile created successfully!');
      }

      setEditing(false);
      fetchProfile();
    } catch (error) {
      const data = error.response?.data;
      if (data) {
        const firstError = Object.values(data).flat()[0];
        toast.error(firstError || 'Failed to save profile.');
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#718096]">Loading profile...</p>
      </div>
    );
  }

  // Show form if no profile exists or editing
  if (!profile || editing) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-[#2d3748] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {profile ? 'Edit Profile' : 'Create Your Profile'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Full Name *</label>
              <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Age *</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} required min="14" max="55"
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Phone *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" placeholder="0712 345 678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Address *</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Emergency Contact Name *</label>
              <input type="text" name="emergency_contact_name" value={form.emergency_contact_name} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Emergency Contact Phone *</label>
              <input type="tel" name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Last Menstrual Period Date *</label>
              <input type="date" name="last_menstrual_period_date" value={form.last_menstrual_period_date} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Current Week of Pregnancy *</label>
              <input type="number" name="current_week" value={form.current_week} onChange={handleChange} required min="1" max="42"
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Blood Group *</label>
              <select name="blood_group" value={form.blood_group} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30">
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Existing Conditions (optional)</label>
              <textarea name="existing_conditions" value={form.existing_conditions} onChange={handleChange} rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 resize-none"
                placeholder="e.g. diabetes, hypertension..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Allergies (optional)</label>
              <textarea name="allergies" value={form.allergies} onChange={handleChange} rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 resize-none"
                placeholder="e.g. penicillin, peanuts..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3748] mb-1">Medical History Notes (optional)</label>
              <textarea name="medical_history_notes" value={form.medical_history_notes} onChange={handleChange} rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 resize-none"
                placeholder="Any relevant medical history..." />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="submit" disabled={saving}
              className="bg-[#2e7d32] text-white px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#256d2b] disabled:opacity-60 transition-colors">
              {saving ? 'Saving...' : <><FiSave size={16} /> {profile ? 'Update Profile' : 'Create Profile'}</>}
            </button>
            {profile && (
              <button type="button" onClick={() => setEditing(false)}
                className="px-8 py-3 rounded-xl text-sm font-semibold text-[#718096] border border-[#e2e8f0] hover:bg-[#f7f7f7] transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  // Show profile view
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          My Profile
        </h1>
        <button onClick={() => setEditing(true)}
          className="flex items-center gap-2 bg-[#2e7d32] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#256d2b] transition-colors">
          <FiEdit2 size={16} />
          Edit
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
        {/* Patient ID */}
        <div className="mb-6 p-4 bg-[#f0f7f0] rounded-xl">
          <p className="text-xs text-[#718096] uppercase tracking-wider font-medium">Patient ID</p>
          <p className="text-sm font-mono font-semibold text-[#2e7d32] mt-1">{user.userId}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <InfoRow label="Full Name" value={profile.full_name} />
          <InfoRow label="Age" value={profile.age} />
          <InfoRow label="Phone" value={profile.phone} />
          <InfoRow label="Address" value={profile.address} />
          <InfoRow label="Emergency Contact" value={`${profile.emergency_contact_name} (${profile.emergency_contact_phone})`} />
          <InfoRow label="Blood Group" value={profile.blood_group} />
          <InfoRow label="Current Week" value={`Week ${profile.current_week}`} />
          <InfoRow label="Estimated Due Date" value={profile.estimated_due_date || 'Calculating...'} />
          <InfoRow label="LMP Date" value={profile.last_menstrual_period_date} />
          {profile.existing_conditions && <InfoRow label="Existing Conditions" value={profile.existing_conditions} />}
          {profile.allergies && <InfoRow label="Allergies" value={profile.allergies} />}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="py-2">
      <p className="text-xs text-[#718096] uppercase tracking-wider font-medium">{label}</p>
      <p className="text-sm font-medium text-[#2d3748] mt-0.5">{value}</p>
    </div>
  );
}