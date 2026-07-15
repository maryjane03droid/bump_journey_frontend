import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiMapPin } from 'react-icons/fi';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    delivery_notes: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('bump_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('bump_cart', JSON.stringify(updatedCart));
  };

  const increaseQty = (id) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    updateCart(updated);
    toast.success('Item removed from cart.');
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    // In a real app this would call a backend endpoint
    setOrderPlaced(true);
    localStorage.removeItem('bump_cart');
    setCart([]);
    toast.success('Order placed successfully! Payment on delivery.');
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <FiShoppingBag size={28} className="text-[#2e7d32]" />
          </div>
          <h2 className="text-2xl font-bold text-[#2d3748] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Order Placed!
          </h2>
          <p className="text-[#718096] mb-6">
            Your order has been confirmed. Pay the delivery person when you receive your items.
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-[#2e7d32] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#256d2b] transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12">
          <FiShoppingBag size={40} className="mx-auto text-[#e2e8f0] mb-3" />
          <p className="text-[#718096] mb-4">Your cart is empty.</p>
          <Link to="/shop" className="text-[#2e7d32] font-semibold text-sm hover:underline">
            Browse products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-[#2d3748] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
        My Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-[#e2e8f0] p-5 flex items-center gap-4">
              
              {/* UPDATED: Product Image Thumbnail */}
              <div className="w-14 h-14 bg-white border border-[#e2e8f0] rounded-xl flex items-center justify-center shrink-0 overflow-hidden p-1">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-contain" 
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#2d3748] text-sm truncate">{item.name}</h3>
                <p className="text-[#2e7d32] font-bold text-sm mt-0.5">KSh {item.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => decreaseQty(item.id)}
                  className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#718096] hover:bg-[#f0f7f0] transition-colors">
                  <FiMinus size={14} />
                </button>
                <span className="text-sm font-semibold text-[#2d3748] w-6 text-center">{item.quantity}</span>
                <button onClick={() => increaseQty(item.id)}
                  className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#718096] hover:bg-[#f0f7f0] transition-colors">
                  <FiPlus size={14} />
                </button>
              </div>

              <p className="font-bold text-[#2d3748] text-sm w-20 text-right">
                KSh {(item.price * item.quantity).toLocaleString()}
              </p>

              <button onClick={() => removeItem(item.id)} className="text-[#718096] hover:text-red-500 transition-colors">
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sticky top-24">
            <h3 className="font-bold text-[#2d3748] mb-4">Order Summary</h3>

            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[#718096] truncate mr-2">{item.name} x{item.quantity}</span>
                  <span className="text-[#2d3748] font-medium shrink-0">KSh {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e2e8f0] pt-3 mb-5">
              <div className="flex justify-between">
                <span className="font-semibold text-[#2d3748]">Total</span>
                <span className="font-bold text-[#2e7d32] text-lg">KSh {total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-[#718096] mt-1">💳 Payment on delivery only</p>
            </div>

            {!showCheckout ? (
              <button onClick={() => setShowCheckout(true)}
                className="w-full bg-[#2e7d32] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#256d2b] transition-colors">
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#2d3748] mb-1">Full Name *</label>
                  <input type="text" name="full_name" value={form.full_name} onChange={handleChange} required
                    className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2d3748] mb-1">Phone *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                    className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2d3748] mb-1">
                    <span className="flex items-center gap-1"><FiMapPin size={12} /> Delivery Address *</span>
                  </label>
                  <input type="text" name="address" value={form.address} onChange={handleChange} required
                    className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F]"
                    placeholder="Enter your delivery location" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2d3748] mb-1">Delivery Notes</label>
                  <textarea name="delivery_notes" value={form.delivery_notes} onChange={handleChange} rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#8FBC8F] resize-none"
                    placeholder="Any special instructions..." />
                </div>
                <button type="submit"
                  className="w-full bg-[#2e7d32] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#256d2b] transition-colors">
                  Place Order (Pay on Delivery)
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}