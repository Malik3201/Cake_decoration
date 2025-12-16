import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatAUD } from '../utils/currency.js';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const productId = product._id || product.id;
  const effectivePrice = product.salePrice ?? product.price;
  // Handle both single image string and images array from backend
  const productImage = product.images?.[0] || product.image || 'https://via.placeholder.com/400';

  return (
    <div className="group bg-white rounded-2xl shadow-[0_12px_30px_rgba(244,114,182,0.12)] overflow-hidden border border-pink-50 flex flex-col hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(244,114,182,0.2)] transition-transform">
      <div className="relative aspect-[4/3] overflow-hidden bg-pink-50">
        <Link to={`/product/${productId}`}>
          <img
            src={productImage}
            alt={product.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {product.seasonalTag && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-[hsl(340,82%,45%)] shadow-sm">
            {product.seasonalTag}
          </span>
        )}
        {product.salePrice && (
          <span className="absolute right-3 top-3 rounded-full bg-[hsl(340,82%,55%)] px-3 py-1 text-[11px] font-medium text-white shadow-sm">
            On Sale
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <Link to={`/product/${productId}`} className="space-y-1">
          <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm md:text-base">
            {product.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2">
            {product.description}
          </p>
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[hsl(340,82%,38%)] font-semibold">
              {formatAUD(effectivePrice)}
            </span>
            {product.salePrice !== null && product.salePrice !== undefined && (
              <span className="text-xs text-slate-400 line-through">
                {formatAUD(product.price)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login', { state: { from: `/product/${productId}` } });
              } else {
                addToCart(product);
              }
            }}
            className="text-[11px] px-2 py-1 rounded-full bg-pink-50 text-[hsl(340,82%,40%)] hover:bg-pink-100 transition"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


