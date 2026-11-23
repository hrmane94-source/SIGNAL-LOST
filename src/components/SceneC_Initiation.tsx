import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, ChevronRight, AlertCircle, Compass, Radio, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface SceneCInitiationProps {
  onInitiate: () => void;
  onReplayTransmission: () => void;
}

export const SceneC_Initiation: React.FC<SceneCInitiationProps> = ({
  onInitiate,
  onReplayTransmission,
}) => {
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authStep, setAuthStep] = useState<string>('');

  const handleInitiateClick = () => {
    if (isAuthorizing) return; // Prevent repeated clicks
    setIsAuthorizing(true);
    soundEngine.playClick();
    soundEngine.playInitiateSequence();

    // Controlled authorization sequence
    setAuthStep('CONNECTING TO ASTRAEA-IV MAIN FRAMEWORK...');
    
    setTimeout(() => {
      setAuthStep('LOCKING ONTO ORPHEUS-09 BEACON (1420.405 MHz)...');
      soundEngine.playBlip(1040, 'sine', 0.08, 0.04);
    }, 380);

    setTimeout(() => {
      setAuthStep('ENGAGING QUARANTINE ENCRYPTION LAYER...');
      soundEngine.playBlip(1200, 'sine', 0.08, 0.04);
    }, 800);

    setTimeout(() => {
      setAuthStep('MISSION INITIALIZED // CLEARANCE GRANTED');
      soundEngine.playBlip(1400, 'sine', 0.12, 0.05);
    }, 1200);

    setTimeout(() => {
      onInitiate();
    }, 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center text-center gap-8"
    >
      {/* Upper Tactical Status Pill */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
      >
        <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="tracking-widest uppercase">PHASE 03 // MISSION AUTHORIZATION DIRECTIVE</span>
      </motion.div>

      {/* Main Title Group */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="space-y-3"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight text-white uppercase text-glow-cyan leading-none">
          SIGNAL LOST
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-semibold tracking-[0.25em] sm:tracking-[0.35em] text-cyan-400 uppercase text-glow-cyan">
          THE LAST TRANSMISSION
        </h2>
      </motion.div>

      {/* Concise Required Mission Parameters Box */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.7 }}
        className="w-full max-w-2xl bg-slate-950/85 border border-cyan-500/40 rounded-xl p-6 md:p-8 backdrop-blur-md relative shadow-[0_0_30px_rgba(0,240,255,0.12)] text-left"
      >
        {/* Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

        {/* Scanlines inside container */}
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 border-b border-cyan-950 pb-2.5">
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">INVESTIGATION PROTOCOL // CLEARANCE SEC-04</span>
            </span>
            <span className="text-slate-400">SECTOR: PERSEUS VOID</span>
          </div>

          {/* Exact Required Mission and Objective Fields */}
          <div className="space-y-3 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 p-3 bg-slate-900/70 border border-cyan-900/50 rounded-lg">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase shrink-0">
                MISSION:
              </span>
              <span className="text-base sm:text-lg font-bold text-white tracking-widest text-glow-cyan">
                ORPHEUS-09
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 p-3 bg-slate-900/70 border border-cyan-900/50 rounded-lg">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase shrink-0">
                OBJECTIVE:
              </span>
              <span className="text-sm sm:text-base font-semibold text-cyan-300">
                Investigate the missing vessel.
              </span>
            </div>
          </div>

          {/* Tactical Context Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-cyan-950/80 text-[11px] font-mono">
            <div className="bg-slate-900/50 p-2.5 rounded border border-cyan-900/30">
              <div className="text-slate-400 text-[10px]">VESSEL</div>
              <div className="text-white font-semibold mt-0.5">ORPHEUS-09</div>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded border border-cyan-900/30">
              <div className="text-slate-400 text-[10px]">CURRENT RANGE</div>
              <div className="text-cyan-300 font-semibold mt-0.5">12,480 KM</div>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded border border-cyan-900/30">
              <div className="text-slate-400 text-[10px]">LAST CONTACT</div>
              <div className="text-slate-200 font-semibold mt-0.5">17 YEARS AGO</div>
            </div>
            <div className="bg-slate-900/50 p-2.5 rounded border border-cyan-900/30">
              <div className="text-slate-400 text-[10px]">BEACON FREQ</div>
              <div className="text-cyan-400 font-semibold mt-0.5">1420.405 MHz</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prominent INITIATE MISSION Button & Authorization Status */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="w-full max-w-md flex flex-col items-center gap-4"
      >
        <button
          onClick={handleInitiateClick}
          disabled={isAuthorizing}
          type="button"
          className={`group relative w-full py-4 sm:py-5 px-8 rounded-xl font-heading font-bold text-base sm:text-lg tracking-widest uppercase transition-all duration-300 ${
            isAuthorizing
              ? 'bg-cyan-500/30 border-cyan-300 text-white shadow-[0_0_40px_rgba(0,240,255,0.6)] cursor-wait'
              : 'bg-gradient-to-r from-cyan-600 via-sky-500 to-cyan-500 text-slate-950 hover:text-black hover:shadow-[0_0_45px_rgba(0,240,255,0.7)] hover:scale-[1.02] active:scale-[0.99] border-2 border-cyan-200 cursor-pointer'
          }`}
        >
          {/* Tactical button highlights */}
          <span className="absolute top-1 left-2 w-1.5 h-1.5 bg-white/70 rounded-full" />
          <span className="absolute bottom-1 right-2 w-1.5 h-1.5 bg-white/70 rounded-full" />

          <div className="flex items-center justify-center gap-3">
            <Crosshair className={`w-5 h-5 ${isAuthorizing ? 'animate-spin' : 'group-hover:rotate-90 transition-transform duration-300'}`} />
            <span>{isAuthorizing ? 'AUTHORIZING MISSION...' : 'INITIATE MISSION'}</span>
            <ChevronRight className={`w-5 h-5 ${isAuthorizing ? 'opacity-0' : 'group-hover:translate-x-1.5 transition-transform'}`} />
          </div>
        </button>

        {/* Dynamic Authorization Progress or Prompt & Replay Button */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="min-h-[24px] text-xs font-mono">
            {isAuthorizing ? (
              <div className="flex items-center gap-2 text-cyan-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>{authStep}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-400">
                <AlertCircle className="w-3.5 h-3.5 text-cyan-500/80" />
                <span>CONFIRM INVESTIGATION PROTOCOL TO COMMENCE BOARDING VECTOR</span>
              </div>
            )}
          </div>

          {/* Replay Transmission Button */}
          {!isAuthorizing && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onReplayTransmission();
              }}
              type="button"
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/50 bg-slate-900/60 hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-300 text-xs font-mono transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>REPLAY TRANSMISSION STORY</span>
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
