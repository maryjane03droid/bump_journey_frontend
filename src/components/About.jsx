import { FiHeart, FiTarget, FiUsers, FiAward } from 'react-icons/fi';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            About Bump Journey
          </h1>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto text-lg">
            We believe every expectant mother deserves accessible, quality prenatal care
            and a supportive community throughout her pregnancy.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 flex items-center justify-center text-[#2e7d32]">
                <FiTarget size={20} />
              </div>
              <h2 className="text-2xl font-bold text-[#2d3748]">Our Mission</h2>
            </div>
            <p className="text-[#718096] leading-relaxed">
              To bridge the gap between expectant mothers and healthcare professionals by providing
              a digital platform that enables real-time health tracking, seamless appointment management,
              and continuous clinical collaboration. We aim to reduce maternal health complications
              through early detection and consistent monitoring.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#2e7d32]/10 flex items-center justify-center text-[#2e7d32]">
                <FiHeart size={20} />
              </div>
              <h2 className="text-2xl font-bold text-[#2d3748]">Our Vision</h2>
            </div>
            <p className="text-[#718096] leading-relaxed">
              A world where every pregnant woman has access to quality prenatal care, regardless of
              location or economic status. We envision a connected healthcare ecosystem where mothers
              feel empowered, informed, and supported from conception to delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#f0f7f0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#2d3748] text-center mb-10" style={{ fontFamily: 'Poppins, sans-serif' }}>
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FiHeart size={22} />, title: 'Compassion', text: 'Every mother is treated with dignity, empathy, and personalized attention.' },
              { icon: <FiAward size={22} />, title: 'Excellence', text: 'We uphold the highest standards in healthcare delivery and technology.' },
              { icon: <FiUsers size={22} />, title: 'Collaboration', text: 'Our multidisciplinary team works together for the best patient outcomes.' },
              { icon: <FiTarget size={22} />, title: 'Accessibility', text: 'Quality care should be within reach for every expectant mother.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-[#e2e8f0]">
                <div className="w-11 h-11 rounded-xl bg-[#2e7d32]/10 text-[#2e7d32] flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-[#2d3748] mb-2">{item.title}</h3>
                <p className="text-sm text-[#718096] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-[#2d3748] text-center mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Our Care Team
        </h2>
        <p className="text-[#718096] text-center max-w-lg mx-auto mb-10">
          A multidisciplinary team of qualified professionals dedicated to maternal and child health.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {['Doctors', 'Pediatricians', 'Nurses', 'Midwives', 'Nutritionists', 'Lab Technicians', 'Therapists'].map((role) => (
            <div key={role} className="text-center py-4 px-3 rounded-xl bg-white border border-[#e2e8f0]">
              <p className="font-semibold text-[#2e7d32] text-sm">{role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}