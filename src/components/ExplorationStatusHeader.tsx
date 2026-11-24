import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, ArrowLeft, Archive } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ExplorationStatusHeaderProps {
  evidenceCount: number;
  onReturnToAstraea: () => void;
  onOpenEvidenceReview?: () => void;
}

export const ExplorationStatusHeader: React.FC<ExplorationStatusHeaderProps> = ({
  evidenceCount,
  onReturnToAstraea,
  onOpenEvidenceReview,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());

  const handleAudioToggle = () => {
    const newMuted = soundEngine.toggleMute();
    setIsMuted(newMuted);
  };

  return (
    <header className="relative z-30 w-full border-b border-cyan-900/30 bg-slate-950/90 backdrop-blur-md px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Left: Vessel Status Specifications */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Back to Astraea link */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onReturnToAstraea();
            }}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-700 hover:border-cyan-500/50 bg-slate-900/60 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 transition text-[11px] font-mono mr-1"
            title="Return to Vanguard Rescue Vessel Astraea-IV"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">ASTRAEA-IV</span>
          </button>

          {/* VESSEL: ORPHEUS-09 */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400 font-medium">VESSEL:</span>
            <span className="text-white font-bold tracking-wider text-glow-cyan">
              ORPHEUS-09
            </span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* VESSEL STATUS: ABANDONED */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400 font-medium">STATUS:</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              ABANDONED
            </span>
          </div>

          <span className="text-slate-600 hidden md:inline">|</span>

          {/* CREW MANIFEST: 34 */}
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400 font-medium">CREW MANIFEST:</span>
            <span className="text-slate-200 font-semibold">34</span>
          </div>

          <span className="text-slate-600 hidden lg:inline">|</span>

          {/* LIFE SUPPORT: OFFLINE */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400 font-medium">LIFE SUPPORT:</span>
            <span className="text-red-400 font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-red-400" />
              OFFLINE
            </span>
          </div>

          <span className="text-slate-600 hidden lg:inline">|</span>

          {/* MISSION STATUS: INVESTIGATION IN PROGRESS */}
          <div className="hidden lg:flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400 font-medium">MISSION:</span>
            <span className="text-cyan-400 font-semibold">
              INVESTIGATION IN PROGRESS
            </span>
          </div>
        </div>

        {/* Right: Controls & Evidence Progress Badge */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Evidence Counter Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold tracking-wider transition ${
              evidenceCount === 3
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-current animate-pulse" />
            <span>EVIDENCE: {evidenceCount}/3</span>
          </div>

          {/* Quick Review Evidence shortcut when complete */}
          {evidenceCount === 3 && onOpenEvidenceReview && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenEvidenceReview();
              }}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-mono font-bold tracking-wider transition shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            >
              <span>REVIEW ARCHIVE</span>
            </button>
          )}

          {/* Audio toggle */}
          <button
            onClick={handleAudioToggle}
            type="button"
            className={`group flex items-center gap-2 px-2.5 py-1 rounded border text-[11px] font-mono tracking-wider transition ${
              isMuted
                ? 'border-slate-700/60 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                : 'border-cyan-500/40 bg-cyan-950/50 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.15)] hover:bg-cyan-900/40'
            }`}
            title={isMuted ? 'Click to enable procedural atmospheric audio' : 'Click to mute audio'}
            aria-label={isMuted ? 'Enable synthesized audio' : 'Mute audio'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline text-cyan-300">LIVE</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
