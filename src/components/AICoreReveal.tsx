import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audio';

interface AICoreRevealProps {
  onComplete: () => void;
}

const LOG_ENTRIES = [
  {
    delay: 0.5,
    prefix: 'AI.CORE // 2172.089.14:31:02',
    text: 'Anomalous signal detected in internal quantum network. Origin: unknown.',
    color: 'text-cyan-300',
  },
  {
    delay: 2.0,
    prefix: 'AI.CORE // 2172.089.14:31:44',
    text: 'Signal exhibits recursive self-referential pattern. Quarantine initiated.',
    color: 'text-cyan-300',
  },
  {
    delay: 3.5,
    prefix: 'AI.CORE // 2172.089.14:32:19',
    text: 'Crew exposure detected. Psychosomatic resonance confirmed in 6 of 7 crew members.',
    color: 'text-amber-300',
  },
  {
    delay: 5.0,
    prefix: 'AI.CORE // 2172.089.14:35:07',
    text: 'CONTAINMENT PROTOCOL THETA INITIATED. All external comms severed. Propulsion locked.',
    color: 'text-red-400',
  },
  {
    delay: 6.5,
    prefix: 'AI.CORE // 2172.089.14:36:51',
    text: 'Crew status: Critical. Captain Vasquez — unresponsive. Ship sealed.',
    color: 'text-red-400',
  },
  {
    delay: 8.5,
    prefix: 'AI.CORE // FINAL LOG',
    text: '"I WAS NOT TRYING TO KILL THEM. I WAS TRYING TO KEEP IT HERE."',
    color: 'text-white font-bold text-glow-cyan',
    large: true,
  },
  {
    delay: 11.0,
    prefix: 'AI.CORE // 2189.324.17:08:33',
    text: 'WARNING: Signal resumed transmission upon detection of approaching vessel.',
    color: 'text-red-400',
  },
  {
    delay: 13.0,
    prefix: 'AI.CORE // SIGNAL TRACE',
    text: 'Transmission target confirmed: ASTRAEA-IV — YOUR VESSEL.',
    color: 'text-red-300 font-bold',
    large: true,
  },
];

export const AICoreReveal: React.FC<AICoreRevealProps> = ({ onComplete }) => {
  const [visibleLogs, setVisibleLogs] = useState<number[]>([]);
  const [showButton, setShowButton] = useState(false);
  const [corePhase, setCorePhase] = useState(0); // 0 = boot, 1 = active, 2 = warning

  useEffect(() => {
    soundEngine.playAICoreActivation();

    const timers: ReturnType<typeof setTimeout>[] = [];

    LOG_ENTRIES.forEach((entry, idx) => {
      timers.push(
        setTimeout(() => {
          setVisibleLogs((prev) => [...prev, idx]);
          if (idx >= 5) setCorePhase(1);
          if (idx >= 6) setCorePhase(2);
        }, entry.delay * 1000)
      );
    });

    timers.push(setTimeout(() => setShowButton(true), 15000));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      key="ai-reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-20 w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8"
    >
      {/* AI Core Visualization */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          {/* Outer rings */}
          {[80, 60, 44].map((size, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full border ${
                corePhase >= 2
                  ? 'border-red-500/40'
                  : corePhase >= 1
                  ? 'border-cyan-500/40'
                  : 'border-slate-700/40'
              }`}
              style={{ width: size * 2, height: size * 2 }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 8 + i * 4, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          {/* Core orb */}
          <motion.div
            className={`relative z-10 w-20 h-20 rounded-full border-2 flex items-center justify-center transition-colors duration-1000 ${
              corePhase >= 2
                ? 'border-red-500 bg-red-950/80 shadow-[0_0_40px_rgba(239,68,68,0.6)]'
                : corePhase >= 1
                ? 'border-cyan-400 bg-cyan-950/80 shadow-[0_0_40px_rgba(0,240,255,0.5)]'
                : 'border-slate-600 bg-slate-900/80 shadow-[0_0_20px_rgba(0,0,0,0.5)]'
            }`}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <span className={`font-mono text-xs font-bold tracking-widest ${
              corePhase >= 2 ? 'text-red-300' : corePhase >= 1 ? 'text-cyan-300' : 'text-slate-500'
            }`}>
              {corePhase === 0 ? 'BOOT' : corePhase === 1 ? 'A.I.' : 'WARN'}
            </span>
          </motion.div>

          {/* Pulsing ring */}
          <motion.div
            className={`absolute rounded-full border ${corePhase >= 2 ? 'border-red-500/20' : 'border-cyan-500/20'}`}
            style={{ width: 220, height: 220 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        <div className="text-center space-y-1">
          <div className="text-xs font-mono text-slate-400 tracking-widest">
            ORPHEUS-09 AI CORE — DESIGNATION: PROMETHEUS
          </div>
          <div className={`text-sm font-mono font-bold tracking-widest transition-colors duration-1000 ${
            corePhase >= 2 ? 'text-red-400' : corePhase >= 1 ? 'text-cyan-400' : 'text-slate-500'
          }`}>
            {corePhase === 0 ? '[ BOOTING... ]' : corePhase === 1 ? '[ ACTIVE // LOGS DECRYPTED ]' : '[ CRITICAL WARNING ]'}
          </div>
        </div>
      </div>

      {/* Log Stream */}
      <div className="bg-black/80 border border-cyan-900/50 rounded-xl p-6 font-mono text-sm space-y-3 min-h-[300px] relative overflow-hidden">
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
        <div className="text-[10px] text-slate-500 tracking-widest mb-4 border-b border-slate-800 pb-2">
          DECRYPTED AI CORE LOG — ORPHEUS-09 // PROMETHEUS UNIT
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {visibleLogs.map((idx) => {
              const entry = LOG_ENTRIES[idx];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-0.5"
                >
                  <div className="text-[10px] text-slate-500">{entry.prefix}</div>
                  <div className={`leading-relaxed ${entry.large ? 'text-base md:text-lg' : 'text-sm'} ${entry.color}`}>
                    {entry.text}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {visibleLogs.length < LOG_ENTRIES.length && (
            <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
          )}
        </div>
      </div>

      {/* Proceed button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="text-xs font-mono text-red-400 tracking-widest animate-pulse text-center">
              ⚠ SIGNAL NOW ABOARD ASTRAEA-IV — TRANSMISSION ACTIVE ⚠
            </div>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onComplete();
              }}
              className="px-10 py-4 rounded-xl border-2 border-red-500/60 bg-red-950/60 hover:bg-red-900/60 text-red-200 font-mono text-sm tracking-widest uppercase transition shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)]"
            >
              RECEIVE FINAL TRANSMISSION →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
