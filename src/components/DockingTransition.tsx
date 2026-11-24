import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Crosshair, FastForward, CheckCircle2, Unlock, AlertCircle } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface DockingTransitionProps {
  onComplete: () => void;
}

interface DockingStep {
  id: number;
  label: string;
  sublabel: string;
  timeMs: number;
  isUnlocked?: boolean;
}

const DOCKING_STEPS: DockingStep[] = [
  {
    id: 1,
    label: 'DOCKING SEQUENCE INITIATED',
    sublabel: 'ALIGNING VANGUARD CRAFT WITH AIRLOCK PORT OMEGA-3',
    timeMs: 400,
  },
  {
    id: 2,
    label: 'APPROACHING VESSEL: ORPHEUS-09',
    sublabel: 'DISTANCE: 0.08 KM // THRUSTER ARREST MATRIX ACTIVE',
    timeMs: 1200,
  },
  {
    id: 3,
    label: 'DOCKING CLAMPS: ENGAGED',
    sublabel: 'MAGNETIC HARD-LOCK ANCHORED // HULL SEAL VERIFIED',
    timeMs: 2000,
  },
  {
    id: 4,
    label: 'PRESSURE EQUALIZATION: COMPLETE',
    sublabel: 'INTERNAL ATMOSPHERE STABILIZED AT 0.35 BAR',
    timeMs: 2800,
  },
  {
    id: 5,
    label: 'HATCH STATUS: UNLOCKED',
    sublabel: 'INVESTIGATION OPERATOR BOARDING CLEARANCE CONFIRMED',
    timeMs: 3600,
    isUnlocked: true,
  },
];

export const DockingTransition: React.FC<DockingTransitionProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const completedRef = useRef(false);

  const finishTransition = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    soundEngine.playClick();
    soundEngine.playLocationSwitch();
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Sound on enter
    soundEngine.playDockingClamp();

    const timers: ReturnType<typeof setTimeout>[] = [];

    DOCKING_STEPS.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStepIndex(index);
        if (index === 2) {
          soundEngine.playDockingClamp();
        } else if (index === 4) {
          soundEngine.playBlip(1100, 'sine', 0.12, 0.05);
        } else {
          soundEngine.playBlip(780, 'sine', 0.06, 0.03);
        }
      }, step.timeMs);
      timers.push(timer);
    });

    // Auto complete after step 5
    const finalTimer = setTimeout(() => {
      finishTransition();
    }, 4500);
    timers.push(finalTimer);

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [finishTransition]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-20 w-full max-w-4xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-[70vh] gap-8"
    >
      {/* Top Banner with Skip Button */}
      <div className="w-full flex items-center justify-between border-b border-cyan-900/40 pb-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-400 font-semibold tracking-wider">
            AUTOMATED AIRLOCK INTERFACE // ASTRAEA-IV TO ORPHEUS-09
          </span>
        </div>
        <button
          onClick={finishTransition}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900/70 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition text-[11px]"
        >
          <span>SKIP SEQUENCE</span>
          <FastForward className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>

      {/* Main Docking HUD Terminal */}
      <div className="relative w-full bg-slate-950/90 border border-cyan-500/40 rounded-xl p-6 sm:p-10 backdrop-blur-md shadow-[0_0_40px_rgba(0,240,255,0.15)] overflow-hidden">
        {/* Tactical Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

        <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

        {/* Central Graphic: Animated Airlock Ring Reticle */}
        <div className="relative z-10 flex flex-col items-center justify-center my-4">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 animate-[spin_12s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-cyan-400/20" />
            <div className="absolute inset-6 rounded-full border-2 border-cyan-400/50 animate-pulse" />

            {/* Inner hatch icon state */}
            <div className="relative z-10 flex flex-col items-center justify-center text-cyan-300">
              {currentStepIndex >= 4 ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-1 text-emerald-400"
                >
                  <Unlock className="w-10 h-10 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                    SEAL OPEN
                  </span>
                </motion.div>
              ) : currentStepIndex >= 2 ? (
                <div className="flex flex-col items-center gap-1 text-cyan-400">
                  <ShieldCheck className="w-10 h-10 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest uppercase">
                    LOCKED
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-400">
                  <Crosshair className="w-10 h-10 animate-spin" />
                  <span className="text-[10px] font-mono tracking-widest uppercase">
                    ALIGNING
                  </span>
                </div>
              )}
            </div>

            {/* Horizontal and vertical alignment calipers */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-500/20 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-cyan-500/20 pointer-events-none" />
          </div>
        </div>

        {/* Step-by-Step Readout Matrix */}
        <div className="relative z-10 space-y-3 max-w-2xl mx-auto my-6 font-mono">
          {DOCKING_STEPS.map((step, idx) => {
            const isPassed = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: idx <= currentStepIndex ? 1 : 0.25,
                  x: 0,
                }}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                    : isPassed
                    ? 'bg-slate-900/40 border-cyan-900/40 text-slate-300'
                    : 'bg-slate-950/30 border-slate-900 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <div>
                      <div
                        className={`text-xs sm:text-sm font-bold tracking-wider uppercase ${
                          step.isUnlocked && idx <= currentStepIndex
                            ? 'text-emerald-400 text-glow-cyan'
                            : isCurrent
                            ? 'text-cyan-300'
                            : ''
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {step.sublabel}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] tracking-wider font-mono">
                    {isPassed ? (
                      <span className="text-emerald-400">OK</span>
                    ) : isCurrent ? (
                      <span className="text-cyan-400 animate-pulse">ENGAGING...</span>
                    ) : (
                      <span className="text-slate-600">PENDING</span>
                    )}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer status notice */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-cyan-950/60">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>ATMOSPHERIC HAZARD: ORPHEUS-09 MAIN LIFE SUPPORT IS OFFLINE</span>
          </div>
          <span className="text-cyan-400/80">SUIT TELEMETRY: SEALED</span>
        </div>
      </div>
    </motion.div>
  );
};
