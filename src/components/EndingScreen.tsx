import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, Trophy } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface EndingScreenProps {
  startTime: number;
  collectedEvidenceCount: number;
  solvedPuzzleCount: number;
  onReplay: () => void;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  startTime,
  collectedEvidenceCount,
  solvedPuzzleCount,
  onReplay,
}) => {
  const [duration] = useState(() => Math.max(0, Date.now() - startTime));

  const stats = [
    { label: 'EVIDENCE RECOVERED', value: `${collectedEvidenceCount}/3`, ok: collectedEvidenceCount === 3 },
    { label: 'PUZZLES DECRYPTED', value: `${solvedPuzzleCount}/3`, ok: solvedPuzzleCount === 3 },
    { label: 'INVESTIGATION TIME', value: formatDuration(duration), ok: true },
    { label: 'MISSION OUTCOME', value: 'TRUTH UNCOVERED', ok: true },
  ];

  return (
    <motion.div
      key="ending-screen"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-20 w-full max-w-4xl mx-auto px-4 py-10 md:py-16 flex flex-col gap-10 items-center text-center"
    >
      {/* Trophy icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="flex items-center justify-center w-24 h-24 rounded-full bg-amber-900/60 border-2 border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.4)]"
      >
        <Trophy className="w-12 h-12 text-amber-300" />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="space-y-3"
      >
        <div className="text-xs font-mono text-amber-400 tracking-widest">INVESTIGATION COMPLETE</div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white tracking-tight text-glow-cyan">
          SIGNAL LOST
        </h1>
        <div className="text-cyan-400 font-mono text-base tracking-widest">THE LAST TRANSMISSION</div>
        <p className="max-w-xl mx-auto text-sm font-mono text-slate-300 leading-relaxed mt-3">
          You uncovered the truth aboard ORPHEUS-09. The signal that destroyed the crew
          has found its next host. But now you know what you're dealing with.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full max-w-2xl grid grid-cols-2 gap-4"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + idx * 0.1, duration: 0.4 }}
            className="relative bg-slate-950/80 border border-cyan-500/30 rounded-xl p-5 text-left overflow-hidden"
          >
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-cyan-500/40" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-cyan-500/40" />
            <div className="text-[10px] font-mono text-slate-400 tracking-wider mb-1">{stat.label}</div>
            <div className={`text-xl font-heading font-bold ${stat.ok ? 'text-emerald-300' : 'text-amber-300'}`}>
              {stat.value}
            </div>
            {stat.ok && (
              <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-emerald-400 opacity-60" />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <button
          type="button"
          onClick={() => {
            soundEngine.playInitiateSequence();
            onReplay();
          }}
          className="flex items-center gap-3 px-10 py-4 rounded-xl border-2 border-cyan-500/60 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 font-mono text-sm tracking-widest uppercase transition shadow-[0_0_25px_rgba(0,240,255,0.2)] hover:shadow-[0_0_40px_rgba(0,240,255,0.35)]"
        >
          <RotateCcw className="w-4 h-4" />
          REPLAY EXPERIENCE
        </button>
        <div className="text-[11px] font-mono text-slate-500">
          Restarting resets all evidence and puzzles
        </div>
      </motion.div>

      {/* Footer signal indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="text-xs font-mono text-red-400/60 tracking-widest flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        SIGNAL DETECTED // SOURCE: UNKNOWN // LOCATION: ASTRAEA-IV
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
      </motion.div>
    </motion.div>
  );
};
