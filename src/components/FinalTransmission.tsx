import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audio';

interface FinalTransmissionProps {
  onComplete: () => void;
}

const TEXT_LINES = [
  { text: 'IF YOU ARE HEARING THIS...', delay: 1.0, style: 'text-slate-300 text-lg font-mono tracking-widest' },
  { text: 'THEN THE SIGNAL HAS ALREADY REACHED YOU.', delay: 3.0, style: 'text-red-300 text-xl font-mono tracking-widest font-bold' },
  { text: '', delay: 5.0, style: '' }, // spacer
  { text: 'SIGNAL LOST', delay: 6.5, style: 'text-white text-5xl sm:text-6xl font-heading font-extrabold tracking-tight text-glow-cyan' },
  { text: 'THE LAST TRANSMISSION', delay: 8.0, style: 'text-cyan-400 text-sm font-mono tracking-widest' },
  { text: '', delay: 9.5, style: '' }, // spacer
  { text: 'SIGNAL DETECTED', delay: 10.5, style: 'text-red-400 text-base font-mono font-bold tracking-widest animate-pulse' },
  { text: 'SOURCE: UNKNOWN', delay: 11.5, style: 'text-red-400 text-sm font-mono tracking-widest' },
  { text: 'LOCATION: YOUR VESSEL', delay: 12.5, style: 'text-red-300 text-sm font-mono tracking-widest font-bold' },
];

export const FinalTransmission: React.FC<FinalTransmissionProps> = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [showButton, setShowButton] = useState(false);
  const [flickerActive, setFlickerActive] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    TEXT_LINES.forEach((_, idx) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, idx]);
          if (idx === 3) {
            // Big title reveal — play a dramatic blip
            soundEngine.playBlip(220, 'sawtooth', 0.5, 0.06);
          }
        }, TEXT_LINES[idx].delay * 1000)
      );
    });

    timers.push(setTimeout(() => setFlickerActive(true), 6000));
    timers.push(setTimeout(() => setShowButton(true), 14500));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      key="final-transmission"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0 }}
      className="relative z-20 w-full min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 py-16 text-center"
    >
      {/* Interference overlay */}
      {flickerActive && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-30"
          animate={{ opacity: [0, 0.03, 0, 0.05, 0, 0.02, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.03) 2px, rgba(0,240,255,0.03) 4px)',
          }}
        />
      )}

      <div className="max-w-3xl mx-auto space-y-5">
        <AnimatePresence>
          {visibleLines.map((idx) => {
            const line = TEXT_LINES[idx];
            if (!line.text) return <div key={idx} className="h-6" />;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className={line.style}
              >
                {line.text}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Proceed button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8"
          >
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onComplete();
              }}
              className="px-10 py-4 rounded-xl border border-cyan-500/60 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 font-mono text-sm tracking-widest uppercase transition shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.35)]"
            >
              VIEW MISSION REPORT →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
