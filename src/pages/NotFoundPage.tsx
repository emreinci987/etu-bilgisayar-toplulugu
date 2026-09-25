import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-6xl font-bold text-amber">404</p>
      <p className="mt-4 font-mono text-sm text-cream-faint">sayfa bulunamadı</p>
      <Link
        to="/"
        className="mt-8 rounded-card border border-coal-600 px-5 py-3 font-mono text-sm text-cream-dim transition-colors hover:text-cream"
      >
        ← Ana sayfaya dön
      </Link>
    </div>
  );
}
