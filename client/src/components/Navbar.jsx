import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/invoices/new', label: '+ New Invoice' },
  { to: '/reminders', label: 'Reminder Log' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
          <span className="text-lg font-bold text-gray-800">Pay<span className="text-indigo-600">Remind</span></span>
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setOpen(!open)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${pathname === to
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-3 flex flex-col gap-1 border-t border-gray-100 pt-3">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${pathname === to
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}


