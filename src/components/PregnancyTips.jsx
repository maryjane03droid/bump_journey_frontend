import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiPlay, FiLock, FiActivity, FiCoffee, FiBook, FiSmile, FiHelpCircle } from 'react-icons/fi';

const EXERCISE_TIPS = [
  { title: 'Prenatal Yoga', description: 'Gentle stretches to ease back pain and improve flexibility.', video: 'https://www.youtube.com/watch?v=_NP6u3TWlBE', weeks: 'All trimesters' },
  { title: 'Walking Routine', description: '15-minute prenatal walk and tone, safe for all trimesters.', video: 'https://www.youtube.com/watch?v=QxBm9QhbOgM', weeks: 'All trimesters' },
  { title: 'Pelvic Floor Exercises', description: 'Kegels and core routine to prepare for easier delivery.', video: 'https://www.youtube.com/watch?v=Ilg-gQY2Rxc', weeks: 'Week 12+' },
  { title: 'Full Body Workout', description: '30-min no-equipment pregnancy workout at home.', video: 'https://www.youtube.com/watch?v=hXuDYMORye0', weeks: 'All trimesters' },
  { title: 'Prenatal Pilates', description: 'Core stability and hip mobility for labor prep.', video: 'https://www.youtube.com/watch?v=UB6We_4fLF8', weeks: 'Week 14+' },
  { title: 'Deep Breathing & Stretching', description: 'Ease pelvic stiffness and tailbone pain with gentle yoga.', video: 'https://www.youtube.com/watch?v=LFngH78lyvI', weeks: 'All trimesters' },
];

const DIET_TIPS = [
  { week: 'Week 1-4', foods: 'Folic acid-rich foods: leafy greens, lentils, fortified cereals, citrus fruits.' },
  { week: 'Week 5-8', foods: 'Iron-rich foods: red meat, spinach, beans. Combat nausea with ginger tea and crackers.' },
  { week: 'Week 9-12', foods: 'Calcium: milk, yogurt, cheese, almonds. Vitamin D: eggs, fortified foods.' },
  { week: 'Week 13-16', foods: 'Omega-3: salmon, walnuts, flaxseed. Protein: lean meats, tofu, eggs.' },
  { week: 'Week 17-20', foods: 'Fiber: whole grains, fruits, vegetables. Stay hydrated with 8+ glasses of water.' },
  { week: 'Week 21-24', foods: 'Magnesium: dark chocolate, avocado, nuts. Zinc: pumpkin seeds, chickpeas.' },
  { week: 'Week 25-28', foods: 'Complex carbs: sweet potatoes, oats, quinoa. Vitamin C: bell peppers, strawberries.' },
  { week: 'Week 29-32', foods: 'High energy foods: bananas, dried fruits, nut butter. Small frequent meals.' },
  { week: 'Week 33-36', foods: 'Dates (may help labor), red raspberry leaf tea, lean proteins.' },
  { week: 'Week 37-40', foods: 'Easily digestible meals, coconut water, bone broth. Stay nourished for labor.' },
];

const FUN_FACTS = [
  'Your baby can hear your voice from 18 weeks!',
  'A baby develops fingerprints at just 3 months in the womb.',
  'Your heart pumps 50% more blood during pregnancy.',
  'Babies cry in the womb (silently) from around 28 weeks.',
  'Your sense of smell becomes stronger during pregnancy.',
  'A baby can taste what you eat through amniotic fluid.',
  'The longest recorded pregnancy was 375 days!',
  'Babies in the womb can dream from about 8 months.',
];

const RIDDLES = [
  { question: 'I grow bigger every day but I am not eating. What am I?', answer: 'A baby bump!' },
  { question: 'I have a heartbeat but no brain yet. What am I?', answer: 'A 5-week-old embryo!' },
  { question: 'I kick but I have no ball. What am I?', answer: 'A baby in the womb!' },
  { question: 'You wait 40 weeks to meet me. Who am I?', answer: 'Your newborn baby!' },
];

export default function PregnancyTips() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('exercise');
  const [revealedRiddle, setRevealedRiddle] = useState(null);

  const tabs = [
    { id: 'exercise', label: 'Exercises', icon: <FiActivity size={16} /> },
    { id: 'diet', label: 'Diet by Week', icon: <FiCoffee size={16} /> },
    { id: 'facts', label: 'Did You Know?', icon: <FiBook size={16} /> },
    { id: 'riddles', label: 'Riddles', icon: <FiSmile size={16} /> },
  ];

  const GatedContent = ({ children }) => {
    if (!isAuthenticated) {
      return (
        <div className="text-center py-12 bg-[#f0f7f0] rounded-2xl border border-[#e2e8f0]">
          <FiLock size={32} className="mx-auto text-[#718096] mb-3" />
          <p className="text-[#2d3748] font-medium mb-2">Login to view this content</p>
          <p className="text-sm text-[#718096] mb-4">Create a free account to access pregnancy tips, videos, and more.</p>
          <div className="flex justify-center gap-3">
            <Link to="/login" className="bg-[#2e7d32] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#256d2b] transition-colors">
              Login
            </Link>
            <Link to="/signup" className="border border-[#2e7d32] text-[#2e7d32] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2e7d32] hover:text-white transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      );
    }
    return children;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Pregnancy Tips
          </h1>
          <p className="mt-3 text-white/80 max-w-lg mx-auto">
            Exercises, nutrition guides, fun facts, and mental wellness activities for your journey.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#e2e8f0] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#2e7d32] text-white'
                  : 'bg-[#f0f7f0] text-[#2d3748] hover:bg-[#e0efe0]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Exercise Tab */}
        {activeTab === 'exercise' && (
          <GatedContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXERCISE_TIPS.map((tip, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#e2e8f0] p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-[#2d3748]">{tip.title}</h3>
                    <span className="text-xs bg-[#f0f7f0] text-[#2e7d32] px-2 py-1 rounded-full font-medium">{tip.weeks}</span>
                  </div>
                  <p className="text-sm text-[#718096] mb-4">{tip.description}</p>
                  <a
                    href={tip.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#2e7d32] text-sm font-semibold hover:underline"
                  >
                    <FiPlay size={14} />
                    Watch Video
                  </a>
                </div>
              ))}
            </div>
          </GatedContent>
        )}

        {/* Diet Tab */}
        {activeTab === 'diet' && (
          <GatedContent>
            <div className="space-y-4">
              {DIET_TIPS.map((tip, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="shrink-0 bg-[#2e7d32] text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                    {tip.week}
                  </span>
                  <p className="text-sm text-[#718096]">{tip.foods}</p>
                </div>
              ))}
            </div>
          </GatedContent>
        )}

        {/* Fun Facts Tab */}
        {activeTab === 'facts' && (
          <GatedContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FUN_FACTS.map((fact, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0f7f0] flex items-center justify-center shrink-0">
                    <FiHelpCircle size={16} className="text-[#2e7d32]" />
                  </div>
                  <p className="text-sm text-[#2d3748] leading-relaxed">{fact}</p>
                </div>
              ))}
            </div>
          </GatedContent>
        )}

        {/* Riddles Tab */}
        {activeTab === 'riddles' && (
          <GatedContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {RIDDLES.map((riddle, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                  <p className="font-medium text-[#2d3748] mb-3">{riddle.question}</p>
                  {revealedRiddle === i ? (
                    <p className="text-[#2e7d32] font-semibold text-sm">{riddle.answer}</p>
                  ) : (
                    <button
                      onClick={() => setRevealedRiddle(i)}
                      className="text-sm text-[#718096] hover:text-[#2e7d32] font-medium transition-colors"
                    >
                      Tap to reveal answer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </GatedContent>
        )}
      </section>
    </div>
  );
}