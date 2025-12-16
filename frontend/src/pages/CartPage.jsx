import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatAUD } from '../utils/currency.js';

// Helper to get consistent product ID
const getProductId = (item) => item._id || item.id;

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, totals } = useCart();

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-3">
        <p className="text-sm text-slate-500">Your cart is empty.</p>
        <Link
          to="/"
          className="inline-flex px-4 py-2 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm shadow-[0_12px_26px_rgba(244,114,182,0.45)] hover:bg-[hsl(340,82%,40%)] transition"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        {items.map(item => {
          const itemId = getProductId(item);
          return (
          <div
            key={itemId}
            className="flex gap-4 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"
          >
            <div className="h-24 w-24 rounded-xl overflow-hidden bg-pink-50">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm md:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(itemId)}
                  className="text-xs text-slate-400 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => updateQuantity(itemId, item.quantity - 1)}
                    className="h-8 w-8 rounded-full border border-pink-200 text-slate-600"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(itemId, item.quantity + 1)}
                    className="h-8 w-8 rounded-full border border-pink-200 text-slate-600"
                  >
                    +
                  </button>
                </div>
                <div className="text-sm font-semibold text-[hsl(340,82%,38%)]">
                  {formatAUD((item.salePrice ?? item.price) * item.quantity)}
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>

      <aside className="rounded-2xl border border-pink-100 bg-white p-5 shadow-[0_14px_30px_rgba(244,114,182,0.2)] space-y-4 h-fit">
        <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <span>{formatAUD(totals.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Delivery</span>
          <span className="text-xs text-slate-400">Calculated at checkout</span>
        </div>
        <div className="border-t border-pink-100 pt-3 flex items-center justify-between font-semibold text-slate-900">
          <span>Total</span>
          <span className="text-[hsl(340,82%,38%)]">{formatAUD(totals.subtotal)}</span>
        </div>
        <Link
          to="/checkout"
          className="block text-center w-full px-4 py-3 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-[0_14px_30px_rgba(244,114,182,0.5)] hover:bg-[hsl(340,82%,40%)] transition"
        >
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
};

export default CartPage;


