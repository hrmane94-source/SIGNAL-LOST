import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, RotateCcw, Waves } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface PuzzleSignalReconstructionProps {
  onSolve: () => void;
  isSolved: boolean;
}

// 5 signal segments, correct order: [0, 2, 4, 1, 3]
// Each segment has a visual pattern and a part of the hidden message
const SEGMENTS = [
  { id: 0, label: 'SEG-A', display: '▄▄▀▄▀▀▄', color: '#00f0ff', freq: 440 },
  { id: 1, label: 'SEG-B', display: '▀▄▀▄▄▀▄', color: '#3b82f6', freq: 523 },
  { id: 2, label: 'SEG-C', display: '▄▀▄▀▀▄▀', color: '#00f0ff', freq: 587 },
  { id: 3, label: 'SEG-D', display: '▀▀▄▄▀▄▄', color: '#3b82f6', freq: 659 },
  { id: 4, label: 'SEG-E', display: '▄▄▄▀▄▀▀', color: '#00f0ff', freq: 698 },
];

const CORRECT_ORDER = [0, 2, 4, 1, 3];
const HIDDEN_MESSAGE = '"WE DID NOT DISCOVER THE SIGNAL. IT DISCOVERED US."';

// Canvas waveform renderer
function WaveformCanvas({ arrangement, correct }: { arrangement: number[]; correct: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const isCorrect = arrangement.every((v, i) => v === CORRECT_ORDER[i]);

    // Draw waveform based on current segment arrangement
    const segW = W / arrangement.length;
    arrangement.forEach((segId, idx) => {
      const seg = SEGMENTS[segId];
      const x0 = idx * segW;
      const phase = idx * 0.8;
      const freq = (seg.freq / 440) * 2;

      ctx.beginPath();
      const color = isCorrect ? '#10b981' : (correct ? '#10b981' : seg.color);
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = isCorrect ? 12 : 6;
      ctx.lineWidth = 2;

      for (let x = 0; x <= segW; x++) {
        const t = (x / segW) * Math.PI * freq + phase;
        const amp = isCorrect ? 28 : 18 + Math.sin(x / 15) * 8;
        const y = H / 2 + Math.sin(t) * amp + Math.sin(t * 2.3 + 1) * (amp * 0.3);
        if (x === 0) ctx.moveTo(x0 + x, y);
        else ctx.lineTo(x0 + x, y);
      }
      ctx.stroke();

      // Segment divider
      if (idx < arrangement.length - 1) {
        ctx.strokeStyle = 'rgba(0,240,255,0.15)';
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(x0 + segW, 0);
        ctx.lineTo(x0 + segW, H);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }, [arrangement, correct]);

  return (
    <canvas
      ref={canvasRef}
      width={560}
      height={80}
      className="w-full h-20 rounded"
    />
  );
}

export const PuzzleSignalReconstruction: React.FC<PuzzleSignalReconstructionProps> = ({ onSolve, isSolved }) => {
  const [arrangement, setArrangement] = useState<number[]>([4, 1, 0, 3, 2]); // scrambled start
  const [selected, setSelected] = useState<number | null>(null); // index in arrangement array
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [attempts, setAttempts] = useState(0);

  const isCorrectArrangement = useCallback(
    (arr: number[]) => arr.every((v, i) => v === CORRECT_ORDER[i]),
    []
  );

  const handleSegmentClick = (idx: number) => {
    if (status === 'correct' || isSolved) return;
    soundEngine.playBlip(400 + idx * 60, 'sine', 0.08, 0.03);
    if (selected === null) {
      setSelected(idx);
    } else if (selected === idx) {
      setSelected(null);
    } else {
      // Swap
      const newArr = [...arrangement];
      [newArr[selected], newArr[idx]] = [newArr[idx], newArr[selected]];
      setArrangement(newArr);
      setSelected(null);
    }
  };

  const handleSubmit = () => {
    if (status !== 'idle' || isSolved) return;
    if (isCorrectArrangement(arrangement)) {
      setStatus('correct');
      soundEngine.playPuzzleSuccess();
      setTimeout(() => onSolve(), 2000);
    } else {
      setAttempts((p) => p + 1);
      setStatus('incorrect');
      soundEngine.playPuzzleError();
      setTimeout(() => setStatus('idle'), 1200);
    }
  };

  const handleReset = () => {
    setArrangement([4, 1, 0, 3, 2]);
    setSelected(null);
    setStatus('idle');
    soundEngine.playClick();
  };

  if (isSolved) {
    return (
      <div className="flex flex-col items-center gap-6 py-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/60 border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <Waves className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="text-center">
          <div className="text-xs font-mono text-emerald-400 tracking-widest mb-2">SIGNAL RECONSTRUCTED</div>
          <div className="text-xl font-heading font-bold text-white mb-3">Transmission Decoded</div>
          <div className="bg-black/60 border border-emerald-500/40 rounded-lg px-6 py-4 font-mono text-base text-emerald-300 italic">
            {HIDDEN_MESSAGE}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-cyan-900/40 pb-3">
        <div className="flex items-center justify-center w-9 h-9 rounded bg-cyan-950/60 border border-cyan-500/40">
          <Waves className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="text-xs font-mono text-cyan-300 tracking-widest font-bold">CREW QUARTERS — SIGNAL RECONSTRUCTION</div>
          <div className="text-[11px] font-mono text-slate-400">CORRUPTED TRANSMISSION // REARRANGE SIGNAL SEGMENTS</div>
        </div>
      </div>

      {/* Waveform display */}
      <div className="bg-black/80 border border-cyan-900/50 rounded-lg p-4 relative overflow-hidden">
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
        <div className="text-[10px] font-mono text-slate-500 mb-2 tracking-widest">LIVE WAVEFORM RECONSTRUCTION PREVIEW</div>
        <WaveformCanvas arrangement={arrangement} correct={status === 'correct'} />
      </div>

      {/* Segment selector */}
      <div>
        <div className="text-xs font-mono text-slate-400 mb-3">
          SELECT TWO SEGMENTS TO SWAP THEIR POSITIONS
          {selected !== null && (
            <span className="text-cyan-400 ml-2">— SEG-{SEGMENTS[arrangement[selected]].label} SELECTED</span>
          )}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {arrangement.map((segId, idx) => {
            const seg = SEGMENTS[segId];
            const isSelected = selected === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSegmentClick(idx)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border font-mono text-center transition cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_15px_rgba(0,240,255,0.3)] text-cyan-200'
                    : 'border-cyan-800/40 bg-slate-900/60 hover:border-cyan-500/50 hover:bg-cyan-950/30 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-slate-400">{idx + 1}</div>
                <div className={`text-sm tracking-tighter ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {seg.display}
                </div>
                <div className="text-[10px] text-slate-500">{seg.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status !== 'idle'}
          className="flex-1 py-3 rounded-lg border border-cyan-500/50 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 font-mono text-xs tracking-widest uppercase transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,240,255,0.1)]"
        >
          VERIFY RECONSTRUCTION
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-mono text-xs uppercase transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          RESET
        </button>
      </div>

      <AnimatePresence>
        {status === 'incorrect' && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-xs font-mono text-red-400"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            RECONSTRUCTION FAILED — INCORRECT SEGMENT ORDER ({attempts} attempt{attempts !== 1 ? 's' : ''})
          </motion.div>
        )}
        {status === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs font-mono text-emerald-400"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            SIGNAL RECONSTRUCTED — DECODING MESSAGE...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
