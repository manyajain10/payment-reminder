export default function StatusBadge({ status }) {
  const styles = {
    paid: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    pending: 'bg-amber-100 text-amber-800 border border-amber-200',
    overdue: 'bg-red-100 text-red-800 border border-red-200',
  };
  const icons = {
    paid: '✓',
    pending: '⏳',
    overdue: '⚠️',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {icons[status]} {status}
    </span>
  );
}
