import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import EventsPage from '../EventsPage';
import type { EventsFile } from '../../data/events.types';
import { getEventCommunitySlugs } from '../../data/events.types';
import rawEvents from '../../data/events.json';

const allEvents = (rawEvents as EventsFile).items;
const countFor = (slug: string) =>
  allEvents.filter((e) => getEventCommunitySlugs(e).includes(slug)).length;
const AI_COUNT = countFor('ai');
// AI filtresinde görünmemesi gereken bir etkinlik
const NON_AI_EVENT = allEvents.find((e) => !getEventCommunitySlugs(e).includes('ai'))!;
const DETAIL_EVENT = allEvents.find((e) => (e.speakers?.length ?? 0) > 0 && e.gallery?.length)!;

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
    expect(screen.queryByRole('heading', { name: NON_AI_EVENT.title })).not.toBeInTheDocument();
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
    renderEventsPage('/etkinlikler?topluluk=app-gelistirme');
    expect(screen.getAllByRole('article')).toHaveLength(countFor('app-gelistirme'));
  });

  it('ilişkili topluluk (relatedSlugs) filtresinde de etkinlik listelenir', async () => {
    const related = allEvents.find((e) => e.relatedSlugs?.includes('ai'))!;
    const user = userEvent.setup();
    renderEventsPage();
    await user.click(screen.getByRole('button', { name: 'AI Topluluğu' }));
    expect(screen.getByRole('heading', { name: related.title })).toBeInTheDocument();
  });

  it('etkinliği olmayan topluluk filtresinde boş durum mesajı görünür', () => {
    const emptySlug = ['fintech', 'oyun-gelistirme'].find((s) => countFor(s) === 0);
    if (!emptySlug) return;
    renderEventsPage(`/etkinlikler?topluluk=${emptySlug}`);
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(screen.getByText(/henüz etkinlik kaydı yok/)).toBeInTheDocument();
  });
});

describe('EventsPage detay penceresi', () => {
  it('karta tıklayınca detay açılır, URL güncellenir, Esc ile kapanır', async () => {
    const user = userEvent.setup();
    renderEventsPage();

    await user.click(screen.getByRole('button', { name: DETAIL_EVENT.title }));

    const dialog = screen.getByRole('dialog', { name: DETAIL_EVENT.title });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent(`etkinlik=${DETAIL_EVENT.id}`);
    for (const s of DETAIL_EVENT.speakers!) {
      expect(within(dialog).getByText(s.name)).toBeInTheDocument();
    }

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('location')).not.toHaveTextContent('etkinlik=');
  });

  it('?etkinlik=<id> linki detayı doğrudan açar; kapat butonu kapatır', async () => {
    const user = userEvent.setup();
    renderEventsPage(`/etkinlikler?etkinlik=${DETAIL_EVENT.id}`);

    expect(screen.getByRole('dialog', { name: DETAIL_EVENT.title })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Kapat' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('birden fazla görselde ileri/geri butonları görseller arasında gezer', async () => {
    const user = userEvent.setup();
    renderEventsPage(`/etkinlikler?etkinlik=${DETAIL_EVENT.id}`);
    const total = 1 + DETAIL_EVENT.gallery!.length;

    expect(screen.getByText(`1 / ${total}`)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sonraki görsel' }));
    expect(screen.getByText(`2 / ${total}`)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Önceki görsel' }));
    await user.click(screen.getByRole('button', { name: 'Önceki görsel' }));
    expect(screen.getByText(`${total} / ${total}`)).toBeInTheDocument();
  });

  it('geçersiz ?etkinlik= değeri pencere açmaz', () => {
    renderEventsPage('/etkinlikler?etkinlik=boyle-bir-etkinlik-yok');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
