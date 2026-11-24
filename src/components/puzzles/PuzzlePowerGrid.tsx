import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, RotateCcw, Zap } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

interface PuzzlePowerGridProps {
  onSolve: () => void;
  isSolved: boolean;
}

// 4x4 grid of nodes. Each node can be ON or OFF.
// The goal: a valid power path from source (0,0) to AI Core (3,3)
// traversing only "active" nodes where each active node must be adjacent to another active.
// Correct solution: nodes forming an L-shaped path: row 0 all, then col 3 all.
// Encoded as flat index: 0,1,2,3,7,11,15
const GRID_SIZE = 4;

const SOURCE_NODE = 0; // top-left
const TARGET_NODE = 15; // bottom-right

const NODE_LABELS: Record<number, string> = {
  0: 'PWR',
  15: 'A.I.',
};

function getAdjacent(idx: number): number[] {
  const row = Math.floor(idx / GRID_SIZE);
  const col = idx % GRID_SIZE;
  const adj: number[] = [];
  if (row > 0) adj.push((row - 1) * GRID_SIZE + col);
  if (row < GRID_SIZE - 1) adj.push((row + 1) * GRID_SIZE + col);
  if (col > 0) adj.push(row * GRID_SIZE + (col - 1));
  if (col < GRID_SIZE - 1) adj.push(row * GRID_SIZE + (col + 1));
  return adj;
}

function findConnectedFrom(active: Set<number>, start: number): Set<number> {
  const visited = new Set<number>();
  const queue = [start];
  while (queue.length) {
    const node = queue.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);
    getAdjacent(node).forEach((n) => {
      if (active.has(n) && !visited.has(n)) queue.push(n);
    });
  }
  return visited;
}

function isSolutionCorrect(active: Set<number>): boolean {
  if (!active.has(SOURCE_NODE) || !active.has(TARGET_NODE)) return false;
  const connected = findConnectedFrom(active, SOURCE_NODE);
  return connected.has(TARGET_NODE);
}

export const PuzzlePowerGrid: React.FC<PuzzlePowerGridProps> = ({ onSolve, isSolved }) => {
  const [activeNodes, setActiveNodes] = useState<Set<number>>(
    () => new Set([SOURCE_NODE, TARGET_NODE]) // source and target always on
  );
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [hintShown, setHintShown] = useState(false);

  const toggleNode = (idx: number) => {
    if (status === 'correct' || isSolved) return;
    if (idx === SOURCE_NODE || idx === TARGET_NODE) return; // source/target always on
    soundEngine.playBlip(300 + idx * 20, 'square', 0.05, 0.03);
    setActiveNodes((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleSubmit = () => {
    if (status !== 'idle' || isSolved) return;
    if (isSolutionCorrect(activeNodes)) {
      setStatus('correct');
      soundEngine.playPuzzleSuccess();
      setTimeout(() => onSolve(), 2000);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) setHintShown(true);
      setStatus('incorrect');
      soundEngine.playPuzzleError();
      setTimeout(() => setStatus('idle'), 1200);
    }
  };

  const handleReset = () => {
    setActiveNodes(new Set([SOURCE_NODE, TARGET_NODE]));
    setStatus('idle');
    soundEngine.playClick();
  };

  // Compute connected nodes from source for visual feedback
  const connectedFromSource = findConnectedFrom(activeNodes, SOURCE_NODE);
  const pathReachesTarget = connectedFromSource.has(TARGET_NODE);

  if (isSolved) {
    return (
      <div className="flex flex-col items-center gap-6 py-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/60 border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
          <Zap className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="text-center">
          <div className="text-xs font-mono text-emerald-400 tracking-widest mb-2">POWER RESTORED</div>
          <div className="text-xl font-heading font-bold text-white mb-1">AI Core — Online</div>
          <div className="text-sm font-mono text-slate-300">Full power restored to AI terminal. Access unlocked.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-cyan-900/40 pb-3">
        <div className="flex items-center justify-center w-9 h-9 rounded bg-cyan-950/60 border border-cyan-500/40">
          <Zap className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="text-xs font-mono text-cyan-300 tracking-widest font-bold">ENGINEERING BAY — POWER GRID RESTORATION</div>
          <div className="text-[11px] font-mono text-slate-400">ROUTE POWER FROM SOURCE TO AI CORE // ACTIVATE NODES</div>
        </div>
        <div className={`ml-auto px-2 py-1 rounded border font-mono text-[10px] transition ${
          pathReachesTarget
            ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
            : 'border-red-500/40 bg-red-950/30 text-red-400'
        }`}>
          {pathReachesTarget ? 'CIRCUIT COMPLETE' : 'CIRCUIT OPEN'}
        </div>
      </div>

      {/* Grid Legend */}
      <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-amber-500 border border-amber-400" />
          <span>POWER SOURCE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-900 border border-red-400" />
          <span>AI CORE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-cyan-900/60 border border-cyan-400" />
          <span>ACTIVE NODE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-slate-900 border border-slate-700" />
          <span>INACTIVE</span>
        </div>
      </div>

      {/* Power Grid */}
      <div className="bg-black/70 border border-cyan-900/40 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 scanlines opacity-15 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-2 items-center">
          {Array.from({ length: GRID_SIZE }, (_, row) => (
            <div key={row} className="flex gap-2">
              {Array.from({ length: GRID_SIZE }, (_, col) => {
                const idx = row * GRID_SIZE + col;
                const isActive = activeNodes.has(idx);
                const isConnected = connectedFromSource.has(idx);
                const isSource = idx === SOURCE_NODE;
                const isTarget = idx === TARGET_NODE;
                const label = NODE_LABELS[idx];

                let nodeClass: string;
                if (isSource) {
                  nodeClass = 'border-amber-400 bg-amber-900/70 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.5)] cursor-not-allowed';
                } else if (isTarget) {
                  nodeClass = isConnected
                    ? 'border-red-400 bg-red-900/80 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.6)] cursor-not-allowed animate-pulse'
                    : 'border-red-800 bg-red-950/60 text-red-500 cursor-not-allowed';
                } else if (isActive && isConnected) {
                  nodeClass = 'border-cyan-400 bg-cyan-900/70 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.4)] cursor-pointer';
                } else if (isActive) {
                  nodeClass = 'border-blue-500/60 bg-blue-950/60 text-blue-300 cursor-pointer';
                } else {
                  nodeClass = 'border-slate-700 bg-slate-900/60 text-slate-600 hover:border-slate-500 hover:bg-slate-800/50 cursor-pointer';
                }

                return (
                  <motion.button
                    key={idx}
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleNode(idx)}
                    className={`w-14 h-14 rounded-lg border-2 font-mono text-[10px] font-bold tracking-wider flex items-center justify-center transition-all ${nodeClass}`}
                    title={`Node ${row},${col}`}
                  >
                    {label || (isActive ? '◉' : '○')}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Hint */}
      <AnimatePresence>
        {hintShown && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-start gap-3 px-4 py-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-300"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>HINT: Route the top row (left to right) then the right column (top to bottom) to connect power source to AI core.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status !== 'idle' || !pathReachesTarget}
          className="flex-1 py-3 rounded-lg border border-cyan-500/50 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 font-mono text-xs tracking-widest uppercase transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,240,255,0.1)]"
        >
          RESTORE POWER
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
            POWER CIRCUIT INCOMPLETE — REROUTE CONNECTIONS
          </motion.div>
        )}
        {status === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs font-mono text-emerald-400"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            POWER GRID RESTORED — AI CORE COMING ONLINE...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
