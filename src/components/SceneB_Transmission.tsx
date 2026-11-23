import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, FastForward, RotateCcw, Radio, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { SignalWaveform } from './SignalWaveform';

interface SceneBTransmissionProps {
  onComplete: () => void;
}

interface NarrativeSegment {
  id: number;
  tag: string;
  body: string;
  subtext: string;
}

const NARRATIVE_STEPS: NarrativeSegment[] = [
  {
    id: 1,
    tag: 'TEMPORAL MARK // 2189',
    body: 'Year 2189.',
    subtext: 'PERSEUS SECTOR 12-Ω // RECOVERY CHRONOMETER ACTIVE',
  },
  {
    id: 2,
    tag: 'CLASSIFIED ARCHIVE // 2172 EXPEDITION',
    body: 'Seventeen years ago, research vessel ORPHEUS-09 disappeared during a classified deep-space research mission.',
    subtext: 'CREW COMPLEMENT: 34 // TITAN DRYDOCK 03 // ARCHIVE VAULT SEALED',
  },
  {
    id: 3,
    tag: 'STATUS REPORT // HISTORICAL RECORD',
    body: 'No distress signal. No survivors. No explanation.',
    subtext: 'SEARCH EFFORTS CEASED 2173 // FORMAL LOSS DESIGNATION RECORDED',
  },
  {
    id: 4,
    tag: 'CARRIER ANOMALY DETECTED',
    body: 'Until now.',
    subtext: 'ELECTROMAGNETIC BURST RECEIVED // FREQUENCY: 1420.405 MHz',
  },
  {
    id: 5,
    tag: 'LIVE BEACON INTERCEPTION',
    body: 'An unknown transmission has been detected from its last known coordinates.',
    subtext: 'BEACON ORIGIN CONFIRMED: ORPHEUS-09 RESEARCH PLATFORM',
  },
];

export const SceneB_Transmission: React.FC<SceneBTransmissionProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoTimerPercent, setAutoTimerPercent] = useState(0);
  const lastAdvanceTimeRef = useRef<number>(0);

  // Advance to next stage, debounced to prevent repeated fast clicks from breaking animations
  const advanceStep = useCallback(() => {
    const now = Date.now();
    if (now - lastAdvanceTimeRef.current < 250) return; // Prevent double-clicks
    lastAdvanceTimeRef.current = now;

    soundEngine.playBlip(920, 'sine', 0.08, 0.04);
    soundEngine.playTransmissionBurst();
    setAutoTimerPercent(0);

    setCurrentIndex((prev) => {
      if (prev < NARRATIVE_STEPS.length - 1) {
        return prev + 1;
      } else {
        setTimeout(onComplete, 0);
        return prev;
      }
    });
  }, [onComplete]);

  // Go back to previous stage
  const prevStep = useCallback(() => {
    const now = Date.now();
    if (now - lastAdvanceTimeRef.current < 250) return;
    lastAdvanceTimeRef.current = now;

    soundEngine.playClick();
    setAutoTimerPercent(0);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Replay transmission from beginning
  const replayTransmission = useCallback(() => {
    soundEngine.playClick();
    soundEngine.playTransmissionBurst();
    setAutoTimerPercent(0);
    setCurrentIndex(0);
  }, []);

  // Controlled timing for each cinematic phrase (3.2 seconds each - brisk & engaging)
  useEffect(() => {
    const duration = 3200;
    const interval = 40;
    let accumulated = 0;

    const timer = setInterval(() => {
      accumulated += interval;
      const pct = Math.min(100, (accumulated / duration) * 100);
      setAutoTimerPercent(pct);

      if (accumulated >= duration) {
        accumulated = 0;
        advanceStep();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, advanceStep]);

  // Keyboard navigation: Space/Enter/ArrowRight advances, ArrowLeft goes back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        advanceStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advanceStep, prevStep]);

  const currentStep = NARRATIVE_STEPS[Math.min(currentIndex, NARRATIVE_STEPS.length - 1)] ?? NARRATIVE_STEPS[0];
  const isLastStep = currentIndex === NARRATIVE_STEPS.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-6"
    >
      {/* Top Controls: Step Tracker, Replay, and Skip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 border-b border-cyan-900/40 pb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-cyan-400 font-semibold uppercase">TRANSMISSION INTERCEPTION</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            SEQUENCE {currentIndex + 1} OF {NARRATIVE_STEPS.length}
          </span>
        </div>

        {/* Action Buttons: Replay & Skip */}
        <div className="flex items-center gap-2">
          <button
            onClick={replayTransmission}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/60 hover:bg-cyan-950/50 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition text-[11px]"
            title="Replay transmission from the beginning"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            <span>REPLAY</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onComplete();
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900/60 hover:bg-cyan-950/50 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition text-[11px]"
            title="Skip straight to Mission Initiation"
          >
            <span>SKIP TO MISSION BRIEF</span>
            <FastForward className="w-3 h-3 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Main Narrative Cinema Card */}
      <div
        onClick={advanceStep}
        role="button"
        tabIndex={0}
        aria-label="Click to advance transmission story"
        className="relative bg-slate-950/85 border border-cyan-500/40 rounded-xl p-6 sm:p-10 md:p-12 backdrop-blur-md overflow-hidden min-h-[380px] flex flex-col justify-between shadow-[0_0_35px_rgba(0,240,255,0.15)] cursor-pointer select-none group"
      >
        {/* Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

        {/* Subtle scanline overlay */}
        <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

        {/* Top Card Telemetry Header */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400/90 font-semibold">{currentStep.tag}</span>
          </div>
          <div className="text-slate-400 text-[11px] font-mono">
            CARRIER LOCK: 1420.405 MHz
          </div>
        </div>

        {/* Animated Text Body */}
        <div className="relative z-10 my-6 sm:my-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Highlight Tag */}
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-700/50 text-[11px] font-mono text-cyan-300">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>INCOMING STREAM STAGE 0{currentStep.id}</span>
              </div>

              {/* Exact Cinematic Story Text Required */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white tracking-tight leading-tight text-glow-cyan">
                "{currentStep.body}"
              </h2>

              {/* Sub-telemetry context */}
              <p className="text-xs sm:text-sm font-mono text-cyan-400/80 pt-2 border-t border-cyan-950/70">
                {currentStep.subtext}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Waveform & Stepper Progress Bar */}
        <div className="relative z-10 space-y-4" onClick={(e) => e.stopPropagation()}>
          <SignalWaveform
            statusText={`TRANSMISSION CARRIER WAVE // STAGE ${currentIndex + 1} OF 5`}
            frequency="1420.405 MHz"
            isLocked={true}
            amplitude={1.0}
            className="!p-2.5 !bg-slate-900/60"
          />

          {/* Stepper Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-cyan-400">
                DECODING SEQUENCE // {Math.round(autoTimerPercent)}%
              </span>
              <span className="text-slate-400">CLICK CARD OR PRESS SPACE TO ADVANCE</span>
            </div>
            
            {/* 5-Segment Progress Indicator */}
            <div className="grid grid-cols-5 gap-2 h-1.5 w-full">
              {NARRATIVE_STEPS.map((step, idx) => (
                <div
                  key={step.id}
                  className="relative h-full bg-slate-800 rounded-full overflow-hidden"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-cyan-400 transition-all duration-75"
                    style={{
                      width:
                        idx < currentIndex
                          ? '100%'
                          : idx === currentIndex
                          ? `${autoTimerPercent}%`
                          : '0%',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentIndex > 0 && (
            <button
              onClick={prevStep}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-mono transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>PREVIOUS</span>
            </button>
          )}
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            INVESTIGATION VESSEL: <span className="text-slate-300">ASTRAEA-IV</span>
          </span>
        </div>

        <button
          onClick={advanceStep}
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-950/70 hover:bg-cyan-900/60 border border-cyan-500/50 hover:border-cyan-400 rounded-lg text-cyan-200 text-xs font-mono tracking-wider transition shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:text-white"
        >
          <span>{isLastStep ? 'PROCEED TO MISSION INITIATION' : 'CONTINUE TRANSMISSION'}</span>
          <ChevronRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
    </motion.div>
  );
};
