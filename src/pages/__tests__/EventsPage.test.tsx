import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import EventsPage from '../EventsPage';
import type { EventsFile } from '../../data/events.types';
import rawEvents from '../../data/events.json';

const allEvents = (rawEvents as EventsFile).items;
const AI_COUNT = allEvents.filter((e) => e.communitySlug === 'ai').length;

/** URL'deki arama parametresini teste görünür kılan prob */
function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname + location.search}</output>;
}

function renderEventsPage(initialEntry = '/etkinlikler') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/etkinlikler"
          element={
            <>
              <EventsPage />
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('EventsPage (integration)', () => {
  it('render sonrası tüm etkinlik kartları görünür', () => {
    renderEventsPage();
    expect(screen.getAllByRole('article')).toHaveLength(allEvents.length);
    for (const e of allEvents) {
      expect(screen.getByRole('heading', { name: e.title })).toBeInTheDocument();
    }
  });

  it('topluluk çipine tıklayınca yalnızca o topluluğun kartları kalır ve URL güncellenir', async () => {
    const user = userEvent.setup();
    renderEventsPage();

    await user.click(screen.getByRole('button', { name: 'AI Topluluğu' }));

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(AI_COUNT);
    expect(screen.getByTestId('location')).toHaveTextContent('/etkinlikler?topluluk=ai');
    expect(screen.queryByRole('heading', { name: 'ETÜ Hack 2026' })).not.toBeInTheDocument();
  });

  it("'Tümü' çipi filtreyi kaldırır ve URL'i temizler", async () => {
    const user = userEvent.setup();
    renderEventsPage();

    await user.click(screen.getByRole('button', { name: 'AI Topluluğu' }));
    expect(screen.getAllByRole('article')).toHaveLength(AI_COUNT);

    await user.click(screen.getByRole('button', { name: 'Tümü' }));
    expect(screen.getAllByRole('article')).toHaveLength(allEvents.length);
    expect(screen.getByTestId('location')).toHaveTextContent('/etkinlikler');
    expect(screen.getByTestId('location')).not.toHaveTextContent('topluluk=');
  });

  it('geçersiz ?topluluk= değeri filtreyi yok sayar, tüm kartlar görünür', () => {
    renderEventsPage('/etkinlikler?topluluk=boyle-bir-slug-yok');
    expect(screen.getAllByRole('article')).toHaveLength(allEvents.length);
  });

  it('paylaşılabilir filtre linki doğrudan açılınca filtreli gelir', () => {
    renderEventsPage('/etkinlikler?topluluk=fintech');
    const expected = allEvents.filter((e) => e.communitySlug === 'fintech').length;
    expect(screen.getAllByRole('article')).toHaveLength(expected);
  });
});
