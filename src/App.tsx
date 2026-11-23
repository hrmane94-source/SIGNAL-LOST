import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Starfield } from './components/Starfield';
import { HeaderNav } from './components/HeaderNav';
import { SceneA_Detection } from './components/SceneA_Detection';
import { SceneB_Transmission } from './components/SceneB_Transmission';
import { SceneC_Initiation } from './components/SceneC_Initiation';
import { SceneD_MissionReady } from './components/SceneD_MissionReady';
import { SystemDiagnosticsModal } from './components/SystemDiagnosticsModal';

type SceneState = 'scene-a' | 'scene-b' | 'scene-c' | 'scene-mission-ready';

export function App() {
  const [currentScene, setCurrentScene] = useState<SceneState>('scene-a');
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#02040a] text-slate-100 flex flex-col justify-between overflow-x-hidden select-none">
      {/* Dynamic Starfield Canvas Background */}
      <Starfield />

      {/* Atmospheric CRT Scanline & Screen Vignette Overlay */}
      <div className="fixed inset-0 scanlines pointer-events-none z-20 opacity-30" />
      <div className="fixed inset-0 crt-vignette pointer-events-none z-20" />
      <div className="fixed inset-0 space-grid pointer-events-none z-10 opacity-40" />

      {/* Top Header / Tactical Navigation HUD */}
      <HeaderNav
        currentScene={currentScene}
        onNavigateScene={(scene) => setCurrentScene(scene)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
      />

      {/* Main Experience Viewport */}
      <main className="relative z-20 flex-1 flex items-center justify-center py-6 px-2 sm:px-4">
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
            />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Telemetry HUD Status Footer */}
      <footer className="relative z-30 w-full border-t border-cyan-950/40 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 text-[11px] font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              VESSEL STATUS: SUB-LIGHT DRIFT
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline">SUBSPACE BAND: 1420.405 MHz [LOCKED]</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>MILESTONE 01 // FOUNDATION & OPENING</span>
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
