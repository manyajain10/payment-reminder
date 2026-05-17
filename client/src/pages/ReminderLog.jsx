import { useEffect, useState } from 'react';
import { getReminders } from '../api';

export default function ReminderLog() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    getReminders().then(r => setReminders(r.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reminder Log</h1>
      {reminders.length === 0 && (
        <p className="text-gray-500 text-center py-12">No reminders sent yet.</p>
      )}
      <div className="flex flex-col gap-3">
        {reminders.map(r => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-semibold text-gray-800">{r.client_name}</p>
            <p className="text-sm text-gray-500">{r.client_email} — ₹{r.amount}</p>
            <p className="text-sm text-gray-400">Sent at: {r.sent_at}</p>
            <p className="text-sm text-indigo-500">{r.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
