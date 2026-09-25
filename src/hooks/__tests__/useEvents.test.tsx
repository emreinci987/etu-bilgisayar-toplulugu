import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEvents, useLatestEvents } from '..';
import type { EventsFile } from '../../data/events.types';
import rawEvents from '../../data/events.json';

const source = (rawEvents as EventsFile).items;

describe('useEvents', () => {
  it('etkinlikleri yeniden eskiye sıralar', () => {
    const { result } = renderHook(() => useEvents());
    const dates = result.current.map((e) => e.date);
    const sorted = [...dates].sort((a, b) => b.localeCompare(a));
    expect(dates).toEqual(sorted);
  });

  it('tüm kayıtları döndürür', () => {
    const { result } = renderHook(() => useEvents());
    expect(result.current).toHaveLength(source.length);
  });

  it('kaynak diziyi mutate etmez', () => {
    const before = source.map((e) => e.id);
    renderHook(() => useEvents());
    expect(source.map((e) => e.id)).toEqual(before);
  });
});

describe('useLatestEvents', () => {
  it('en güncel N etkinliği döndürür', () => {
    const { result } = renderHook(() => useLatestEvents(3));
    expect(result.current).toHaveLength(3);
    const { result: all } = renderHook(() => useEvents());
    expect(result.current.map((e) => e.id)).toEqual(all.current.slice(0, 3).map((e) => e.id));
  });
});
