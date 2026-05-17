import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInvoice } from '../api';
import toast from 'react-hot-toast';

export default function NewInvoice() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    client_name: '', client_email: '',
    amount: '', due_date: '', description: ''
  });
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.client_name || !form.client_email || !form.amount || !form.due_date) {
      return toast.error('Please fill all required fields');
    }
    setLoading(true);
    try {
      await createInvoice(form);
      toast.success('Invoice created successfully!');
      navigate('/invoices');
    } catch {
      toast.error('Failed to create invoice');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Create New Invoice</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details below to create a new invoice</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Form header strip */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
          <p className="text-white font-semibold">Invoice Details</p>
          <p className="text-indigo-200 text-xs mt-1">All fields marked * are required</p>
        </div>

        <div className="p-6 flex flex-col gap-5">

          {/* Client Name + Email side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
              <input
                type="text"
                name="client_name"
                value={form.client_name}
                onChange={handle}
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Email *</label>
              <input
                type="email"
                name="client_email"
                value={form.client_email}
                onChange={handle}
                placeholder="john@example.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Amount + Due Date side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handle}
                placeholder="5000"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handle}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handle}
              placeholder="What is this invoice for?"
              rows={3}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Creating...' : '✓ Create Invoice'}
            </button>
            <button
              onClick={() => navigate('/invoices')}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
