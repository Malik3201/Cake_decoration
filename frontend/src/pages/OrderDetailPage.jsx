import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/api/orders/me/${id}`);
        setOrder(data.order);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-sm text-slate-500">
        Please login to view this order.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[hsl(340,82%,45%)] border-r-transparent"></div>
            <p className="mt-4 text-sm text-slate-500">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-sm text-red-500 mb-4">{error || 'Order not found.'}</p>
        <Link
          to="/orders"
          className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium hover:bg-[hsl(340,82%,40%)] transition"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/orders"
            className="text-xs text-slate-500 hover:text-[hsl(340,82%,45%)] mb-2 inline-block"
          >
            ← Back to orders
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900">Order Details</h1>
          <p className="text-sm text-slate-500 mt-1">Order #{order._id.slice(-8).toUpperCase()}</p>
          <p className="text-xs text-slate-400 mt-1">{orderDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${status.dot}`}></div>
          <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items?.map((item, idx) => {
                const itemPrice = item.unitSalePrice ?? item.unitPrice;
                const itemTotal = itemPrice * item.quantity;
                return (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-4 pb-3 border-b border-pink-50 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">
                        {item.product?.title || 'Product'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                      {item.unitSalePrice && (
                        <p className="text-xs text-slate-400 mt-1 line-through">
                          {formatAUD(item.unitPrice)} each
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[hsl(340,82%,38%)]">
                        {formatAUD(itemTotal)}
                      </p>
                      {item.unitSalePrice && (
                        <p className="text-xs text-slate-400 line-through">
                          {formatAUD(item.unitPrice * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm space-y-4 h-fit">
          <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items</span>
              <span className="font-medium">{order.items?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Payment Status</span>
              <span className="font-medium capitalize">
                {order.paymentStatus === 'succeeded' ? 'Completed' : order.paymentStatus || 'Pending'}
              </span>
            </div>
            {order.paidAt && (
              <div className="flex items-center justify-between text-slate-600">
                <span>Paid On</span>
                <span className="font-medium text-xs">
                  {new Date(order.paidAt).toLocaleDateString('en-AU')}
                </span>
              </div>
            )}
            <div className="border-t border-pink-100 pt-3 flex items-center justify-between font-semibold text-slate-900">
              <span>Total</span>
              <span className="text-[hsl(340,82%,38%)]">{formatAUD(order.totalAmount || 0)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetailPage;
