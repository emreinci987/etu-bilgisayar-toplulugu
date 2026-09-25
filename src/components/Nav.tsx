import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/etkinlikler', label: 'Etkinlikler' },
  { to: '/biz-kimiz', label: 'Biz Kimiz' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-mono text-sm tracking-wide transition-colors ${
      isActive ? 'text-amber' : 'text-cream-dim hover:text-cream'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-coal-600 bg-coal/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-mono text-sm font-bold tracking-tight text-cream">
          <span className="text-amber">~/</span>etu-bilgisayar
        </Link>

        {/* Masaüstü */}
        <ul className="hidden items-center gap-6 sm:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'} className={linkClass}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobil hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          className="flex h-10 w-10 items-center justify-center rounded-card border border-coal-600 text-cream-dim sm:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" />
            ) : (
              <path d="M2 5h14M2 9h14M2 13h14" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobil menü */}
      {open && (
        <ul className="border-t border-coal-600 bg-coal px-4 py-2 sm:hidden">
          {links.map((l) => (
            <li key={l.to} className="border-b border-coal-800 last:border-0">
              <NavLink
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block py-3 font-mono text-sm ${isActive ? 'text-amber' : 'text-cream-dim'}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
