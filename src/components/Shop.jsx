import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiShoppingCart, FiStar, FiLock, FiPlus } from 'react-icons/fi';

const PRODUCTS = [
  { 
    id: 1, 
    name: 'Maternity Support Belt', 
    price: 1500, 
    rating: 4.5, 
    image: 'public/images/maternity-belt.jpg', 
    description: 'Adjustable belly band for back support during pregnancy.' 
  },
  { 
    id: 2, 
    name: 'Baby Diaper Pack (50pcs)', 
    price: 1200, 
    rating: 4.8, 
    image: 'public/images/diaper-pack.jpg', 
    description: 'Ultra-soft, hypoallergenic diapers for newborns.' 
  },
  { 
    id: 3, 
    name: 'Organic Baby Oil', 
    price: 650, 
    rating: 4.6, 
    image: 'public/images/baby-oil.jpg', 
    description: 'Natural moisturizing oil for delicate baby skin.' 
  },
  { 
    id: 4, 
    name: 'Nursing Pillow', 
    price: 2200, 
    rating: 4.7, 
    image: 'public/images/nursing-pillow.jpg', 
    description: 'Ergonomic breastfeeding support pillow.' 
  },
  { 
    id: 5, 
    name: 'Baby Blanket Set', 
    price: 1800, 
    rating: 4.4, 
    image: 'public/images/baby-blanket.jpg', 
    description: 'Soft cotton blankets in 3 adorable colors.' 
  },
  { 
    id: 6, 
    name: 'Pregnancy Pillow', 
    price: 3500, 
    rating: 4.9, 
    image: 'public/images/pregnancy-pillow.jpg', 
    description: 'Full-body pillow for comfortable sleep in all trimesters.' 
  },
  { 
    id: 7, 
    name: 'Feeding Bottle Set (3pcs)', 
    price: 950, 
    rating: 4.3, 
    image: 'public/images/bottle-set.jpg', 
    description: 'Anti-colic bottles with natural-feel nipples.' 
  },
  { 
    id: 8, 
    name: 'Hospital Bag Kit', 
    price: 4500, 
    rating: 4.8, 
    image: 'public/images/hospital-bag.jpg', 
    description: 'Everything you need packed and ready for delivery day.' 
  },
  { 
    id: 9, 
    name: 'Stretch Mark Cream', 
    price: 800, 
    rating: 4.2, 
    image: 'public/images/stretch-mark-cream.jpg', 
    description: 'Cocoa butter formula to prevent and reduce stretch marks.' 
  },
  { 
    id: 10, 
    name: 'Baby Clothes Bundle', 
    price: 2800, 
    rating: 4.6, 
    image: 'public/images/baby-clothes.jpg', 
    description: '10-piece newborn essentials set (0-3 months).' 
  },
  { 
    id: 11, 
    name: 'Prenatal Vitamins (60 tabs)', 
    price: 1100, 
    rating: 4.7, 
    image: 'public/images/prenatal-vitamins.jpg', 
    description: 'Folic acid, iron, and DHA for mother and baby.' 
  },
  { 
    id: 12, 
    name: 'Nursing Pads (30pcs)', 
    price: 450, 
    rating: 4.5, 
    image: 'public/images/nursing-pads.jpg', 
    description: 'Disposable, ultra-absorbent breast pads.' 
  }
];

export default function Shop() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('bump_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const addToCart = (product) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to your cart.');
      navigate('/login');
      return;
    }

    const existing = cart.find(item => item.id === product.id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('bump_cart', JSON.stringify(updatedCart));
    toast.success(`${product.name} added to cart!`);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Shop
              </h1>
              <p className="mt-3 text-white/80 max-w-lg">
                Quality products for you and your baby. Payment on delivery only.
              </p>
            </div>
            {isAuthenticated && cartCount > 0 && (
              <Link
                to="/patient/cart"
                className="flex items-center gap-2 bg-white text-[#2e7d32] px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <FiShoppingCart size={18} />
                Cart ({cartCount})
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden hover:shadow-md hover:border-[#8FBC8F] transition-all duration-300">
              
              {/* Product Image Placeholder - UPDATED */}
              <div className="h-48 bg-white p-4 flex items-center justify-center border-b border-[#e2e8f0]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-contain" 
                />
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-[#2d3748] text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-[#718096] mb-3 leading-relaxed">{product.description}</p>

                <div className="flex items-center gap-1 mb-3">
                  {renderStars(product.rating)}
                  <span className="text-xs text-[#718096] ml-1">({product.rating})</span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#2e7d32] text-lg">KSh {product.price.toLocaleString()}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-1 bg-[#2e7d32] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#256d2b] transition-colors"
                  >
                    <FiPlus size={14} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Notice */}
        <div className="mt-12 bg-[#f0f7f0] rounded-2xl p-6 text-center border border-[#e2e8f0]">
          <p className="text-[#2d3748] font-medium"> Payment on delivery only</p>
          <p className="text-sm text-[#718096] mt-1">No upfront payments. Pay the delivery person when you receive your items.</p>
        </div>
      </section>
    </div>
  );
}