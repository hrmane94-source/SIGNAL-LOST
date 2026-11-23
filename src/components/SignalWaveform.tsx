import React, { useEffect, useRef } from 'react';

interface SignalWaveformProps {
  statusText?: string;
  isLocked?: boolean;
  frequency?: string;
  amplitude?: number;
  isDecoding?: boolean;
  className?: string;
}

export const SignalWaveform: React.FC<SignalWaveformProps> = ({
  statusText = 'CARRIER WAVE MONITOR // 1420.405 MHz',
  isLocked = true,
  frequency = '1420.405 MHz',
  amplitude = 1,
  isDecoding = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background telemetry grid
      ctx.strokeStyle = isDecoding ? 'rgba(0, 240, 255, 0.14)' : 'rgba(14, 165, 233, 0.08)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center baseline
      ctx.strokeStyle = isDecoding ? 'rgba(0, 240, 255, 0.4)' : 'rgba(56, 189, 248, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const centerY = height / 2;

      // Draw secondary faint echo wave
      ctx.strokeStyle = isDecoding ? 'rgba(0, 240, 255, 0.45)' : 'rgba(14, 165, 233, 0.25)';
      ctx.lineWidth = isDecoding ? 1.6 : 1.2;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const normX = x / width;
        const envelope = Math.sin(normX * Math.PI); // Window tapering at edges
        const wave1 = Math.sin(x * 0.04 + phase * (isDecoding ? 1.4 : 0.7)) * (isDecoding ? 14 : 8);
        const wave2 = Math.cos(x * 0.09 - phase * (isDecoding ? 1.0 : 0.5)) * (isDecoding ? 8 : 4);
        const y = centerY + (wave1 + wave2) * envelope * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Main primary signal wave
      ctx.strokeStyle = isDecoding ? '#ffffff' : (isLocked ? '#00f0ff' : '#38bdf8');
      ctx.lineWidth = isDecoding ? 2.4 : 1.8;
      ctx.shadowColor = isDecoding ? '#00f0ff' : (isLocked ? '#00f0ff' : '#38bdf8');
      ctx.shadowBlur = isDecoding ? 16 : (isLocked ? 8 : 3);

      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const normX = x / width;
        const envelope = Math.sin(normX * Math.PI); // Smooth boundary taper
        
        // Complex carrier modulation with simulated digital telemetry modulation spikes
        const carrier = Math.sin(x * (isDecoding ? 0.07 : 0.05) + phase);
        const modulation = Math.sin(x * 0.12 - phase * (isDecoding ? 2.2 : 1.4)) * (isDecoding ? 0.8 : 0.45);
        const subHarmonic = Math.cos(x * 0.02 + phase * 0.5) * 0.25;
        
        // Periodic packet burst anomaly
        const burstPhase = (x + phase * (isDecoding ? 80 : 40)) % 180;
        const burst = burstPhase < (isDecoding ? 40 : 25) ? Math.sin((burstPhase / (isDecoding ? 40 : 25)) * Math.PI) * (isDecoding ? 22 : 12) : 0;

        const totalWave = (carrier * (isDecoding ? 22 : 14) + modulation * 14 + subHarmonic * 8 + burst) * envelope * amplitude;
        const y = centerY + totalWave;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Frequency spectrum indicator bars on bottom
      const barCount = 32;
      const barWidth = 3;
      const barSpacing = (width - 40) / barCount;
      for (let i = 0; i < barCount; i++) {
        const barX = 20 + i * barSpacing;
        const barPhase = phase * (isDecoding ? 2.5 : 1.5) + i * 0.3;
        const barHeight = Math.abs(Math.sin(barPhase) * Math.cos(i * 0.2)) * (isDecoding ? 28 : 18) * amplitude + 3;
        
        ctx.fillStyle = isDecoding
          ? 'rgba(0, 240, 255, 0.9)'
          : (i === 14 || i === 15 ? 'rgba(0, 240, 255, 0.75)' : 'rgba(56, 189, 248, 0.35)');
        ctx.fillRect(barX, height - barHeight - 4, barWidth, barHeight);
      }

      if (!prefersReducedMotion) {
        phase += isDecoding ? 0.14 : 0.06;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isLocked, amplitude, isDecoding]);

  return (
    <div className={`relative bg-slate-950/70 border border-cyan-500/30 rounded-lg p-3 backdrop-blur-md overflow-hidden ${className}`}>
      {/* Corner brackets */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-wider text-cyan-300/80 pb-2 border-b border-cyan-900/40">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{statusText}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>BW: 12.8 kHz</span>
          <span className="text-cyan-400 font-semibold">{frequency}</span>
          <span className="text-emerald-400/90 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
            LOCK 88.4%
          </span>
        </div>
      </div>

      {/* Canvas waveform */}
      <div className="relative mt-2">
        <canvas
          ref={canvasRef}
          width={640}
          height={110}
          className="w-full h-24 md:h-28 block rounded"
        />
        {/* Subtle scanline line sweeping across */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-4 animate-signal-drift" />
      </div>

      {/* Footer telemetry */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 pt-1.5 border-t border-cyan-950/60">
        <span className="text-cyan-500/70">MODULATION: QAM-64 / MIL-SPEC-X</span>
        <span className="text-slate-400">SNR: +34.2 dB</span>
        <span className="text-cyan-400/80">CARRIER: CONTINUOUS-WAVE</span>
      </div>
    </div>
  );
};
