import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiSend, FiX, FiBriefcase, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';

const JOB_SLOTS = [
  { role: 'DOCTOR', title: 'Doctor', department: 'General Practice', qualification: 'MBChB or equivalent', experience: '2+ years' },
  { role: 'PEDIATRICIAN', title: 'Pediatrician', department: 'Child Health', qualification: 'MBChB + Pediatrics Specialization', experience: '3+ years' },
  { role: 'NURSE', title: 'Nurse', department: 'Maternal Care', qualification: 'BSc/Diploma in Nursing', experience: '1+ years' },
  { role: 'MIDWIFE', title: 'Midwife', department: 'Obstetrics', qualification: 'Diploma/BSc in Midwifery', experience: '2+ years' },
  { role: 'NUTRITIONIST', title: 'Nutritionist', department: 'Maternal Nutrition', qualification: 'BSc in Nutrition/Dietetics', experience: '1+ years' },
  { role: 'LAB_TECHNICIAN', title: 'Lab Technician', department: 'Laboratory Services', qualification: 'Diploma in Medical Lab Technology', experience: '1+ years' },
  { role: 'THERAPIST', title: 'Therapist', department: 'Mental Wellness', qualification: 'BSc/MA in Psychology or Counseling', experience: '2+ years' },
];

export default function Careers() {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    qualification: '',
    years_of_experience: '',
    license_number: '',
    message: '',
  });

  const openModal = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRole('');
    setForm({ full_name: '', email: '', phone: '', qualification: '', years_of_experience: '', license_number: '', message: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.license_number.length !== 10 || !/^\d+$/.test(form.license_number)) {
      toast.error('License number must be exactly 10 digits.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/accounts/careers/apply/', {
        ...form,
        role_applied: selectedRole,
        years_of_experience: parseInt(form.years_of_experience),
      });
      toast.success('Application submitted successfully! We will review and get back to you.');
      closeModal();
    } catch (error) {
      const data = error.response?.data;
      if (data) {
        const firstError = Object.values(data).flat()[0];
        toast.error(firstError || 'Application failed.');
      } else {
        toast.error('Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Join Our Team
          </h1>
          <p className="mt-3 text-white/80 max-w-lg mx-auto">
            We're looking for passionate healthcare professionals to support expectant mothers on their journey.
          </p>
        </div>
      </section>

      {/* Job Slots */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {JOB_SLOTS.map((job) => (
            <div key={job.role} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 hover:border-[#8FBC8F] hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 flex items-center justify-center text-[#2e7d32]">
                  <FiBriefcase size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2d3748]">{job.title}</h3>
                  <p className="text-xs text-[#718096]">{job.department}</p>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                <p className="text-sm text-[#718096]"><span className="font-medium text-[#2d3748]">Qualification:</span> {job.qualification}</p>
                <p className="text-sm text-[#718096]"><span className="font-medium text-[#2d3748]">Experience:</span> {job.experience}</p>
                <p className="text-sm flex items-center gap-1 text-[#2e7d32]">
                  <FiCheckCircle size={14} />
                  <span className="font-medium">Open</span>
                </p>
              </div>

              <button
                onClick={() => openModal(job.role)}
                className="w-full bg-[#2e7d32] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#256d2b] transition-colors duration-200"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-[#718096] hover:text-[#2d3748]">
              <FiX size={22} />
            </button>

            <h2 className="text-xl font-bold text-[#2d3748] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Apply for {JOB_SLOTS.find(j => j.role === selectedRole)?.title}
            </h2>
            <p className="text-sm text-[#718096] mb-6">Fill in your details below.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2d3748] mb-1">Full Name</label>
                <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" placeholder="Your full name" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1">Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" placeholder="0712 345 678" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2d3748] mb-1">Qualification</label>
                <input type="text" name="qualification" value={form.qualification} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" placeholder="Your highest qualification" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1">Years of Experience</label>
                  <input type="number" name="years_of_experience" value={form.years_of_experience} onChange={handleChange} required min="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" placeholder="e.g. 3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1">License Number</label>
                  <input type="text" name="license_number" value={form.license_number} onChange={handleChange} required maxLength="10"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30" placeholder="10 digits only" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2d3748] mb-1">Short Message (optional)</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 resize-none" placeholder="Why do you want to join?" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-[#2e7d32] text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#256d2b] disabled:opacity-60 transition-colors duration-200">
                {loading ? 'Submitting...' : <><FiSend size={16} /> Submit Application</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}