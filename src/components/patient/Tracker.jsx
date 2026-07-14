import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../services/api';

const SYMPTOM_OPTIONS = [
  { value: 'NAUSEA', label: 'Nausea/Morning Sickness' },
  { value: 'BACK_PAIN', label: 'Back Pain' },
  { value: 'SWOLLEN_FEET', label: 'Swollen Feet' },
  { value: 'HEADACHE', label: 'Headache' },
  { value: 'FATIGUE', label: 'Fatigue' },
  { value: 'DIZZINESS', label: 'Dizziness' },
  { value: 'HEARTBURN', label: 'Heartburn' },
  { value: 'CONSTIPATION', label: 'Constipation' },
  { value: 'CRAMPING', label: 'Cramping' },
  { value: 'SHORTNESS_OF_BREATH', label: 'Shortness of Breath' },
  { value: 'INSOMNIA', label: 'Insomnia' },
  { value: 'FREQUENT_URINATION', label: 'Frequent Urination' },
  { value: 'OTHER', label: 'Other' },
];

const MOOD_OPTIONS = [
  { value: 'HAPPY', label: ' Happy' },
  { value: 'SAD', label: ' Sad' },
  { value: 'TIRED', label: ' Tired' },
  { value: 'STRESSED', label: ' Stressed' },
];

export default function Tracker() {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    weight_kg: '',
    blood_pressure: '',
    temperature: '',
    fetal_kick_count: '',
    symptom: '',
    symptom_other: '',
    mood: '',
    urgent_attention_requested: false,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      const res = await api.get('/tracker/health-logs/');
      const data = res.data.data || res.data;
      setVitals(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load vitals.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (vital) => {
    setForm({
      weight_kg: vital.weight_kg || '',
      blood_pressure: vital.blood_pressure || '',
      temperature: vital.temperature || '',
      fetal_kick_count: vital.fetal_kick_count || '',
      symptom: vital.symptom || '',
      symptom_other: vital.symptom_other || '',
      mood: vital.mood || '',
      urgent_attention_requested: vital.urgent_attention_requested || false,
    });
    setEditingId(vital.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      weight_kg: parseFloat(form.weight_kg),
      temperature: form.temperature ? parseFloat(form.temperature) : null,
      fetal_kick_count: form.fetal_kick_count ? parseInt(form.fetal_kick_count) : null,
      symptom: form.symptom || null,
      symptom_other: form.symptom === 'OTHER' ? form.symptom_other : '',
      mood: form.mood || null,
    };

    try {
      if (editingId) {
        await api.put(`/tracker/health-logs/${editingId}/`, payload);
        toast.success('Vitals updated successfully!');
      } else {
        await api.post('/tracker/health-logs/', payload);
        toast.success('Vitals recorded successfully!');
      }
      setShowForm(false);
      setEditingId(null);
      fetchVitals();
    } catch (error) {
      const data = error.response?.data;
      if (data) {
        const firstError = Object.values(data).flat()[0];
        toast.error(firstError || 'Failed to save vitals.');
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await api.delete(`/tracker/health-logs/${id}/`);
      toast.success('Vitals deleted successfully!');
      fetchVitals();
    } catch (error) {
      toast.error('Failed to delete vitals.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#718096]">Loading vitals...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Daily Vitals
          </h1>
          <p className="text-[#718096] text-sm mt-1">Track your daily health metrics.</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-[#2e7d32] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#256d2b] transition-colors">
          <FiPlus size={16} />
          Log Vitals
        </button>
      </div>

      {/* Vitals List */}
      {vitals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center">
          <p className="text-[#718096] mb-3">No vitals recorded yet.</p>
          <button onClick={openCreate} className="text-[#2e7d32] font-semibold text-sm hover:underline">
            Record your first entry →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {vitals.map((vital) => (
            <div key={vital.id} className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="text-xs text-[#718096]">Blood Pressure</p>
                    <p className="text-sm font-medium text-[#2d3748]">{vital.blood_pressure}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#718096]">Weight</p>
                    <p className="text-sm font-medium text-[#2d3748]">{vital.weight_kg} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#718096]">Temperature</p>
                    <p className="text-sm font-medium text-[#2d3748]">{vital.temperature ? `${vital.temperature}°C` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#718096]">Kicks</p>
                    <p className="text-sm font-medium text-[#2d3748]">{vital.fetal_kick_count || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => openEdit(vital)} className="text-[#718096] hover:text-[#2e7d32] transition-colors">
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(vital.id)} className="text-[#718096] hover:text-red-500 transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[#f0f0f0]">
                {vital.symptom && (
                  <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full">
                    {SYMPTOM_OPTIONS.find(s => s.value === vital.symptom)?.label || vital.symptom}
                  </span>
                )}
                {vital.mood && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    {MOOD_OPTIONS.find(m => m.value === vital.mood)?.label || vital.mood}
                  </span>
                )}
                {vital.urgent_attention_requested && (
                  <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full font-medium">Urgent</span>
                )}
                <span className="text-xs text-[#718096] ml-auto">
                  {new Date(vital.recorded_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="absolute top-4 right-4 text-[#718096] hover:text-[#2d3748]">
              <FiX size={22} />
            </button>

            <h2 className="text-xl font-bold text-[#2d3748] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {editingId ? 'Edit Vitals' : 'Log Daily Vitals'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1">Blood Pressure *</label>
                  <input type="text" name="blood_pressure" value={form.blood_pressure} onChange={handleChange} required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30"
                    placeholder="120/80" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1">Weight (kg) *</label>
                  <input type="number" step="0.1" name="weight_kg" value={form.weight_kg} onChange={handleChange} required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30"
                    placeholder="68.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1">Temperature °C</label>
                  <input type="number" step="0.1" name="temperature" value={form.temperature} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30"
                    placeholder="36.8" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1">Number of Kicks</label>
                  <input type="number" name="fetal_kick_count" value={form.fetal_kick_count} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30"
                    placeholder="12" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2d3748] mb-1">Symptom</label>
                <select name="symptom" value={form.symptom} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30">
                  <option value="">None</option>
                  {SYMPTOM_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {form.symptom === 'OTHER' && (
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1">Describe your symptom *</label>
                  <textarea name="symptom_other" value={form.symptom_other} onChange={handleChange} rows={2} required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 resize-none"
                    placeholder="Describe how you feel..." />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#2d3748] mb-2">Mood (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setForm({ ...form, mood: form.mood === opt.value ? '' : opt.value })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        form.mood === opt.value
                          ? 'bg-[#2e7d32] text-white'
                          : 'bg-[#f0f7f0] text-[#2d3748] hover:bg-[#e0efe0]'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="urgent_attention_requested" checked={form.urgent_attention_requested} onChange={handleChange}
                  className="w-4 h-4 text-[#2e7d32] rounded border-[#e2e8f0] focus:ring-[#8FBC8F]" />
                <label className="text-sm text-[#2d3748]">Flag as urgent (notify staff)</label>
              </div>

              <button type="submit" disabled={saving}
                className="w-full bg-[#2e7d32] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#256d2b] disabled:opacity-60 transition-colors mt-2">
                {saving ? 'Saving...' : editingId ? 'Update Vitals' : 'Save Vitals'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}