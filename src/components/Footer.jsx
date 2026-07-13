import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-[#1b5e20] text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div>
            <h3 className="text-white font-bold text-lg mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Bump Journey</h3>
            <p className="text-sm leading-relaxed">
              Connecting expectant mothers with qualified healthcare professionals.
              Your pregnancy journey, supported every step of the way.
            </p>
            <p className="text-xs mt-3 text-white/60">
              Health services qualified by government standards.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm hover:text-white transition-colors">About Us</Link>
              <Link to="/contact" className="text-sm hover:text-white transition-colors">Contact Us</Link>
              <Link to="/careers" className="text-sm hover:text-white transition-colors">Careers</Link>
              <Link to="/pregnancy-tips" className="text-sm hover:text-white transition-colors">Pregnancy Tips</Link>
              <Link to="/shop" className="text-sm hover:text-white transition-colors">Shop</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Get in Touch</h4>
            <div className="flex flex-col gap-2">
              <a href="mailto:bumpjourney@gmail.com" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <FiMail size={14} />
                bumpjourney@gmail.com
              </a>
              <a href="tel:+254700000000" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <FiPhone size={14} />
                +254 700 000 000
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Bump Journey. All rights reserved.
          </p>
          <p className="text-xs text-white/50 flex items-center gap-1">
            Made with <FiHeart size={12} className="text-red-300" /> for expectant mothers
          </p>
        </div>
      </div>
    </footer>
  );
}