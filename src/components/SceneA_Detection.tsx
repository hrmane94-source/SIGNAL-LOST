import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, AlertTriangle, ArrowRight, Activity, Terminal } from 'lucide-react';
import { SignalWaveform } from './SignalWaveform';
import { soundEngine } from '../utils/audio';

interface SceneADetectionProps {
  onAdvance: () => void;
}

export const SceneA_Detection: React.FC<SceneADetectionProps> = ({ onAdvance }) => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [packetDecodedPercent, setPacketDecodedPercent] = useState(14);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodingStatus, setDecodingStatus] = useState<string>('');

  useEffect(() => {
    // Play initial chirp
    soundEngine.playBlip(720, 'sine', 0.1, 0.03);

    // Periodic micro-glitch and packet progress
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      soundEngine.playTransmissionBurst();
      setTimeout(() => setGlitchActive(false), 240);
    }, 4500);

    const progressInterval = setInterval(() => {
      setPacketDecodedPercent((prev) => (prev < 98 ? prev + Math.floor(Math.random() * 8 + 3) : 98));
    }, 600);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleProceed = () => {
    if (isDecoding) return; // Prevent repeated clicks
    setIsDecoding(true);
    soundEngine.playClick();
    soundEngine.playTransmissionBurst();
    setDecodingStatus('INITIALIZING QUANTUM CARRIER DECODER...');

    setTimeout(() => {
      setDecodingStatus('SYNCHRONIZING HYDROGEN BEACON (1420.405 MHz)...');
      soundEngine.playBlip(980, 'sine', 0.08, 0.04);
    }, 380);

    setTimeout(() => {
      setDecodingStatus('DECOMPRESSING ORPHEUS-09 TRANSMISSION STREAM...');
      soundEngine.playTransmissionBurst();
    }, 750);

    setTimeout(() => {
      setDecodingStatus('CARRIER DEMODULATED // OPENING TRANSMISSION...');
      soundEngine.playBlip(1200, 'sine', 0.1, 0.05);
    }, 1100);

    setTimeout(() => {
      onAdvance();
    }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-6"
    >
      {/* Top Status Banner */}
      <motion.div
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-950/70 border border-cyan-500/30 rounded-md backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-mono tracking-widest text-red-400 font-semibold uppercase">
            Emergency Inbound Transmission Intercepted
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span className="text-cyan-400">ARRAY: 7-OCTANT DEEP RECEIVER</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-300">CARRIER LOCK: ESTABLISHED</span>
        </div>
      </motion.div>

      {/* Main Signal Display Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className={`relative bg-slate-950/85 border ${
          glitchActive ? 'border-red-500/70 shadow-[0_0_30px_rgba(239,68,68,0.25)]' : 'border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.12)]'
        } rounded-xl p-6 md:p-8 backdrop-blur-lg overflow-hidden transition-all duration-200`}
      >
        {/* Tactical Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

        {/* Subtle scanline overlay inside card */}
        <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

        {/* Content Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Required Signal Identification */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Header / Subtitle */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-wider">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>RECEIVER PROTOCOL // SEC-12</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-white uppercase text-glow-cyan">
                SIGNAL DETECTED
              </h1>
            </div>

            {/* Core Required Specifications Table / Terminal Readout */}
            <div className="bg-slate-900/80 border border-cyan-900/60 rounded-lg p-5 font-mono text-sm space-y-3.5">
              
              {/* UNKNOWN SOURCE */}
              <div className="flex items-start justify-between border-b border-cyan-950 pb-2.5">
                <span className="text-slate-400 text-xs tracking-wider">SOURCE CLASSIFICATION</span>
                <span className="text-amber-400 font-semibold tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  UNKNOWN SOURCE
                </span>
              </div>

              {/* ORIGIN: DEEP SPACE */}
              <div className="flex items-start justify-between border-b border-cyan-950 pb-2.5">
                <span className="text-slate-400 text-xs tracking-wider">ORIGIN COORDINATES</span>
                <span className="text-cyan-300 font-semibold tracking-wider">
                  ORIGIN: DEEP SPACE
                </span>
              </div>

              {/* VESSEL: ORPHEUS-09 */}
              <div className="flex items-start justify-between border-b border-cyan-950 pb-2.5">
                <span className="text-slate-400 text-xs tracking-wider">VESSEL DESIGNATION</span>
                <span className="text-red-400 font-bold tracking-widest text-glow-red flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  VESSEL: ORPHEUS-09
                </span>
              </div>

              {/* LAST KNOWN CONTACT: 17 YEARS AGO */}
              <div className="flex items-start justify-between">
                <span className="text-slate-400 text-xs tracking-wider">TEMPORAL LOG</span>
                <span className="text-slate-200 font-semibold tracking-wider">
                  LAST KNOWN CONTACT: 17 YEARS AGO
                </span>
              </div>
            </div>

            {/* Diagnostic Hex & Status */}
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-cyan-400/90">TRANSMISSION HASH:</span>
                <span className="text-slate-300 font-mono">0x4F5250484555532D3039</span>
              </div>
              <div className="text-cyan-400">
                BUFFER: {packetDecodedPercent}% CACHED
              </div>
            </div>

          </div>

          {/* Right Column: Waveform & Tactical Diagnostics */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Signal Waveform Component */}
            <SignalWaveform
              statusText={isDecoding ? (decodingStatus || 'DECODING TRANSMISSION STREAM...') : 'RECEIVER 1420.405 MHz // CARRIER WAVE'}
              frequency="1420.405 MHz"
              isLocked={true}
              amplitude={isDecoding ? 1.8 : 1.1}
              isDecoding={isDecoding}
            />

            {/* Diagnostic Matrix Panel */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-slate-900/60 border border-cyan-900/40 p-2.5 rounded">
                <div className="text-slate-400 text-[10px]">FREQ BAND</div>
                <div className="text-cyan-300 font-semibold mt-0.5">1420.405 MHz</div>
                <div className="text-slate-400 text-[10px] mt-0.5">Hydrogen Line 21cm</div>
              </div>
              <div className="bg-slate-900/60 border border-cyan-900/40 p-2.5 rounded">
                <div className="text-slate-400 text-[10px]">SIGNAL TYPE</div>
                <div className="text-amber-300 font-semibold mt-0.5">MIL-SPEC ENCRYPTED</div>
                <div className="text-slate-400 text-[10px] mt-0.5">Alg: Orpheus-AES</div>
              </div>
              <div className="bg-slate-900/60 border border-cyan-900/40 p-2.5 rounded">
                <div className="text-slate-400 text-[10px]">ESTIMATED DISTANCE</div>
                <div className="text-white font-semibold mt-0.5">12,480 KM</div>
                <div className="text-slate-400 text-[10px] mt-0.5">Bearing: 042° mark 7</div>
              </div>
              <div className="bg-slate-900/60 border border-cyan-900/40 p-2.5 rounded">
                <div className="text-slate-400 text-[10px]">HULL TELEMETRY</div>
                <div className="text-red-400 font-semibold mt-0.5">LIFE SUPPORT CRIT</div>
                <div className="text-slate-400 text-[10px] mt-0.5">Passive thermal only</div>
              </div>
            </div>

            {/* Prompt Action Button */}
            <button
              onClick={handleProceed}
              disabled={isDecoding}
              type="button"
              className={`group relative mt-2 w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-lg font-heading font-semibold text-sm tracking-wider uppercase transition-all duration-200 border ${
                isDecoding
                  ? 'bg-cyan-500/25 border-cyan-300 text-white shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-wait'
                  : 'bg-gradient-to-r from-cyan-600/30 via-cyan-500/20 to-sky-600/30 hover:from-cyan-500/40 hover:to-sky-500/40 border-cyan-400/60 text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:text-white'
              }`}
            >
              <Activity className={`w-4 h-4 text-cyan-400 ${isDecoding ? 'animate-spin' : 'group-hover:animate-spin'}`} />
              <span>{isDecoding ? (decodingStatus || 'DECODING TRANSMISSION...') : 'DECRYPT INCOMING TRANSMISSION'}</span>
              <ArrowRight className={`w-4 h-4 text-cyan-400 ${isDecoding ? 'opacity-0' : 'group-hover:translate-x-1 transition-transform'}`} />
            </button>
          </div>

        </div>

      </motion.div>

      {/* Atmospheric Footer Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-between text-xs font-mono text-slate-400 px-2"
      >
        <span>SYS: ASTRAEA-IV DEEP COMM SUITE V9.4</span>
        <span className="text-cyan-500/70">AWAITING INVESTIGATOR COMMAND TO DECODE</span>
      </motion.div>
    </motion.div>
  );
};
