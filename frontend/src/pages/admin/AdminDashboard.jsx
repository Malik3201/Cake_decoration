import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import { formatAUD } from '../../utils/currency.js';

const cardClasses =
  'rounded-2xl border border-pink-100 bg-white p-5 shadow-[0_14px_30px_rgba(244,114,182,0.18)]';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, salesRes] = await Promise.all([
          api.get('/api/analytics/summary'),
          api.get('/api/analytics/sales?range=monthly'),
        ]);
        setSummary(summaryRes.data.stats || {});
        setSales(salesRes.data.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Sales and store performance.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Loading...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={cardClasses}>
          <p className="text-xs text-slate-500">Total revenue</p>
          <p className="text-2xl font-semibold text-[hsl(340,82%,45%)]">
            {formatAUD(summary?.totalRevenue || 0)}
          </p>
        </div>
        <div className={cardClasses}>
          <p className="text-xs text-slate-500">Orders</p>
          <p className="text-2xl font-semibold text-slate-900">
            {summary?.ordersCount ?? 0}
          </p>
        </div>
        <div className={cardClasses}>
          <p className="text-xs text-slate-500">Customers</p>
          <p className="text-2xl font-semibold text-slate-900">
            {summary?.customersCount ?? 0}
          </p>
        </div>
      </div>

      <div className={cardClasses}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Monthly sales</h2>
        </div>
        {sales.length === 0 ? (
          <p className="text-sm text-slate-500">No sales data yet.</p>
        ) : (
          <div className="space-y-2">
            {sales.map(row => (
              <div
                key={row.period}
                className="flex items-center justify-between text-sm text-slate-700"
              >
                <span>{row.period}</span>
                <span className="font-semibold text-[hsl(340,82%,45%)]">
                  {formatAUD(row.revenue || 0)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
