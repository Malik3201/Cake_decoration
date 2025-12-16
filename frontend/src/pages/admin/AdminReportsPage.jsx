import { useState } from 'react';
import api from '../../utils/api.js';

const AdminReportsPage = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadCsv = async type => {
    setLoading(true);
    setError(null);
    try {
      const url =
        type === 'orders'
          ? '/api/reports/orders'
          : '/api/reports/products';
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const { data } = await api.get(url, {
        params,
        responseType: 'blob',
      });
      const blob = new Blob([data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${type}-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to download CSV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-500">
          Export orders and products with flexible date ranges.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="bg-white border border-pink-100 rounded-2xl p-4 shadow-sm space-y-3 max-w-xl">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-700">From</label>
            <input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
            />
          </div>
          <div>
            <label className="text-sm text-slate-700">To</label>
            <input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => downloadCsv('orders')}
            className="inline-flex items-center px-4 py-2 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-[0_12px_24px_rgba(244,114,182,0.45)] hover:bg-[hsl(340,82%,40%)] transition disabled:opacity-70"
          >
            Download orders CSV
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => downloadCsv('products')}
            className="inline-flex items-center px-4 py-2 rounded-full border border-pink-100 text-[hsl(340,82%,45%)] text-sm bg-white hover:bg-pink-50 transition disabled:opacity-70"
          >
            Download products CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;


