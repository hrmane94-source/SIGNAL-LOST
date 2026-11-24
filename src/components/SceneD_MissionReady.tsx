import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, Cpu, Radio, ShieldCheck, Terminal, Compass, Crosshair, ChevronRight } from 'lucide-react';
import { SignalWaveform } from './SignalWaveform';
import { soundEngine } from '../utils/audio';

interface SceneDMissionReadyProps {
  onRestart: () => void;
  onOpenDiagnostics: () => void;
  onInitiateBoarding: () => void;
}

export const SceneD_MissionReady: React.FC<SceneDMissionReadyProps> = ({
  onRestart,
  onOpenDiagnostics,
  onInitiateBoarding,
}) => {
  const [distanceKm, setDistanceKm] = useState(12480);
  const [relativeVelocity] = useState(42.8);

  useEffect(() => {
    // Distance closing simulation
    const interval = setInterval(() => {
      setDistanceKm((prev) => (prev > 100 ? prev - 2 : 12480));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-6"
    >
      {/* Primary Confirmation Banner */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative bg-emerald-950/40 border-2 border-emerald-500/60 rounded-xl p-5 md:p-6 backdrop-blur-md shadow-[0_0_35px_rgba(16,185,129,0.2)] overflow-hidden"
      >
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-900/60 border border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                  INVESTIGATION CLEARANCE CONFIRMED
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-500/30">
                  READY
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight mt-0.5">
                MISSION INITIALIZED: INVESTIGATION READY TO BEGIN
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-emerald-300/80 bg-emerald-950/60 px-3 py-2 rounded-lg border border-emerald-500/30">
            <div>
              <div className="text-[10px] text-slate-400">CLEARANCE CODE</div>
              <div className="text-white font-bold">ORP-2189-INV-01</div>
            </div>
            <div className="border-l border-emerald-800/60 pl-3">
              <div className="text-[10px] text-slate-400">TIME TO INTERCEPT</div>
              <div className="text-cyan-300 font-bold">00:14:32</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Mission Briefing & Telemetry Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Mission Status & Investigation Objectives */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Target Vessel Profile Card */}
          <div className="relative bg-slate-950/85 border border-cyan-500/40 rounded-xl p-6 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.08)]">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Compass className="w-4 h-4" />
                <span className="font-semibold">TARGET VESSEL PROFILE // ORPHEUS-09</span>
              </div>
              <span className="text-[11px] font-mono text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-500/30">
                DERELICT ANOMALY
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-mono">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-cyan-950">
                <div>
                  <span className="text-slate-400 text-xs">Vessel Class:</span>
                  <div className="text-white font-medium mt-0.5">Deep Space Research Carrier (Tier IV)</div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Original Launch:</span>
                  <div className="text-white font-medium mt-0.5">August 2168 (Titan Drydock 03)</div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Signal Frequency:</span>
                  <div className="text-cyan-300 font-medium mt-0.5">1420.405 MHz (Carrier Locked)</div>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Original Manifest:</span>
                  <div className="text-white font-medium mt-0.5">34 Researchers & Engineering Crew</div>
                </div>
              </div>

              {/* Mission Objectives Matrix */}
              <div className="pt-2">
                <div className="text-xs text-slate-400 font-semibold mb-2">
                  INVESTIGATION READINESS MATRIX:
                </div>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-emerald-400 font-semibold">Subspace Telemetry:</span> Carrier frequency 1420.405 MHz locked at 99.8% stability.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-emerald-400 font-semibold">Quarantine Shields:</span> Level 4 biosafety and electromagnetic dampeners engaged.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-emerald-400 font-semibold">Milestone 01 Scope:</span> Foundation, signal detection, transmission decoder and initiation interaction successfully verified.
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Milestone 02 Boarding Initiation */}
          <div className="bg-slate-900/70 border border-cyan-500/40 rounded-xl p-5 font-mono text-xs text-slate-300 space-y-4 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
              <span className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ORPHEUS-09 BOARDING VECTOR: CLEARED
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                AIRLOCK ENGAGED
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              Vanguard craft <span className="text-white font-semibold">Astraea-IV</span> has synchronized trajectory with the research vessel. Airlock alignment and quarantine seals are primed.
            </p>
            <button
              onClick={() => {
                soundEngine.playClick();
                onInitiateBoarding();
              }}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-cyan-500 hover:from-cyan-500 hover:to-sky-400 text-slate-950 font-bold text-sm tracking-wider uppercase transition shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
            >
              <Crosshair className="w-5 h-5 text-slate-950" />
              <span>INITIATE BOARDING SEQUENCE</span>
              <ChevronRight className="w-5 h-5 text-slate-950" />
            </button>
          </div>

        </div>

        {/* Right Column: Real-time Telemetry & Signal Lock */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Active Waveform */}
          <SignalWaveform
            statusText="TELEMETRY LOCK // ORPHEUS-09 TRANSMITTER"
            frequency="1420.405 MHz"
            isLocked={true}
            amplitude={1.2}
          />

          {/* Intercept Telemetry Box */}
          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-5 font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
              <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                APPROACH TELEMETRY
              </span>
              <span className="text-emerald-400">VECTOR NOMINAL</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/60 p-3 rounded border border-cyan-900/30">
                <div className="text-slate-400 text-[10px]">CURRENT DISTANCE</div>
                <div className="text-xl font-heading font-bold text-white mt-1">
                  {distanceKm.toLocaleString()} KM
                </div>
                <div className="text-cyan-400 text-[10px] mt-0.5">Closing vector</div>
              </div>

              <div className="bg-slate-900/60 p-3 rounded border border-cyan-900/30">
                <div className="text-slate-400 text-[10px]">RELATIVE VELOCITY</div>
                <div className="text-xl font-heading font-bold text-cyan-300 mt-1">
                  {relativeVelocity} KM/S
                </div>
                <div className="text-slate-400 text-[10px] mt-0.5">Thrusters: Station-keep</div>
              </div>
            </div>

            {/* Diagnostic Terminal Snippet */}
            <div className="bg-black/50 p-3 rounded border border-slate-800 text-[11px] text-cyan-400/90 font-mono space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Terminal className="w-3 h-3 text-cyan-500" />
                <span>TERMINAL LOG [2189.324]:</span>
              </div>
              <div className="text-emerald-400">&gt; Carrier lock acquired: 1420.405 MHz</div>
              <div className="text-cyan-300">&gt; Investigation handshake: VALIDATED</div>
              <div className="text-slate-400">&gt; Awaiting Milestone 02 Boarding Protocol</div>
            </div>

            {/* Interactive Control Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onRestart();
                }}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-mono transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>REPLAY TRANSMISSION</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenDiagnostics();
                }}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-mono transition"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>INSPECT SENSORS</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
};
