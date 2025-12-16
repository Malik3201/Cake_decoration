import { useEffect, useState } from 'react';
import api from '../../utils/api.js';

const statusOptions = ['pending', 'paid', 'shipped', 'delivered'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/api/orders');
      setOrders(data.orders || data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      await api.patch(`/api/orders/${id}/status`, { status });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-500">View and manage all orders.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Working...</p>}

      <div className="space-y-3">
        {orders.map(order => (
          <div
            key={order._id}
            className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div>
              <p className="text-sm text-slate-700">Order ID: {order._id}</p>
              <p className="text-xs text-slate-500">
                {new Date(order.createdAt).toLocaleString()} •{' '}
                {order.user?.email || 'Guest'}
              </p>
              <p className="text-sm text-slate-700 mt-1">
                {order.items?.length || 0} items •{' '}
                <span className="font-semibold text-[hsl(340,82%,45%)]">
                  ${Number(order.totalAmount || 0).toFixed(2)}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={order.status}
                onChange={e => updateStatus(order._id, e.target.value)}
                className="text-xs border border-pink-100 rounded-full px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[hsl(340,82%,72%)]"
              >
                {statusOptions.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;


