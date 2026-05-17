import { useEffect, useState } from 'react';
import { getDashboard, getInvoices, sendReminder } from '../api';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const load = () => {
    getDashboard().then(r => setStats(r.data));
    getInvoices('', 'all').then(r => setRecent(r.data.slice(0, 5)));
  };

  useEffect(() => { load(); }, []);

  const bulkRemind = async () => {
    setBulkLoading(true);
    try {
      const overdue = await getInvoices('', 'overdue');
      const list = overdue.data;
      if (list.length === 0) {
        toast('No overdue invoices found!', { icon: 'ℹ️' });
        setBulkLoading(false);
        return;
      }
      await Promise.all(list.map(inv => sendReminder(inv.id)));
      toast.success(`Sent reminders to ${list.length} overdue clients!`);
    } catch {
      toast.error('Failed to send some reminders');
    }
    setBulkLoading(false);
  };

  if (!stats) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
  );

  const cards = [
    { label: 'Total Invoices', value: stats.totalInvoices, color: 'from-indigo-500 to-indigo-600', icon: '📄' },
    { label: 'Unpaid Amount', value: `₹${stats.unpaidAmount.toFixed(2)}`, color: 'from-amber-400 to-amber-500', icon: '💰' },
    { label: 'Overdue', value: stats.overdueCount, color: 'from-red-400 to-red-500', icon: '⚠️' },
    { label: 'Paid', value: stats.paidCount, color: 'from-emerald-400 to-emerald-500', icon: '✅' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back 👋</h1>
          <p className="text-indigo-200 mb-6">Here's what's happening with your invoices today.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/invoices/new"
              className="bg-white text-indigo-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition">
              + New Invoice
            </Link>
            <button
              onClick={bulkRemind}
              disabled={bulkLoading}
              className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50 border border-red-400">
              {bulkLoading ? 'Sending...' : '🔔 Remind All Overdue'}
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, color, icon }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-xl p-5 text-white shadow-sm`}>
            <p className="text-2xl mb-2">{icon}</p>
            <p className="text-sm font-medium opacity-90 mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Invoices */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Recent Invoices</h2>
          <Link to="/invoices" className="text-sm text-indigo-600 hover:underline font-medium">View all →</Link>
        </div>

        {recent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-5xl mb-3">📄</p>
            <p className="text-gray-500 font-medium">No invoices yet</p>
            <p className="text-gray-400 text-sm mb-4">Get started by creating your first invoice</p>
            <Link to="/invoices/new"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">
              + Create Invoice
            </Link>
          </div>
        )}

        <div className="flex flex-col divide-y divide-gray-100">
          {recent.map(inv => (
            <div key={inv.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {inv.client_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{inv.client_name}</p>
                  <p className="text-xs text-gray-400">{inv.client_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-gray-700">₹{inv.amount}</p>
                <StatusBadge status={inv.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

