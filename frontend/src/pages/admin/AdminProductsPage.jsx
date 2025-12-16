import { useEffect, useState } from 'react';
import api from '../../utils/api.js';

const emptyProduct = {
  title: '',
  description: '',
  price: '',
  salePrice: '',
  category: '',
  stock: '',
  featured: false,
  image: '',
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/categories'),
      ]);
      setProducts(prodRes.data.products || prodRes.data || []);
      setCategories(catRes.data.categories || catRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice === '' ? null : Number(form.salePrice),
        stock: Number(form.stock),
        images: form.image ? [form.image] : [],
      };
      if (editingId) {
        await api.put(`/api/products/${editingId}`, payload);
      } else {
        await api.post('/api/products', payload);
      }
      setForm(emptyProduct);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = product => {
    setEditingId(product._id);
    setForm({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      salePrice: product.salePrice ?? '',
      category: product.category?._id || product.category || '',
      stock: product.stock || '',
      featured: product.featured || false,
      image: product.images?.[0] || '',
    });
  };

  const handleDelete = async id => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/products/${id}`);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <p className="text-sm text-slate-500">Manage your catalog.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Working...</p>}

      <form
        className="grid gap-3 md:grid-cols-2 bg-white border border-pink-100 rounded-2xl p-4 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="text-sm text-slate-700">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
          />
        </div>
        <div>
          <label className="text-sm text-slate-700">Category</label>
          <select
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
          >
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-slate-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
          />
        </div>
        <div>
          <label className="text-sm text-slate-700">Price</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
          />
        </div>
        <div>
          <label className="text-sm text-slate-700">Sale price (leave blank for null)</label>
          <input
            name="salePrice"
            type="number"
            min="0"
            step="0.01"
            value={form.salePrice}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
          />
        </div>
        <div>
          <label className="text-sm text-slate-700">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            required
            value={form.stock}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
          />
        </div>
        <div>
          <label className="text-sm text-slate-700">Image URL</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Featured
        </label>
        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-[0_12px_24px_rgba(244,114,182,0.45)] hover:bg-[hsl(340,82%,40%)] transition"
          >
            {editingId ? 'Update product' : 'Add product'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyProduct);
              }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-pink-100 text-[hsl(340,82%,45%)] text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-3">
        {products.map(product => (
          <div
            key={product._id || product.id}
            className="flex items-center justify-between rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"
          >
            <div className="space-y-1">
              <p className="font-semibold text-slate-900 text-sm">{product.title}</p>
              <p className="text-xs text-slate-500 line-clamp-1">
                {product.description}
              </p>
              <p className="text-sm text-[hsl(340,82%,45%)] font-semibold">
                ${Number(product.salePrice ?? product.price).toFixed(2)}
                {product.salePrice && (
                  <span className="text-xs text-slate-400 line-through ml-2">
                    ${Number(product.price).toFixed(2)}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleEdit(product)}
                className="px-3 py-1.5 rounded-full bg-pink-50 text-[hsl(340,82%,45%)] text-xs"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(product._id || product.id)}
                className="px-3 py-1.5 rounded-full bg-white border border-pink-100 text-xs text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductsPage;



