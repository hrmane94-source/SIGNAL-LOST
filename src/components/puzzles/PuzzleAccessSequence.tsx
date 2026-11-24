import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, AlertTriangle, CheckCircle2, Lock, Unlock } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface PuzzleAccessSequenceProps {
  onSolve: () => void;
  isSolved: boolean;
}

// Encrypted display — visual noise around the actual clue
const ENCRYPTED_DISPLAY = [
  '> ██-14-Ω ██ ENCRYPTED ██',
  '> VESSEL: ORP█EUS-0█',
  '> DESIGNATION: ████-09',
  '> CREW MANIFEST: [CLASSIFIED]',
  '> LAUNCH DESIGNATOR: ████████',
  '> RECOVERY CODE: ████████',
  '> ACCESS LEVEL REQUIRED: OMEGA',
];

const HINT_1 = 'The recovery code matches the vessel\'s full name. Try the vessel designation.';
const HINT_2 = 'Vessel: ORPHEUS-09. The access code is the vessel name in full.';
const SOLUTION = 'ORPHEUS';

export const PuzzleAccessSequence: React.FC<PuzzleAccessSequenceProps> = ({ onSolve, isSolved }) => {
  const [inputValue, setInputValue] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hintLevel, setHintLevel] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Progressive terminal line reveal
  useEffect(() => {
    if (isSolved) return;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < ENCRYPTED_DISPLAY.length) {
        const line = ENCRYPTED_DISPLAY[idx];
        if (line) {
          setDisplayedLines((prev) => (prev.includes(line) ? prev : [...prev, line]));
        }
        idx++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 180);
    return () => clearInterval(interval);
  }, [isSolved]);

  const handleSubmit = () => {
    if (status === 'correct' || isSolved) return;
    const val = inputValue.trim().toUpperCase();
    if (val === SOLUTION) {
      setStatus('correct');
      soundEngine.playPuzzleSuccess();
      setTimeout(() => onSolve(), 1600);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setStatus('incorrect');
      soundEngine.playPuzzleError();
      if (newAttempts >= 3 && hintLevel < 1) setHintLevel(1);
      if (newAttempts >= 5 && hintLevel < 2) setHintLevel(2);
      setTimeout(() => {
        setStatus('idle');
        setInputValue('');
        inputRef.current?.focus();
      }, 1200);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  if (isSolved) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/60 border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <Unlock className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="text-center">
          <div className="text-xs font-mono text-emerald-400 tracking-widest mb-1">ACCESS GRANTED</div>
          <div className="text-2xl font-heading font-bold text-white">Terminal Unlocked</div>
          <div className="text-sm font-mono text-slate-300 mt-1">Captain's logs extracted. Evidence secured.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Terminal Header */}
      <div className="flex items-center gap-3 border-b border-cyan-900/40 pb-3">
        <div className="flex items-center justify-center w-9 h-9 rounded bg-cyan-950/60 border border-cyan-500/40">
          <Terminal className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="text-xs font-mono text-cyan-300 tracking-widest font-bold">CAPTAIN'S TERMINAL — COMMAND BRIDGE</div>
          <div className="text-[11px] font-mono text-slate-400">ENCRYPTED ACCESS SEQUENCE // OMEGA CLEARANCE REQUIRED</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded border border-red-500/40 bg-red-950/30 text-[10px] font-mono text-red-400">
          <Lock className="w-3 h-3" />
          <span>LOCKED</span>
        </div>
      </div>

      {/* Encrypted Terminal Output */}
      <div className="bg-black/80 border border-cyan-900/50 rounded-lg p-5 font-mono text-sm text-slate-300 min-h-[180px] relative overflow-hidden">
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
        <div className="space-y-1.5 relative z-10">
          {displayedLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={line?.includes('ENCRYPTED') || line?.includes('CLASSIFIED') ? 'text-red-400/70' : 'text-green-400/90'}
            >
              {line}
            </motion.div>
          ))}
          {isTyping && (
            <span className="inline-block w-2 h-4 bg-green-400 animate-pulse" />
          )}
        </div>
      </div>

      {/* Hint System */}
      <AnimatePresence>
        {hintLevel >= 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-300"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>HINT [{hintLevel}/2]: {hintLevel === 1 ? HINT_1 : HINT_2}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex flex-col gap-3">
        <div className="text-xs font-mono text-slate-400">
          ENTER ACCESS CODE — <span className="text-cyan-400">{attempts} ATTEMPT{attempts !== 1 ? 'S' : ''}</span>
          {attempts >= 3 && <span className="text-amber-400 ml-2">// HINT AVAILABLE</span>}
        </div>

        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              onKeyDown={handleKey}
              maxLength={12}
              autoFocus
              className={`w-full bg-black/60 border rounded-lg px-4 py-3 font-mono text-base tracking-widest uppercase outline-none transition ${
                status === 'incorrect'
                  ? 'border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : status === 'correct'
                  ? 'border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'border-cyan-700/60 text-cyan-200 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.2)]'
              }`}
              placeholder="TYPE ACCESS CODE..."
              disabled={status === 'correct'}
            />
            {status !== 'idle' && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {status === 'correct' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {status === 'incorrect' && <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!inputValue.trim() || status !== 'idle'}
            className="px-6 py-3 rounded-lg border border-cyan-500/50 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 font-mono text-xs tracking-widest uppercase transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]"
          >
            SUBMIT
          </button>
        </div>

        <AnimatePresence>
          {status === 'incorrect' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs font-mono text-red-400 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              ACCESS DENIED — INCORRECT CODE
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
