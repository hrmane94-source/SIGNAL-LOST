import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Lock, CheckCircle2, AlertCircle, Cpu } from 'lucide-react';
import { PuzzleAccessSequence } from './puzzles/PuzzleAccessSequence';
import { PuzzleSignalReconstruction } from './puzzles/PuzzleSignalReconstruction';
import { PuzzlePowerGrid } from './puzzles/PuzzlePowerGrid';
import { soundEngine } from '../utils/audio';

export type PuzzleId = 'puzzle-bridge' | 'puzzle-quarters' | 'puzzle-engineering';

interface SignalAnalysisProps {
  solvedPuzzles: Set<PuzzleId>;
  onPuzzleSolved: (id: PuzzleId) => void;
  onAllSolved: () => void;
}

const PUZZLES: Array<{
  id: PuzzleId;
  number: number;
  title: string;
  location: string;
  description: string;
  unlockCondition: PuzzleId | null;
}> = [
  {
    id: 'puzzle-bridge',
    number: 1,
    title: 'ACCESS SEQUENCE',
    location: 'Command Bridge — Captain\'s Terminal',
    description: 'Decrypt the captain\'s encrypted access code to retrieve the final mission logs.',
    unlockCondition: null,
  },
  {
    id: 'puzzle-quarters',
    number: 2,
    title: 'SIGNAL RECONSTRUCTION',
    location: 'Crew Quarters — Communications Array',
    description: 'Rearrange the corrupted signal segments to reconstruct the original transmission.',
    unlockCondition: 'puzzle-bridge',
  },
  {
    id: 'puzzle-engineering',
    number: 3,
    title: 'POWER GRID RESTORATION',
    location: 'Engineering Bay — Power Distribution',
    description: 'Route power through the disabled grid to bring the AI core back online.',
    unlockCondition: 'puzzle-quarters',
  },
];

export const SignalAnalysis: React.FC<SignalAnalysisProps> = ({
  solvedPuzzles,
  onPuzzleSolved,
  onAllSolved,
}) => {
  const [activePuzzle, setActivePuzzle] = useState<PuzzleId | null>(null);

  const isUnlocked = (puzzle: (typeof PUZZLES)[0]) =>
    puzzle.unlockCondition === null || solvedPuzzles.has(puzzle.unlockCondition);

  const handlePuzzleSolved = (id: PuzzleId) => {
    onPuzzleSolved(id);
    if (id === 'puzzle-engineering') {
      // All puzzles done — trigger AI reveal after a brief delay
      setTimeout(() => onAllSolved(), 2500);
    }
  };

  const allSolved = PUZZLES.every((p) => solvedPuzzles.has(p.id));

  return (
    <motion.div
      key="signal-analysis"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="relative z-20 w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8"
    >
      {/* Header */}
      <div className="text-center space-y-3 border-b border-cyan-900/40 pb-6">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 tracking-widest">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span>PHASE 03 — SIGNAL ANALYSIS // DECRYPTION SEQUENCE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tight text-glow-cyan">
          DECRYPT THE TRUTH
        </h1>
        <p className="max-w-2xl mx-auto text-sm font-mono text-slate-300 leading-relaxed">
          Three encrypted systems stand between you and the final answer.
          Solve each puzzle to unlock the truth about ORPHEUS-09.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          {PUZZLES.map((p) => (
            <div key={p.id} className="flex items-center gap-1.5 text-xs font-mono">
              {solvedPuzzles.has(p.id) ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center">
                  <span className="text-[8px] text-slate-400">{p.number}</span>
                </div>
              )}
              <span className={solvedPuzzles.has(p.id) ? 'text-emerald-400' : 'text-slate-500'}>
                {p.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Puzzle list / navigator */}
      {!activePuzzle && (
        <div className="grid gap-4">
          {PUZZLES.map((puzzle, idx) => {
            const unlocked = isUnlocked(puzzle);
            const solved = solvedPuzzles.has(puzzle.id);
            return (
              <motion.div
                key={puzzle.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={`relative rounded-xl border p-6 backdrop-blur-md overflow-hidden transition-all ${
                  solved
                    ? 'border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : unlocked
                    ? 'border-cyan-500/40 bg-slate-950/80 hover:border-cyan-400/60 hover:bg-cyan-950/20 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.08)]'
                    : 'border-slate-800/40 bg-slate-950/50 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (!unlocked || solved) return;
                  soundEngine.playClick();
                  setActivePuzzle(puzzle.id);
                }}
              >
                {/* Corner decorations */}
                <div className={`absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 ${solved ? 'border-emerald-400' : unlocked ? 'border-cyan-400' : 'border-slate-700'} pointer-events-none`} />
                <div className={`absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 ${solved ? 'border-emerald-400' : unlocked ? 'border-cyan-400' : 'border-slate-700'} pointer-events-none`} />

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 font-heading font-extrabold text-lg shrink-0 ${
                      solved
                        ? 'border-emerald-400 bg-emerald-900/60 text-emerald-300'
                        : unlocked
                        ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300'
                        : 'border-slate-700 bg-slate-900/60 text-slate-600'
                    }`}>
                      {solved ? <CheckCircle2 className="w-6 h-6" /> : unlocked ? `0${puzzle.number}` : <Lock className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-slate-400 tracking-wider mb-0.5">
                        PUZZLE {puzzle.number} — {puzzle.location}
                      </div>
                      <h3 className={`text-xl font-heading font-bold tracking-tight ${solved ? 'text-emerald-300' : unlocked ? 'text-white' : 'text-slate-500'}`}>
                        {puzzle.title}
                      </h3>
                      <p className="text-xs font-mono text-slate-400 mt-1 leading-relaxed">
                        {puzzle.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 mt-1">
                    {solved ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/60 text-[10px] font-mono text-emerald-300 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        SOLVED
                      </span>
                    ) : unlocked ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/60 text-[10px] font-mono text-cyan-300 font-bold">
                        <span>ENTER</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 text-[10px] font-mono text-slate-500">
                        <Lock className="w-3 h-3" />
                        LOCKED
                      </span>
                    )}
                  </div>
                </div>

                {!unlocked && puzzle.unlockCondition && (
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>Solve puzzle {puzzle.number - 1} to unlock</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Active puzzle panel */}
      <AnimatePresence mode="wait">
        {activePuzzle && !allSolved && (
          <motion.div
            key={activePuzzle}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="relative bg-slate-950/90 border border-cyan-500/40 rounded-xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.08)]"
          >
            {/* Back button */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActivePuzzle(null);
              }}
              className="mb-5 flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 transition"
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
              BACK TO PUZZLE LIST
            </button>

            {activePuzzle === 'puzzle-bridge' && (
              <PuzzleAccessSequence
                isSolved={solvedPuzzles.has('puzzle-bridge')}
                onSolve={() => handlePuzzleSolved('puzzle-bridge')}
              />
            )}
            {activePuzzle === 'puzzle-quarters' && (
              <PuzzleSignalReconstruction
                isSolved={solvedPuzzles.has('puzzle-quarters')}
                onSolve={() => handlePuzzleSolved('puzzle-quarters')}
              />
            )}
            {activePuzzle === 'puzzle-engineering' && (
              <PuzzlePowerGrid
                isSolved={solvedPuzzles.has('puzzle-engineering')}
                onSolve={() => handlePuzzleSolved('puzzle-engineering')}
              />
            )}

            {/* Auto-advance after solving */}
            {solvedPuzzles.has(activePuzzle) && activePuzzle !== 'puzzle-engineering' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 flex items-center justify-center"
              >
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActivePuzzle(null);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-cyan-500/50 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 font-mono text-xs tracking-widest uppercase transition"
                >
                  RETURN TO PUZZLE LIST
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* All solved celebration */}
      {allSolved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8 space-y-4"
        >
          <div className="text-xs font-mono text-emerald-400 tracking-widest">ALL SYSTEMS DECRYPTED</div>
          <div className="text-2xl font-heading font-bold text-white text-glow-cyan">AI Core Coming Online...</div>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
