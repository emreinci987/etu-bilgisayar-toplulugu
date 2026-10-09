import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';

const HomePage = lazy(() => import('./pages/HomePage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const FlappyGame = lazy(() => import('./games/FlappyGame'));
const MemoryGame = lazy(() => import('./games/MemoryGame'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center font-mono text-sm text-cream-faint">
              yükleniyor…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/etkinlikler" element={<EventsPage />} />
            <Route path="/biz-kimiz" element={<AboutPage />} />
            <Route path="/oyunlar" element={<GamesPage />} />
            <Route path="/oyunlar/flappy" element={<FlappyGame />} />
            <Route path="/oyunlar/hafiza" element={<MemoryGame />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
