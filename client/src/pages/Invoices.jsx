import { useEffect, useState } from 'react';
import { getInvoices, updateInvoice, deleteInvoice, sendReminder } from '../api';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const getDaysLabel = (due_date, status) => {
  if (status === 'paid') return null;
  const today = new Date();
  const due = new Date(due_date);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (diff > 0) return { text: `${diff} days left`, color: 'text-blue-500' };
  if (diff === 0) return { text: 'Due today!', color: 'text-orange-500' };
  return { text: `${Math.abs(diff)} days overdue`, color: 'text-red-500' };
};

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('newest');

  const load = () =>
    getInvoices(search, status).then(r => {
      let data = r.data;
      if (sort === 'amount_high') data = [...data].sort((a, b) => b.amount - a.amount);
      if (sort === 'amount_low') data = [...data].sort((a, b) => a.amount - b.amount);
      if (sort === 'due_date') data = [...data].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      setInvoices(data);
    });

  useEffect(() => { load(); }, [search, status, sort]);

  const markPaid = async (id) => {
    await updateInvoice(id, 'paid');
    toast.success('Marked as paid!');
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this invoice?')) return;
    await deleteInvoice(id);
    toast.success('Deleted!');
    load();
  };

  const remind = async (id) => {
    try {
      await sendReminder(id);
      toast.success('Reminder sent!');
    } catch {
      toast.error('Failed to send reminder');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Invoices</h1>

      {/* Search, Filter, Sort */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="newest">Newest First</option>
          <option value="due_date">Due Date</option>
          <option value="amount_high">Amount: High to Low</option>
          <option value="amount_low">Amount: Low to High</option>
        </select>
      </div>

      {/* Empty State */}
      {invoices.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-500 text-lg font-medium">No invoices found</p>
          <p className="text-gray-400 text-sm mt-1">Try changing your search or filter, or create a new invoice</p>
        </div>
      )}

      {/* Invoice Cards */}
      <div className="flex flex-col gap-4">
        {invoices.map(inv => {
          const countdown = getDaysLabel(inv.due_date, inv.status);
          return (
            <div key={inv.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between hover:shadow-md transition">
              <div>
                <p className="font-semibold text-gray-800">{inv.client_name}</p>
                <p className="text-sm text-gray-500">{inv.client_email}</p>
                <p className="text-sm text-gray-500">Due: {inv.due_date}</p>
                {countdown && (
                  <p className={`text-xs font-semibold mt-1 ${countdown.color}`}>
                    ⏰ {countdown.text}
                  </p>
                )}
                {inv.description && <p className="text-sm text-gray-400">{inv.description}</p>}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <p className="text-lg font-bold text-gray-800">₹{inv.amount}</p>
                <StatusBadge status={inv.status} />
                {inv.status !== 'paid' && (
                  <>
                    <button onClick={() => remind(inv.id)}
                      className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-100 transition">
                      Send Reminder
                    </button>
                    <button onClick={() => markPaid(inv.id)}
                      className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-lg hover:bg-green-100 transition">
                      Mark Paid
                    </button>
                  </>
                )}
                <button onClick={() => remove(inv.id)}
                  className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-lg hover:bg-red-100 transition">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
