import { useParams } from 'react-router-dom';
import { categories, products } from '../data/mockProducts.js';
import ProductCard from '../components/ProductCard.jsx';

const CategoryPage = () => {
  const { id } = useParams();
  const category = categories.find(c => c.id === id) || {
    id,
    name: id?.replace('-', ' ') || 'Category',
  };

  const categoryProducts = products.filter(p => p.categoryId === id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs text-slate-500">
          Home / <span className="text-[hsl(340,82%,45%)]">{category.name}</span>
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
          {category.name}
        </h1>
        <p className="text-sm text-slate-500 max-w-xl">
          Explore our curated {category.name.toLowerCase()} selection, crafted
          with premium ingredients and delicate pastel designs.
        </p>
      </header>

      {/* Filters (UI only) */}
      <section className="flex flex-wrap gap-3 items-center justify-between border-b border-pink-100 pb-4">
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            className="px-3 py-1.5 rounded-full bg-[hsl(340,82%,45%)] text-white font-medium"
          >
            All
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-full border border-pink-100 text-slate-600 bg-white"
          >
            Best sellers
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-full border border-pink-100 text-slate-600 bg-white"
          >
            On sale
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Sort by</span>
          <select className="text-xs border border-pink-100 rounded-full px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[hsl(340,82%,72%)]">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="new">Newest</option>
          </select>
        </div>
      </section>

      {/* Product grid */}
      <section>
        {categoryProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No products found in this category yet. Check back soon for fresh
            creations
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;


