import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import { formatAUD } from '../../utils/currency.js';

const AdminSalesPage = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [form, setForm] = useState({
    label: '',
    discountPercent: 10,
    startDate: '',
    endDate: '',
    productIds: [],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesRes, productsRes] = await Promise.all([
        api.get('/api/sales'),
        api.get('/api/products'),
      ]);
      setSales(salesRes.data.sales || []);
      setProducts(productsRes.data.products || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({
      label: '',
      discountPercent: 10,
      startDate: '',
      endDate: '',
      productIds: [],
    });
    setEditingSale(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (sale) => {
    setEditingSale(sale);
    setForm({
      label: sale.label,
      discountPercent: sale.discountPercent,
      startDate: sale.startDate.slice(0, 16),
      endDate: sale.endDate.slice(0, 16),
      productIds: sale.products.map(p => p._id || p),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        label: form.label,
        discountPercent: Number(form.discountPercent),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        products: form.productIds,
      };

      if (editingSale) {
        await api.put(`/api/sales/${editingSale._id}`, payload);
      } else {
        await api.post('/api/sales', payload);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to save sale');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this sale?')) return;
    try {
      await api.delete(`/api/sales/${id}`);
      fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete sale');
    }
  };

  const toggleProduct = (productId) => {
    setForm(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId],
    }));
  };

  const isActiveNow = (sale) => {
    const now = new Date();
    return new Date(sale.startDate) <= now && new Date(sale.endDate) >= now;
  };

  if (loading) {
    return <div className="text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Sales</h1>
          <p className="text-sm text-slate-500">Manage promotional sales and discounts</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-sm hover:bg-[hsl(340,82%,40%)] transition"
        >
          Create Sale
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {sales.length === 0 ? (
        <div className="rounded-2xl border border-pink-100 bg-white p-8 text-center">
          <p className="text-slate-600">No sales created yet</p>
          <p className="text-sm text-slate-500 mt-1">Create a sale to offer discounts on products</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map(sale => (
            <div
              key={sale._id}
              className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900">{sale.label}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-[hsl(340,82%,45%)] font-medium">
                      {sale.discountPercent}% OFF
                    </span>
                    {isActiveNow(sale) && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {new Date(sale.startDate).toLocaleString()} - {new Date(sale.endDate).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600">
                    {sale.products.length} product{sale.products.length !== 1 ? 's' : ''} in this sale
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(sale)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-pink-200 text-slate-600 hover:bg-pink-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sale._id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {editingSale ? 'Edit Sale' : 'Create Sale'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-slate-700 font-medium">Sale Label</label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={e => setForm(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g. Summer Special, Christmas Sale"
                  className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
                />
              </div>

              <div>
                <label className="text-sm text-slate-700 font-medium">Discount Percentage</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="90"
                  value={form.discountPercent}
                  onChange={e => setForm(prev => ({ ...prev, discountPercent: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-700 font-medium">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.startDate}
                    onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-700 font-medium">End Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.endDate}
                    onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-700 font-medium mb-2 block">Select Products</label>
                <div className="border border-pink-100 rounded-xl max-h-48 overflow-y-auto p-2 space-y-1">
                  {products.map(product => (
                    <label
                      key={product._id}
                      className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-pink-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.productIds.includes(product._id)}
                        onChange={() => toggleProduct(product._id)}
                        className="rounded text-[hsl(340,82%,45%)]"
                      />
                      <span className="text-sm text-slate-700">{product.title}</span>
                      <span className="text-xs text-slate-500">{formatAUD(product.price)}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">{form.productIds.length} selected</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[hsl(340,82%,45%)] text-white text-sm font-medium hover:bg-[hsl(340,82%,40%)]"
                >
                  {editingSale ? 'Update Sale' : 'Create Sale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSalesPage;
