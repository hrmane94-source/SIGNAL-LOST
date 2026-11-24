import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Starfield } from './components/Starfield';
import { HeaderNav } from './components/HeaderNav';
import { SceneA_Detection } from './components/SceneA_Detection';
import { SceneB_Transmission } from './components/SceneB_Transmission';
import { SceneC_Initiation } from './components/SceneC_Initiation';
import { SceneD_MissionReady } from './components/SceneD_MissionReady';
import { SystemDiagnosticsModal } from './components/SystemDiagnosticsModal';
import { DockingTransition } from './components/DockingTransition';
import { ExplorationStatusHeader } from './components/ExplorationStatusHeader';
import { ShipExploration } from './components/ShipExploration';
import { EvidenceReview } from './components/EvidenceReview';
import { SignalAnalysis } from './components/SignalAnalysis';
import { AICoreReveal } from './components/AICoreReveal';
import { FinalTransmission } from './components/FinalTransmission';
import { EndingScreen } from './components/EndingScreen';
import type { EvidenceId, EvidenceRecord } from './types/exploration';
import type { PuzzleId } from './components/SignalAnalysis';
import { loadStoredEvidence, saveStoredEvidence, clearStoredEvidence } from './utils/evidenceStorage';

type SceneState =
  | 'scene-a'
  | 'scene-b'
  | 'scene-c'
  | 'scene-mission-ready'
  | 'scene-docking'
  | 'scene-exploration'
  | 'scene-evidence-review'
  | 'scene-signal-analysis'
  | 'scene-ai-reveal'
  | 'scene-final-transmission'
  | 'scene-ending';

const PUZZLE_STORAGE_KEY = 'signal-lost-puzzles';

function loadSolvedPuzzles(): Set<PuzzleId> {
  try {
    const raw = localStorage.getItem(PUZZLE_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw) as PuzzleId[];
      return new Set(arr);
    }
  } catch {
    // ignore
  }
  return new Set();
}

function saveSolvedPuzzles(puzzles: Set<PuzzleId>) {
  try {
    localStorage.setItem(PUZZLE_STORAGE_KEY, JSON.stringify([...puzzles]));
  } catch {
    // ignore
  }
}

function clearSolvedPuzzles() {
  try {
    localStorage.removeItem(PUZZLE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function App() {
  const [currentScene, setCurrentScene] = useState<SceneState>('scene-a');
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [collectedEvidenceIds, setCollectedEvidenceIds] = useState<EvidenceId[]>(() =>
    loadStoredEvidence()
  );
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<PuzzleId>>(() => loadSolvedPuzzles());
  const [gameStartTime] = useState<number>(() => Date.now());

  const handleCollectEvidence = (evidence: EvidenceRecord) => {
    setCollectedEvidenceIds((prev) => {
      if (prev.includes(evidence.id)) return prev;
      const updated = [...prev, evidence.id];
      saveStoredEvidence(updated);
      return updated;
    });
  };

  const handlePuzzleSolved = (id: PuzzleId) => {
    setSolvedPuzzles((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveSolvedPuzzles(next);
      return next;
    });
  };

  const handleReplay = () => {
    setCurrentScene('scene-a');
    setCollectedEvidenceIds([]);
    setSolvedPuzzles(new Set());
    clearStoredEvidence();
    clearSolvedPuzzles();
  };

  // Determine header variant
  const isAboardOrpheus =
    currentScene === 'scene-exploration' || currentScene === 'scene-evidence-review';

  const isMilestone3Scene =
    currentScene === 'scene-signal-analysis' ||
    currentScene === 'scene-ai-reveal' ||
    currentScene === 'scene-final-transmission' ||
    currentScene === 'scene-ending';

  return (
    <div className="relative min-h-screen bg-[#02040a] text-slate-100 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Dynamic Starfield Canvas Background */}
      <Starfield />

      {/* Atmospheric CRT Scanline & Screen Vignette Overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-20 opacity-30" />
      <div className="fixed inset-0 crt-vignette pointer-events-none z-20" />
      <div className="fixed inset-0 space-grid pointer-events-none z-10 opacity-40" />

      {/* Top Header / Tactical Navigation HUD */}
      {isAboardOrpheus ? (
        <ExplorationStatusHeader
          evidenceCount={collectedEvidenceIds.length}
          onReturnToAstraea={() => setCurrentScene('scene-mission-ready')}
          onOpenEvidenceReview={() => setCurrentScene('scene-evidence-review')}
        />
      ) : (
        <HeaderNav
          currentScene={currentScene}
          onNavigateScene={(scene) => setCurrentScene(scene)}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        />
      )}

      {/* Main Experience Viewport */}
      <main className="relative z-20 flex-1 flex items-center justify-center py-4 px-2 sm:px-4">
        <AnimatePresence mode="wait">
          {currentScene === 'scene-a' && (
            <SceneA_Detection
              key="scene-a"
              onAdvance={() => setCurrentScene('scene-b')}
            />
          )}

          {currentScene === 'scene-b' && (
            <SceneB_Transmission
              key="scene-b"
              onComplete={() => setCurrentScene('scene-c')}
            />
          )}

          {currentScene === 'scene-c' && (
            <SceneC_Initiation
              key="scene-c"
              onInitiate={() => setCurrentScene('scene-mission-ready')}
              onReplayTransmission={() => setCurrentScene('scene-b')}
            />
          )}

          {currentScene === 'scene-mission-ready' && (
            <SceneD_MissionReady
              key="scene-mission-ready"
              onRestart={() => setCurrentScene('scene-a')}
              onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
              onInitiateBoarding={() => setCurrentScene('scene-docking')}
            />
          )}

          {currentScene === 'scene-docking' && (
            <DockingTransition
              key="scene-docking"
              onComplete={() => setCurrentScene('scene-exploration')}
            />
          )}

          {currentScene === 'scene-exploration' && (
            <ShipExploration
              key="scene-exploration"
              collectedEvidenceIds={collectedEvidenceIds}
              onCollectEvidence={handleCollectEvidence}
              onOpenEvidenceReview={() => setCurrentScene('scene-evidence-review')}
            />
          )}

          {currentScene === 'scene-evidence-review' && (
            <EvidenceReview
              key="scene-evidence-review"
              onReturnToExploration={() => setCurrentScene('scene-exploration')}
              onReturnToAstraea={() => setCurrentScene('scene-mission-ready')}
              onProceedToSignalAnalysis={() => setCurrentScene('scene-signal-analysis')}
            />
          )}

          {currentScene === 'scene-signal-analysis' && (
            <SignalAnalysis
              key="scene-signal-analysis"
              solvedPuzzles={solvedPuzzles}
              onPuzzleSolved={handlePuzzleSolved}
              onAllSolved={() => setCurrentScene('scene-ai-reveal')}
            />
          )}

          {currentScene === 'scene-ai-reveal' && (
            <AICoreReveal
              key="scene-ai-reveal"
              onComplete={() => setCurrentScene('scene-final-transmission')}
            />
          )}

          {currentScene === 'scene-final-transmission' && (
            <FinalTransmission
              key="scene-final-transmission"
              onComplete={() => setCurrentScene('scene-ending')}
            />
          )}

          {currentScene === 'scene-ending' && (
            <EndingScreen
              key="scene-ending"
              startTime={gameStartTime}
              collectedEvidenceCount={collectedEvidenceIds.length}
              solvedPuzzleCount={solvedPuzzles.size}
              onReplay={handleReplay}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Telemetry HUD Status Footer */}
      <footer className="relative z-30 w-full border-t border-cyan-950/40 bg-slate-950/80 backdrop-blur-md px-4 py-2 text-[11px] font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {isAboardOrpheus
                ? 'VESSEL STATUS: DOCKED AT AIRLOCK OMEGA-3'
                : isMilestone3Scene
                ? 'VESSEL STATUS: SIGNAL ACTIVE // THREAT LEVEL: UNKNOWN'
                : 'VESSEL STATUS: SUB-LIGHT DRIFT'}
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline">
              {isAboardOrpheus
                ? 'SHIP TELEMETRY: HARDWARE RECOVERY LINK ACTIVE'
                : isMilestone3Scene
                ? 'SUBSPACE ANOMALY: INTERNAL ORIGIN DETECTED'
                : 'SUBSPACE BAND: 1420.405 MHz [LOCKED]'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>
              {currentScene === 'scene-ending'
                ? 'MILESTONE 03 // INVESTIGATION COMPLETE'
                : isMilestone3Scene
                ? 'MILESTONE 03 // SIGNAL ANALYSIS'
                : isAboardOrpheus
                ? 'MILESTONE 02 // ORPHEUS-09: SHIP EXPLORATION'
                : 'MILESTONE 01 // FOUNDATION & OPENING'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400/80">SIGNAL LOST: THE LAST TRANSMISSION</span>
          </div>
        </div>
      </footer>

      {/* System Diagnostics Modal Overlay */}
      <SystemDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />
    </div>
  );
}

export default App;
