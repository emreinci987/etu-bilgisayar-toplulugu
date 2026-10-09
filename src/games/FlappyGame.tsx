import { useCallback, useEffect, useRef, useState } from 'react';
import { getGame } from './config';
import GameLayout from './GameLayout';
import WinOverlay from './WinOverlay';

/**
 * Flappy Bug — dokun/boşluk ile zıpla, kod bloklarının arasından geç.
 * Mantık sabit bir mantıksal alanda (W×H) çalışır; canvas ekrana ölçeklenir.
 * Fizik dt ile ilerler, 60/120 Hz ekranlarda aynı hızda oynanır.
 */

const W = 360;
const H = 560;
const GRAVITY = 1500;
const FLAP_VELOCITY = -430;
const MAX_FALL = 620;
const PIPE_SPEED = 140;
const PIPE_WIDTH = 56;
const PIPE_SPACING = 210;
const GAP = 165;
const BUG_X = 90;
const BUG_R = 14;
const RESTART_COOLDOWN_MS = 600;
const BEST_KEY = 'etu-flappy-best';

const PIPE_COLORS = ['#2563eb', '#059669', '#ea580c', '#0d9488', '#d97706', '#0284c7'];
const PIPE_LABELS = ['if', 'for', '{ }', 'try', '=>', 'fn'];

type Phase = 'ready' | 'playing' | 'over';

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
  color: string;
  label: string;
}

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeBest(score: number) {
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // depolama kapalıysa rekor sadece bu oturumda kalır
  }
}

function cssRgb(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? `rgb(${v})` : fallback;
}

export default function FlappyGame() {
  const game = getGame('flappy');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>('ready');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);
  const [showWin, setShowWin] = useState(false);

  // Oyun durumu ref'lerde: her karede React render'ı tetiklemesin
  const state = useRef({
    phase: 'ready' as Phase,
    y: H / 2,
    vy: 0,
    pipes: [] as Pipe[],
    score: 0,
    nextPipe: 0,
    overAt: 0,
    t: 0,
  });

  const reset = useCallback(() => {
    const s = state.current;
    s.phase = 'ready';
    s.y = H / 2;
    s.vy = 0;
    s.pipes = [];
    s.score = 0;
    s.nextPipe = 0;
    setScore(0);
    setPhase('ready');
  }, []);

  const flap = useCallback(() => {
    const s = state.current;
    if (s.phase === 'over') {
      if (performance.now() - s.overAt < RESTART_COOLDOWN_MS) return;
      reset();
      return;
    }
    if (s.phase === 'ready') {
      s.phase = 'playing';
      setPhase('playing');
    }
    s.vy = FLAP_VELOCITY;
  }, [reset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!showWin) flap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flap, showWin]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let last = performance.now();

    const endGame = () => {
      const s = state.current;
      s.phase = 'over';
      s.overAt = performance.now();
      setPhase('over');
      setScore(s.score);
      setBest((prev) => {
        if (s.score > prev) {
          writeBest(s.score);
          return s.score;
        }
        return prev;
      });
      if (s.score >= game.stickerScore) setShowWin(true);
    };

    const spawnPipe = (x: number) => {
      const s = state.current;
      const margin = 70;
      const i = s.nextPipe++;
      s.pipes.push({
        x,
        gapY: margin + GAP / 2 + Math.random() * (H - 2 * margin - GAP),
        passed: false,
        color: PIPE_COLORS[i % PIPE_COLORS.length],
        label: PIPE_LABELS[i % PIPE_LABELS.length],
      });
    };

    const update = (dt: number) => {
      const s = state.current;
      s.t += dt;
      if (s.phase === 'ready') {
        s.y = H / 2 + Math.sin(s.t * 4) * 8;
        return;
      }
      if (s.phase !== 'playing') {
        // Düşüş animasyonu: oyun bitince bug yere iner
        if (s.y < H - BUG_R) {
          s.vy = Math.min(s.vy + GRAVITY * dt, MAX_FALL);
          s.y = Math.min(s.y + s.vy * dt, H - BUG_R);
        }
        return;
      }

      s.vy = Math.min(s.vy + GRAVITY * dt, MAX_FALL);
      s.y += s.vy * dt;
      if (s.y < BUG_R) {
        s.y = BUG_R;
        s.vy = 0;
      }

      for (const p of s.pipes) p.x -= PIPE_SPEED * dt;
      s.pipes = s.pipes.filter((p) => p.x > -PIPE_WIDTH);
      const lastPipe = s.pipes[s.pipes.length - 1];
      if (!lastPipe) spawnPipe(W + 40);
      else if (lastPipe.x < W - PIPE_SPACING) spawnPipe(lastPipe.x + PIPE_SPACING);

      // Çarpışma: hafif toleranslı kutu kontrolü
      const r = BUG_R * 0.8;
      for (const p of s.pipes) {
        if (!p.passed && p.x + PIPE_WIDTH < BUG_X - r) {
          p.passed = true;
          s.score += 1;
          setScore(s.score);
        }
        const inX = BUG_X + r > p.x && BUG_X - r < p.x + PIPE_WIDTH;
        const inGap = s.y - r > p.gapY - GAP / 2 && s.y + r < p.gapY + GAP / 2;
        if (inX && !inGap) {
          endGame();
          return;
        }
      }
      if (s.y >= H - BUG_R) {
        s.y = H - BUG_R;
        endGame();
      }
    };

    const draw = () => {
      const s = state.current;
      const bg = cssRgb('--coal-800', '#f1f5f9');
      const fg = cssRgb('--cream', '#0f172a');
      const accent = cssRgb('--amber', '#2563eb');

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Arka plan ızgarası
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.06;
      ctx.lineWidth = 1;
      const offset = (s.t * PIPE_SPEED * 0.3) % 40;
      for (let x = -offset; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Engeller
      ctx.font = 'bold 14px "JetBrains Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const p of s.pipes) {
        const top = p.gapY - GAP / 2;
        const bottom = p.gapY + GAP / 2;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.roundRect(p.x, -10, PIPE_WIDTH, top + 10, 6);
        ctx.roundRect(p.x, bottom, PIPE_WIDTH, H - bottom + 10, 6);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillText(p.label, p.x + PIPE_WIDTH / 2, top - 16);
        ctx.fillText(p.label, p.x + PIPE_WIDTH / 2, bottom + 16);
      }

      // Bug
      const tilt = Math.max(-0.5, Math.min(0.8, s.vy / 700));
      ctx.save();
      ctx.translate(BUG_X, s.y);
      ctx.rotate(tilt);
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2;
      for (const side of [-1, 1]) {
        for (const lx of [-6, 0, 6]) {
          ctx.beginPath();
          ctx.moveTo(lx, side * 8);
          ctx.lineTo(lx + 3, side * (BUG_R + 4));
          ctx.stroke();
        }
      }
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.ellipse(0, 0, BUG_R + 2, BUG_R - 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(8, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(9, -4, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Skor
      ctx.fillStyle = fg;
      ctx.font = 'bold 44px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillText(String(s.score), W / 2, 50);
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [game.stickerScore]);

  return (
    <GameLayout game={game}>
      <div className="mb-2 flex justify-between font-mono text-xs text-cream-faint">
        <span>en iyi: {best}</span>
        <span>hedef: {game.stickerScore}</span>
      </div>
      <div
        className="relative w-full select-none overflow-hidden rounded-card border border-coal-600"
        style={{ aspectRatio: `${W} / ${H}`, touchAction: 'none' }}
        onPointerDown={(e) => {
          e.preventDefault();
          if (!showWin) flap();
        }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" aria-label="Flappy Bug oyun alanı" />
        {phase === 'ready' && (
          <div className="pointer-events-none absolute inset-x-0 bottom-16 text-center font-mono text-sm text-cream">
            başlamak için dokun
          </div>
        )}
        {phase === 'over' && !showWin && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-coal/70 text-center font-mono">
            <p className="text-lg font-bold text-cream">oyun bitti</p>
            <p className="mt-2 text-5xl font-bold text-amber">{score}</p>
            <p className="mt-3 text-sm text-cream-dim">
              {score >= game.stickerScore
                ? 'sticker kazandın!'
                : `sticker için ${game.stickerScore - score} engel daha`}
            </p>
            <p className="mt-6 text-sm text-cream">tekrar için dokun</p>
          </div>
        )}
      </div>
      {showWin && (
        <WinOverlay
          gameTitle={game.title}
          score={score}
          onClose={() => {
            setShowWin(false);
            reset();
          }}
        />
      )}
    </GameLayout>
  );
}
