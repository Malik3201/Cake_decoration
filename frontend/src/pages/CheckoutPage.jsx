import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatAUD } from '../utils/currency.js';
import { CashIcon, CreditCardIcon } from '../utils/icons.jsx';
import api from '../utils/api.js';

const CheckoutPage = () => {
  const { items, totals, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Create order via API
      const orderData = {
        items: items.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: form.fullName,
          street: form.address,
          city: form.city,
          state: form.state,
          postcode: form.postalCode,
          phone: form.phone,
        },
      };
      
      await api.post('/api/orders', orderData);
      clearCart();
      navigate('/checkout/success');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create order. Please try again.');
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-600 mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-sm hover:bg-[hsl(340,82%,40%)] transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
      <form className="lg:col-span-2 space-y-6" onSubmit={handleSubmit}>
        {/* Shipping Information */}
        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Shipping Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-700 font-medium">Full name</label>
              <input
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-700 font-medium">Phone</label>
              <input
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-700 font-medium">Street address</label>
            <input
              name="address"
              required
              value={form.address}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-700 font-medium">City</label>
              <input
                name="city"
                required
                value={form.city}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-700 font-medium">State</label>
              <input
                name="state"
                required
                value={form.state}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-sm text-slate-700 font-medium">Postal code</label>
              <input
                name="postalCode"
                required
                value={form.postalCode}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Payment Method</h2>
          <div className="space-y-3">
            {/* Cash on Delivery - Default */}
            <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-[hsl(340,82%,45%)] bg-pink-50 cursor-pointer hover:bg-pink-100 transition">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-[hsl(340,82%,45%)] focus:ring-[hsl(340,82%,45%)]"
              />
              <CashIcon className="w-5 h-5 text-[hsl(340,82%,45%)]" />
              <div className="flex-1">
                <p className="font-medium text-slate-900">Cash on Delivery</p>
                <p className="text-xs text-slate-500">Pay when you receive your order</p>
              </div>
            </label>

            {/* Card Payment - Coming Soon */}
            <label className="flex items-center gap-3 p-4 rounded-xl border border-pink-200 bg-white cursor-not-allowed opacity-60">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                disabled
                className="w-4 h-4"
              />
              <CreditCardIcon className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-600">Credit or Debit Card</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs text-slate-400">Visa, MasterCard, and other cards</p>
              </div>
            </label>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-[0_16px_32px_rgba(244,114,182,0.6)] hover:bg-[hsl(340,82%,40%)] transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? 'Processing...' : 'Place Order'}
        </button>
      </form>

      {/* Order Summary */}
      <aside className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm space-y-4 h-fit">
        <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
        <div className="space-y-3">
          {items.map(item => {
            const itemPrice = item.salePrice ?? item.price;
            const itemTotal = itemPrice * item.quantity;
            return (
              <div key={item._id || item.id} className="flex justify-between text-sm">
                <span className="text-slate-700">
                  {item.title} × {item.quantity}
                </span>
                <span className="text-slate-900 font-semibold">
                  {formatAUD(itemTotal)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="border-t border-pink-100 pt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatAUD(totals.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Delivery</span>
            <span className="text-xs text-slate-400">Calculated at payment</span>
          </div>
          <div className="border-t border-pink-100 pt-3 flex items-center justify-between font-semibold text-slate-900">
            <span>Total</span>
            <span className="text-[hsl(340,82%,38%)]">{formatAUD(totals.subtotal)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CheckoutPage;
