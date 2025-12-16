import { useEffect, useState } from 'react';

// Stored only in localStorage on the frontend for now.
// In production you'd likely manage this via a secure backend-admin config.

const STORAGE_KEY = 'db_admin_ai_settings';

const AdminAiSettingsPage = () => {
  const [form, setForm] = useState({
    apiKey: '',
    model: '',
    baseUrl: '',
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setForm({
          apiKey: parsed.apiKey || '',
          model: parsed.model || '',
          baseUrl: parsed.baseUrl || '',
        });
      } catch {
        // ignore
      }
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setTestResult('Settings saved locally for this browser.');
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Say hello in one short sentence.' }],
        }),
      });
      if (!res.ok) {
        setTestResult('Test call failed. Check backend AI config.');
      } else {
        setTestResult('AI endpoint responded successfully.');
      }
    } catch {
      setTestResult('Could not reach AI endpoint.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">AI Settings</h1>
        <p className="text-sm text-slate-500">
          Configure the DecoraBake assistant connection. Backend still uses .env.
        </p>
      </div>

      <div className="max-w-xl bg-white border border-pink-100 rounded-2xl p-4 space-y-3 shadow-sm">
        <div>
          <label className="text-sm text-slate-700">AI API key (frontend note)</label>
          <input
            name="apiKey"
            type="password"
            value={form.apiKey}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            This is stored only in your browser for reference; backend still uses server-side
            environment variables.
          </p>
        </div>
        <div>
          <label className="text-sm text-slate-700">Model name</label>
          <input
            name="model"
            value={form.model}
            onChange={handleChange}
            placeholder="e.g. gpt-4.1-mini"
            className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
          />
        </div>
        <div>
          <label className="text-sm text-slate-700">Base URL</label>
          <input
            name="baseUrl"
            value={form.baseUrl}
            onChange={handleChange}
            placeholder="https://api.openai.com/v1"
            className="mt-1 w-full rounded-lg border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-[0_12px_24px_rgba(244,114,182,0.45)] hover:bg-[hsl(340,82%,40%)] transition"
          >
            Save settings
          </button>
          <button
            type="button"
            disabled={testing}
            onClick={handleTest}
            className="inline-flex items-center px-4 py-2 rounded-full border border-pink-100 text-[hsl(340,82%,45%)] text-sm bg-white hover:bg-pink-50 transition disabled:opacity-70"
          >
            {testing ? 'Testing...' : 'Test API'}
          </button>
        </div>

        {testResult && (
          <p className="text-sm text-slate-500 mt-2">
            {testResult}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminAiSettingsPage;


