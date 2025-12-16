import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { formatAUD } from '../utils/currency.js';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch product details
        const { data } = await api.get(`/api/products/${id}`);
        if (!data.success || !data.product) {
          throw new Error('Product not found');
        }

        const prod = data.product;
        setProduct(prod);

        // Get category info
        const categoryId = prod.category?._id || prod.category;
        if (categoryId) {
          // Fetch category details
          try {
            const catRes = await api.get(`/api/categories/${categoryId}`);
            if (catRes.data.success) {
              setCategory(catRes.data.category);
            }
          } catch (e) {
            // Category fetch failed, continue without it
          }

          // Fetch related products from same category
          try {
            const relatedRes = await api.get(`/api/products?category=${categoryId}`);
            const allRelated = relatedRes.data.products || [];
            // Exclude current product
            const filtered = allRelated.filter(p => (p._id || p.id) !== id);
            setRelatedProducts(filtered.slice(0, 6)); // Show max 6 related products
          } catch (e) {
            console.error('Error fetching related products:', e);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err?.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[hsl(340,82%,45%)] border-r-transparent"></div>
            <p className="mt-4 text-sm text-slate-500">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-sm text-slate-500">
        {error || 'Product not found.'}{' '}
        <Link to="/" className="text-[hsl(340,82%,45%)] font-medium">
          Back to home
        </Link>
      </div>
    );
  }

  const effectivePrice = product.salePrice ?? product.price;
  const productImage = product.images?.[0] || product.image || 'https://via.placeholder.com/600';
  const categoryId = product.category?._id || product.category;
  const categoryName = category?.name || product.category?.name || 'Category';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <p className="text-xs text-slate-500 mb-4">
        Home /{' '}
        {categoryId && (
          <Link to={`/category/${categoryId}`} className="hover:underline">
            {categoryName}
          </Link>
        )}{' '}
        / <span className="text-[hsl(340,82%,45%)]">{product.title}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image gallery */}
        <div className="space-y-3">
          <div className="rounded-3xl bg-pink-50 p-3 shadow-[0_18px_45px_rgba(244,114,182,0.35)]">
            <img
              src={productImage}
              alt={product.title}
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.slice(0, 2).map((img, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-pink-50 to-white border border-pink-100 overflow-hidden"
                >
                  <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              {product.title}
            </h1>
            {category && (
              <p className="mt-1 text-xs font-medium text-[hsl(340,82%,45%)]">
                {category.name}
              </p>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-[hsl(340,82%,38%)]">
              {formatAUD(effectivePrice)}
            </span>
            {product.salePrice !== null && product.salePrice !== undefined && (
              <span className="text-sm text-slate-400 line-through">
                {formatAUD(product.price)}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-3 text-sm text-slate-600">
            <h2 className="font-semibold text-slate-900 text-sm">
              Customization ideas
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Choose your message and topper style.</li>
              <li>Match the color palette to your party theme.</li>
              <li>Option to add matching cupcakes or dessert table items.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login', { state: { from: `/product/${id}` } });
                } else {
                  addToCart(product);
                }
              }}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-[0_16px_32px_rgba(244,114,182,0.6)] hover:bg-[hsl(340,82%,40%)] transition"
            >
              Add to cart
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-pink-100 bg-white text-sm font-medium text-[hsl(340,82%,45%)] hover:bg-pink-50 transition"
            >
              Ask for customization ideas
            </button>
          </div>

          <div className="border-t border-pink-100 pt-4 text-xs text-slate-500 space-y-1">
            <p>• Baked fresh within 24 hours of your selected date.</p>
            <p>• Keep refrigerated and serve at room temperature.</p>
            {product.stock !== undefined && (
              <p>• {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products from Same Category */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            More from {categoryName}
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct._id || relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;

