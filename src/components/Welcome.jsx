import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiShield, FiUsers, FiCalendar } from 'react-icons/fi';

export default function Welcome() {
  const features = [
    {
      icon: <FiHeart size={24} />,
      title: 'Track Your Pregnancy',
      description: 'Log daily vitals, monitor baby kicks, and get personalized health insights throughout your journey.'
    },
    {
      icon: <FiUsers size={24} />,
      title: 'Expert Care Team',
      description: 'Connect with doctors, midwives, nutritionists, and therapists dedicated to your wellbeing.'
    },
    {
      icon: <FiCalendar size={24} />,
      title: 'Easy Appointments',
      description: 'Request and manage appointments with your care team in just a few clicks.'
    },
    {
      icon: <FiShield size={24} />,
      title: 'Safe & Secure',
      description: 'Your health data is protected with industry-standard security and only shared with your care team.'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#8FBC8F] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Text and Buttons */}
          <div className="max-w-2xl lg:w-1/2 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Your Pregnancy Journey,{' '}
              <span className="text-[#8FBC8F]">Supported</span> Every Step
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-xl">
              Track your health, connect with qualified professionals, and get the care you deserve.
              From first trimester to delivery day.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-white text-[#2e7d32] px-8 py-3.5 rounded-full font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
                <FiArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-full font-semibold text-base hover:bg-white/10 transition-all duration-200"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end z-10 w-full mt-10 lg:mt-0">
            <div className="relative w-full max-w-md xl:max-w-lg">
              <div className="absolute inset-0 bg-[#8FBC8F] rounded-full blur-2xl opacity-20 translate-x-4 translate-y-4"></div>
              
              <img 
                src="/images/mother_baby.jpg" 
                alt="Mother and baby" 
                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl border-4 border-white/10 object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#2d3748]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Everything You Need in One Place
          </h2>
          <p className="mt-3 text-[#718096] max-w-lg mx-auto">
            Bump Journey brings together health tracking, professional care, and community support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-[#e2e8f0] bg-white hover:border-[#8FBC8F] hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#2e7d32]/10 text-[#2e7d32] flex items-center justify-center mb-4 group-hover:bg-[#2e7d32] group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-[#2d3748] text-base mb-2">{feature.title}</h3>
              <p className="text-sm text-[#718096] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f0f7f0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2d3748] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ready to Start Your Journey?
          </h2>
          <p className="text-[#718096] mb-8 max-w-md mx-auto">
            Join thousands of mothers who trust Bump Journey for their prenatal care.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-[#2e7d32] text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-[#256d2b] hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign Up Free
              <FiArrowRight size={18} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border-2 border-[#2e7d32] text-[#2e7d32] px-8 py-3.5 rounded-full font-semibold hover:bg-[#2e7d32] hover:text-white transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}