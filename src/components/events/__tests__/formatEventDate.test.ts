import { describe, it, expect } from 'vitest';
import { formatEventDate } from '../EventCard';

describe('formatEventDate', () => {
  it('geçerli ISO tarihi tr-TR uzun formata çevirir', () => {
    const formatted = formatEventDate('2025-10-02');
    expect(formatted).toContain('2025');
    expect(formatted).toContain('Ekim');
    expect(formatted).toContain('2');
    // tr-TR uzun format gün adı da içerir (Perşembe)
    expect(formatted.toLocaleLowerCase('tr')).toContain('perşembe');
  });

  it('ay/gün kayması olmaz (UTC yerine yerel takvim günü)', () => {
    expect(formatEventDate('2026-01-17')).toContain('Ocak');
    expect(formatEventDate('2026-01-17')).toContain('17');
  });

  it('geçersiz tarih patlamaz, ham değeri döner', () => {
    expect(formatEventDate('gecerli-bir-tarih-degil')).toBe('gecerli-bir-tarih-degil');
    expect(formatEventDate('2025/10/02/ekstra')).toBe('2025/10/02/ekstra');
  });

  it('boş string için anlamlı fallback döner', () => {
    expect(formatEventDate('')).toBe('tarih belirsiz');
  });
});
