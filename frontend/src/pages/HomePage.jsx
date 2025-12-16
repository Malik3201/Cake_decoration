import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import ProductSlider from '../components/ProductSlider.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SaleSection from '../components/SaleSection.jsx';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeSales, setActiveSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories, products, and active sales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories, products, and sales in parallel
        const [categoriesRes, productsRes, salesRes] = await Promise.all([
          api.get('/api/categories'),
          api.get('/api/products'),
          api.get('/api/sales/active'),
        ]);
        
        const cats = categoriesRes.data.categories || [];
        setCategories(cats);
        
        const allProducts = productsRes.data.products || [];
        
        // Set active sales
        setActiveSales(salesRes.data.sales || []);

        // Group products by category
        const grouped = {};
        cats.forEach(cat => {
          const catProducts = allProducts.filter(p => 
            p.category && (p.category._id === cat._id || p.category === cat._id)
          );
          if (catProducts.length > 0) {
            grouped[cat._id] = catProducts;
          }
        });
        setProductsByCategory(grouped);

        // Get featured products
        const featured = allProducts.filter(p => p.featured === true);
        setFeaturedProducts(featured);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[hsl(340,82%,45%)] border-r-transparent"></div>
            <p className="mt-4 text-sm text-slate-500">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-pink-50 text-[11px] font-medium text-[hsl(340,82%,45%)] shadow-sm">
            Handcrafted cakes • Same-day pickup on select items
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
            Celebrate every moment with
            <span className="text-[hsl(340,82%,45%)]"> bespoke cakes </span>
            from DecoraBake.
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl">
            From intimate birthdays to grand weddings, our decorators craft
            dreamy cakes, cupcakes, and sweet tables with pastel-perfect
            details.
          </p>
          <div className="flex flex-wrap gap-3">
            {categories.length > 0 && (
              <>
                <Link
                  to={`/category/${categories[0]._id}`}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-[0_14px_30px_rgba(244,114,182,0.5)] hover:bg-[hsl(340,82%,40%)] transition"
                >
                  Shop {categories[0].name.toLowerCase()}
                </Link>
                {categories[1] && (
                  <Link
                    to={`/category/${categories[1]._id}`}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-pink-200 bg-white text-sm font-medium text-[hsl(340,82%,45%)] hover:bg-pink-50 transition"
                  >
                    Explore {categories[1].name.toLowerCase()}
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
        <div className="relative">
          <div className="rounded-[32px] bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 p-3 shadow-[0_20px_60px_rgba(244,114,182,0.3)]">
            <img
              src="https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Decorated celebration cake"
              className="w-full h-full rounded-3xl object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-3 bg-white/90 rounded-2xl px-3 py-2 shadow-md text-xs text-slate-600">
            Custom colors and toppers available
          </div>
        </div>
      </section>

      {/* Active Sales Section */}
      {activeSales.length > 0 && (
        <div className="space-y-6">
          {activeSales.map(sale => (
            <SaleSection key={sale._id} sale={sale} />
          ))}
        </div>
      )}

      {/* Category-wise Product Sliders (Netflix-style) */}
      {categories.map(category => {
        const categoryProducts = productsByCategory[category._id] || [];
        if (categoryProducts.length === 0) return null;

        return (
          <ProductSlider
            key={category._id}
            title={category.name}
            products={categoryProducts}
            autoSlideInterval={5000}
          />
        );
      })}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              Featured this week
            </h2>
            <Link
              to="/category"
              className="text-xs font-medium text-[hsl(340,82%,45%)] hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.slice(0, 6).map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Seasonal Section */}
      <section className="rounded-3xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 p-6 md:p-8 shadow-[0_20px_50px_rgba(244,114,182,0.35)] flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            Seasonal & limited editions
          </h2>
          <p className="text-sm text-slate-600 max-w-md">
            Discover limited-run flavors and designs curated for the current
            season. Perfect for making your celebration feel extra special.
          </p>
          <Link
            to="/category"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-white text-xs font-medium text-[hsl(340,82%,45%)] shadow-sm hover:bg-pink-50 transition"
          >
            View seasonal collection
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full md:w-80">
          {featuredProducts.slice(0, 2).map(product => (
            <div
              key={product._id || product.id}
              className="overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-sm"
            >
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/200'}
                alt={product.title}
                className="h-24 w-full object-cover"
              />
              <div className="p-2">
                <p className="text-[11px] font-medium text-slate-800 line-clamp-2">
                  {product.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="rounded-3xl border border-pink-100 bg-white p-6 md:p-8 shadow-[0_14px_40px_rgba(148,163,184,0.18)] flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">
            Get sweet inspiration in your inbox
          </h3>
          <p className="text-sm text-slate-500 max-w-md">
            Be the first to know about seasonal launches, tasting events, and
            limited-edition designs.
          </p>
        </div>
        <form
          className="w-full md:w-auto flex flex-col sm:flex-row gap-3"
          onSubmit={e => {
            e.preventDefault();
            // Newsletter functionality can be added later
          }}
        >
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 rounded-full border border-pink-100 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-[0_14px_30px_rgba(244,114,182,0.5)] hover:bg-[hsl(340,82%,40%)] transition"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
