import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatAUD } from '../utils/currency.js';

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  paid: {
    label: 'Paid',
    color: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
};

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/api/orders/me');
        setOrders(data.orders || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-sm text-slate-500">
        Please login to view your orders.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Order History</h1>
        <p className="text-sm text-slate-500 mt-1">Track and manage your recent purchases</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[hsl(340,82%,45%)] border-r-transparent"></div>
            <p className="mt-4 text-sm text-slate-500">Loading orders...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-2xl border border-pink-100 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-600 mb-2">No orders yet</p>
          <p className="text-sm text-slate-500 mb-4">Start shopping to see your orders here</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-sm hover:bg-[hsl(340,82%,40%)] transition"
          >
            Browse Products
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map(order => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-AU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const orderTime = new Date(order.createdAt).toLocaleTimeString('en-AU', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <Link
                to={`/orders/${order._id}`}
                key={order._id}
                className="block rounded-2xl border border-pink-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${status.dot}`}></div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {orderDate} at {orderTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span>{order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}</span>
                      {order.paymentStatus && (
                        <span className="capitalize">
                          Payment: {order.paymentStatus === 'succeeded' ? 'Completed' : order.paymentStatus}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-[hsl(340,82%,38%)]">
                      {formatAUD(order.totalAmount || 0)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">View details →</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
