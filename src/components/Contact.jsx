import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiSend, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import api from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/accounts/contact/', form);
      toast.success('Message sent successfully! We will get back to you shortly.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
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
            Contact Us
          </h1>
          <p className="mt-3 text-white/80 max-w-lg mx-auto">
            Have questions or need assistance? We're here to help you every step of the way.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-[#2d3748] mb-6">Get in Touch</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 flex items-center justify-center text-[#2e7d32] shrink-0">
                  <FiMail size={18} />
                </div>
                <div>
                  <p className="font-medium text-[#2d3748] text-sm">Email</p>
                  <a href="mailto:bumpjourney@gmail.com" className="text-[#718096] text-sm hover:text-[#2e7d32]">
                    bumpjourney@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 flex items-center justify-center text-[#2e7d32] shrink-0">
                  <FiPhone size={18} />
                </div>
                <div>
                  <p className="font-medium text-[#2d3748] text-sm">Phone</p>
                  <a href="tel:+254700000000" className="text-[#718096] text-sm hover:text-[#2e7d32]">
                    +254 700 000 000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 flex items-center justify-center text-[#2e7d32] shrink-0">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <p className="font-medium text-[#2d3748] text-sm">Location</p>
                  <p className="text-[#718096] text-sm">Nairobi, Kenya</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-[#f0f7f0] rounded-xl">
              <p className="text-sm text-[#2d3748] font-medium mb-1">Working Hours</p>
              <p className="text-sm text-[#718096]">Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p className="text-sm text-[#718096]">Saturday: 9:00 AM - 1:00 PM</p>
              <p className="text-sm text-[#718096]">Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
              <h2 className="text-xl font-bold text-[#2d3748] mb-6">Send Us a Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Phone (optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all"
                    placeholder="0712 345 678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all"
                    placeholder="What's this about?"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#2d3748] mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#fcfdfc] text-sm focus:outline-none focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/30 transition-all resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#2e7d32] text-white px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-[#256d2b] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <FiSend size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}