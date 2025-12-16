import { useEffect, useState } from 'react';
import api from '../../utils/api.js';

const emptyCategory = {
  name: '',
  description: '',
};

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyCategory);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/categories');
      setCategories(data.categories || data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await api.put(`/api/categories/${editingId}`, form);
      } else {
        await api.post('/api/categories', form);
      }
      setForm(emptyCategory);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = cat => {
    setEditingId(cat._id || cat.id);
    setForm({
      name: cat.name || '',
      description: cat.description || '',
    });
  };

  const handleDelete = async id => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/categories/${id}`);
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
        <p className="text-sm text-slate-500">Organize your catalog.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Working...</p>}

      <form
        className="bg-white border border-pink-100 rounded-2xl p-4 shadow-sm space-y-3"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="text-sm text-slate-700">Name</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
          />
        </div>
        <div>
          <label className="text-sm text-slate-700">Description</label>
          <textarea
            name="description"
            rows={2}
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-[0_12px_24px_rgba(244,114,182,0.45)] hover:bg-[hsl(340,82%,40%)] transition"
          >
            {editingId ? 'Update category' : 'Add category'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyCategory);
              }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-pink-100 text-[hsl(340,82%,45%)] text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-3">
        {categories.map(cat => (
          <div
            key={cat._id || cat.id}
            className="flex items-center justify-between rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="font-semibold text-slate-900 text-sm">{cat.name}</p>
              {cat.description && (
                <p className="text-xs text-slate-500 line-clamp-1">
                  {cat.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleEdit(cat)}
                className="px-3 py-1.5 rounded-full bg-pink-50 text-[hsl(340,82%,45%)] text-xs"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(cat._id || cat.id)}
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

export default AdminCategoriesPage;


