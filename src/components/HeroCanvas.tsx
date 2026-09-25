import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../hooks';

/**
 * Arka planda dönen wireframe grid + parçacık alanı.
 * - devicePixelRatio max 2 ile kısıtlı
 * - Mobilde parçacık sayısı düşük
 * - prefers-reduced-motion: animasyon başlamaz, tek statik kare çizilir
 * - IntersectionObserver: görünür değilken render duraklar
 * - Unmount'ta tüm three kaynakları dispose edilir
 */
export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.matchMedia('(max-width: 640px)').matches;

    // --- Sahne ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 2.2, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- Wireframe zemin grid'i (devre kartı hissi) ---
    const grid = new THREE.GridHelper(30, 42, 0x8a6224, 0x3a362f);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    grid.position.y = -1.2;
    group.add(grid);

    // --- Parçacık alanı ---
    const particleCount = isMobile ? 350 : 1100;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 26;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xe8a33d,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // --- Boyutlandırma ---
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // --- Render döngüsü ---
    let rafId = 0;
    let visible = true;
    const clock = new THREE.Clock();

    const renderFrame = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.05;
      particles.position.y = Math.sin(t * 0.4) * 0.15;
      renderer.render(scene, camera);
    };

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      if (!visible) return;
      renderFrame();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(container);

    if (reducedMotion) {
      // Tek statik kare; hareket yok
      renderFrame();
    } else {
      loop();
    }

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      resizeObserver.disconnect();
      particleGeo.dispose();
      particleMat.dispose();
      (grid.material as THREE.Material).dispose();
      (grid.geometry as THREE.BufferGeometry).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    />
  );
}
