import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatAUD } from '../utils/currency.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const SaleSection = ({ sale }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(sale.endDate) - new Date();
    if (difference <= 0) {
      return { expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [sale.endDate]);

  if (timeLeft.expired) return null;

  // Calculate discounted prices
  const calculateSalePrice = (price) => {
    return price * (1 - sale.discountPercent / 100);
  };

  return (
    <section className="rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 p-6 md:p-8 shadow-[0_20px_60px_rgba(244,114,182,0.35)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(340,82%,45%)] text-white text-xs font-medium mb-2">
            <span>{sale.discountPercent}% OFF</span>
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
            {sale.label}
          </h2>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 mr-2">Ends in:</span>
          <div className="flex gap-1">
            {timeLeft.days > 0 && (
              <div className="flex flex-col items-center px-2 py-1 bg-white/80 rounded-lg shadow-sm">
                <span className="text-lg font-bold text-[hsl(340,82%,45%)]">{timeLeft.days}</span>
                <span className="text-[10px] text-slate-500">days</span>
              </div>
            )}
            <div className="flex flex-col items-center px-2 py-1 bg-white/80 rounded-lg shadow-sm">
              <span className="text-lg font-bold text-[hsl(340,82%,45%)]">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-500">hrs</span>
            </div>
            <div className="flex flex-col items-center px-2 py-1 bg-white/80 rounded-lg shadow-sm">
              <span className="text-lg font-bold text-[hsl(340,82%,45%)]">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-500">min</span>
            </div>
            <div className="flex flex-col items-center px-2 py-1 bg-white/80 rounded-lg shadow-sm">
              <span className="text-lg font-bold text-[hsl(340,82%,45%)]">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-500">sec</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {sale.products.slice(0, 10).map(product => {
          const originalPrice = product.price;
          const salePrice = calculateSalePrice(originalPrice);
          const savings = originalPrice - salePrice;
          const productId = product._id || product.id;

          return (
            <div
              key={productId}
              className="bg-white/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <Link to={`/product/${productId}`} className="block">
                <div className="relative aspect-square bg-pink-50">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200'}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Sale Badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-[hsl(340,82%,45%)] text-white text-[10px] font-bold rounded-full">
                    -{sale.discountPercent}%
                  </div>
                </div>
              </Link>
              <div className="p-3">
                <Link to={`/product/${productId}`}>
                  <h3 className="text-xs font-medium text-slate-900 line-clamp-2 mb-2">
                    {product.title}
                  </h3>
                </Link>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-sm font-bold text-[hsl(340,82%,45%)]">
                    {formatAUD(salePrice)}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    {formatAUD(originalPrice)}
                  </span>
                </div>
                <div className="text-[10px] text-green-600 font-medium mb-2">
                  Save {formatAUD(savings)}
                </div>
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      addToCart({ ...product, salePrice });
                    } else {
                      window.location.href = '/login';
                    }
                  }}
                  className="w-full py-1.5 text-[10px] font-medium bg-pink-50 text-[hsl(340,82%,45%)] rounded-lg hover:bg-pink-100 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {sale.products.length > 10 && (
        <div className="text-center mt-4">
          <span className="text-sm text-slate-500">
            +{sale.products.length - 10} more products on sale
          </span>
        </div>
      )}
    </section>
  );
};

export default SaleSection;
