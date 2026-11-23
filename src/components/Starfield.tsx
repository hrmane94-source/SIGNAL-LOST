import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    const starCount = Math.floor((width * height) / 8000); // density scale
    let stars: Star[] = [];

    const starColors = [
      '#ffffff',
      '#93c5fd', // soft blue
      '#67e8f9', // cyan tint
      '#cbd5e1', // soft slate
    ];

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const baseAlpha = 0.15 + Math.random() * 0.7;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 1.5 + 0.5,
          size: Math.random() * 1.4 + 0.4,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: 0.008 + Math.random() * 0.02,
          twinklePhase: Math.random() * Math.PI * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    initStars();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space atmospheric gradient
      const bgGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGradient.addColorStop(0, '#060d20');
      bgGradient.addColorStop(0.5, '#040816');
      bgGradient.addColorStop(1, '#02040a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Distant celestial nebula haze (restrained)
      const nebula = ctx.createRadialGradient(
        width * 0.75,
        height * 0.3,
        20,
        width * 0.75,
        height * 0.3,
        width * 0.45
      );
      nebula.addColorStop(0, 'rgba(14, 116, 144, 0.08)');
      nebula.addColorStop(0.6, 'rgba(2, 132, 199, 0.03)');
      nebula.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      // Stars rendering
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          // Subtle drift downwards/leftwards
          star.y += star.z * 0.12;
          star.x -= star.z * 0.04;

          if (star.y > height) {
            star.y = 0;
            star.x = Math.random() * width;
          }
          if (star.x < 0) {
            star.x = width;
            star.y = Math.random() * height;
          }

          // Gentle sinusoidal twinkling
          star.twinklePhase += star.twinkleSpeed;
          star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.35 * star.baseAlpha;
        }

        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.08, Math.min(1, star.alpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow on brighter foreground stars
        if (star.size > 1.2 && star.alpha > 0.6) {
          ctx.globalAlpha = star.alpha * 0.25;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
