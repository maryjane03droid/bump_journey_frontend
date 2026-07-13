import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiMail, FiPhone, FiClock, FiEye } from 'react-icons/fi';
import api from '../../services/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/accounts/admin/messages/');
      const data = res.data.data || res.data;
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#718096]">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Contact Messages
        </h1>
        <p className="text-[#718096] text-sm mt-1">Messages from users via the contact form.</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center">
          <FiMail size={40} className="mx-auto text-[#e2e8f0] mb-3" />
          <p className="text-[#718096]">No messages received yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`w-full text-left bg-white rounded-xl border p-4 transition-all hover:shadow-sm ${
                  selectedMessage?.id === msg.id
                    ? 'border-[#2e7d32] shadow-sm'
                    : 'border-[#e2e8f0]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-medium text-[#2d3748] text-sm truncate">{msg.name}</p>
                  {!msg.is_read && (
                    <span className="w-2 h-2 rounded-full bg-[#2e7d32] shrink-0 mt-1.5"></span>
                  )}
                </div>
                <p className="text-xs text-[#718096] truncate mt-0.5">{msg.subject}</p>
                <p className="text-xs text-[#718096] mt-1 flex items-center gap-1">
                  <FiClock size={10} />
                  {new Date(msg.created_at).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#2d3748]">{selectedMessage.subject}</h2>
                    <p className="text-sm text-[#718096] mt-1">From: {selectedMessage.name}</p>
                  </div>
                  <span className="text-xs text-[#718096]">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-[#f8faf8] rounded-xl">
                  <a href={`mailto:${selectedMessage.email}`} className="flex items-center gap-2 text-sm text-[#2e7d32] hover:underline">
                    <FiMail size={14} />
                    {selectedMessage.email}
                  </a>
                  {selectedMessage.phone && (
                    <a href={`tel:${selectedMessage.phone}`} className="flex items-center gap-2 text-sm text-[#2e7d32] hover:underline">
                      <FiPhone size={14} />
                      {selectedMessage.phone}
                    </a>
                  )}
                </div>

                {/* Message Body */}
                <div className="mb-6">
                  <p className="text-xs text-[#718096] uppercase tracking-wider font-medium mb-2">Message</p>
                  <p className="text-sm text-[#2d3748] leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Admin Response */}
                {selectedMessage.admin_response && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-xs text-green-700 font-medium mb-1">Your Response</p>
                    <p className="text-sm text-green-800">{selectedMessage.admin_response}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-[#e2e8f0]">
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex items-center gap-2 bg-[#2e7d32] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#256d2b] transition-colors">
                    <FiMail size={15} />
                    Reply via Email
                  </a>
                  {selectedMessage.phone && (
                    <a href={`tel:${selectedMessage.phone}`}
                      className="flex items-center gap-2 border border-[#e2e8f0] text-[#2d3748] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#f7f7f7] transition-colors">
                      <FiPhone size={15} />
                      Call
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 text-center h-full flex items-center justify-center">
                <div>
                  <FiEye size={32} className="mx-auto text-[#e2e8f0] mb-3" />
                  <p className="text-[#718096]">Select a message to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}