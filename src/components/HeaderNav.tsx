import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, ShieldAlert, Cpu } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeaderNavProps {
  currentScene: 'scene-a' | 'scene-b' | 'scene-c' | 'scene-mission-ready';
  onNavigateScene?: (scene: 'scene-a' | 'scene-b' | 'scene-c') => void;
  onOpenDiagnostics: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScene,
  onNavigateScene,
  onOpenDiagnostics,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());
  const [timestamp, setTimestamp] = useState('2189.324 // 08:42:19 UTC');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      const dayOfYear = Math.floor(
        (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
      );
      setTimestamp(`2189.${dayOfYear} // ${hours}:${mins}:${secs} UTC`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAudioToggle = () => {
    const newMuted = soundEngine.toggleMute();
    setIsMuted(newMuted);
  };

  const getSceneBadge = () => {
    switch (currentScene) {
      case 'scene-a':
        return { label: 'PHASE 01: SIGNAL DETECTION', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' };
      case 'scene-b':
        return { label: 'PHASE 02: TRANSMISSION INTERCEPTION', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30' };
      case 'scene-c':
        return { label: 'PHASE 03: MISSION INITIATION', color: 'text-sky-400 border-sky-500/40 bg-sky-950/30' };
      case 'scene-mission-ready':
        return { label: 'PHASE 04: MISSION READY', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' };
    }
  };

  const badge = getSceneBadge();

  return (
    <header className="relative z-30 w-full border-b border-cyan-900/30 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        
        {/* Left: Vessel ID and Sector */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded border border-cyan-500/40 bg-cyan-950/40 text-cyan-400">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-white">
                ASTRAEA-IV
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
                SAR-04
              </span>
              <span className="hidden sm:inline text-[10px] font-mono text-slate-400">
                // PERSEUS EXPANSE SECTOR 12-Ω
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
              <span>OP: INVESTIGATION COMMAND</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400/90">{timestamp}</span>
            </div>
          </div>
        </div>

        {/* Center: Phase Tracker */}
        <div className="flex items-center gap-2">
          <div className={`text-[11px] font-mono tracking-widest px-2.5 py-1 rounded border flex items-center gap-2 ${badge.color}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span>{badge.label}</span>
          </div>

          {currentScene !== 'scene-mission-ready' && onNavigateScene && (
            <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-slate-400 ml-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onNavigateScene('scene-a');
                }}
                className={`px-2 py-0.5 rounded transition ${currentScene === 'scene-a' ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' : 'hover:text-slate-200'}`}
              >
                01.DETECTION
              </button>
              <span>›</span>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onNavigateScene('scene-b');
                }}
                className={`px-2 py-0.5 rounded transition ${currentScene === 'scene-b' ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' : 'hover:text-slate-200'}`}
              >
                02.INTERCEPTION
              </button>
              <span>›</span>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onNavigateScene('scene-c');
                }}
                className={`px-2 py-0.5 rounded transition ${currentScene === 'scene-c' ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' : 'hover:text-slate-200'}`}
              >
                03.INITIATION
              </button>
            </div>
          )}
        </div>

        {/* Right: Controls & Diagnostics */}
        <div className="flex items-center gap-2 self-end md:self-auto">
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
                <span className="hidden sm:inline">AUDIO: MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-1.5 bg-cyan-400 animate-[pulse_1s_infinite]" />
                  <span className="w-0.5 h-3 bg-cyan-400 animate-[pulse_0.7s_infinite_0.2s]" />
                  <span className="w-0.5 h-2 bg-cyan-400 animate-[pulse_0.9s_infinite_0.4s]" />
                </div>
                <span className="hidden sm:inline text-cyan-300">AUDIO: LIVE</span>
              </>
            )}
          </button>

          {/* Diagnostic telemetry modal toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenDiagnostics();
            }}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-cyan-800/40 bg-slate-900/40 text-[11px] font-mono text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-600/50 transition"
            title="Inspect Spacecraft Telemetry & Frequencies"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">DIAGNOSTICS</span>
          </button>

          {/* Warning badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded border border-red-500/30 bg-red-950/30 text-[10px] font-mono text-red-400">
            <ShieldAlert className="w-3 h-3 text-red-400 animate-pulse" />
            <span className="hidden md:inline">ORPHEUS-09 DETECTED</span>
          </div>
        </div>
      </div>
    </header>
  );
};
