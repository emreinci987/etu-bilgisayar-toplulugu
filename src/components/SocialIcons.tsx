/**
 * Paylaşılan sosyal medya ikonları (inline SVG, bağımlılık yok).
 * Ana sayfa, Biz Kimiz CTA'sı ve SocialLinksRow buradan kullanır.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...stroke} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...stroke} aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
      <path d="M9.2 8.4c-.3 0-.8.1-.8.7 0 1.4 1.2 3.3 2.6 4.4 1.3 1 2.4 1.3 3.1 1.3.6 0 1-.5 1-1v-.6l-1.8-.7-.8.8c-.9-.5-2.1-1.7-2.6-2.6l.8-.8-.7-1.8-.8.3Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
