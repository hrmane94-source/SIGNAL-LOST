import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Activity, Radio, Shield, Terminal, Zap } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface SystemDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemDiagnosticsModal: React.FC<SystemDiagnosticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playClick();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleClose = () => {
    soundEngine.playClick();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-3xl bg-slate-950 border border-cyan-500/50 rounded-xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden"
          >
            {/* Corner Brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

            {/* Scanlines inside modal */}
            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-cyan-950 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                  <Cpu className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white tracking-wide uppercase">
                    SPACECRAFT TELEMETRY & DIAGNOSTICS
                  </h3>
                  <p className="text-xs font-mono text-cyan-400/80">
                    ASTRAEA-IV // CORE SUBSYSTEM MONITOR // YEAR 2189
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                type="button"
                className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white hover:border-cyan-400 transition"
                aria-label="Close Diagnostics"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="relative z-10 space-y-6 text-xs font-mono">
              
              {/* Telemetry Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900/70 p-3 rounded-lg border border-cyan-900/40">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>HYDROGEN LINE</span>
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-base font-bold text-white">1420.405 MHz</div>
                  <div className="text-[10px] text-emerald-400 mt-1">LOCK STABILITY: 99.8%</div>
                </div>

                <div className="bg-slate-900/70 p-3 rounded-lg border border-cyan-900/40">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>SPECTRAL SNR</span>
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-base font-bold text-white">+34.2 dB</div>
                  <div className="text-[10px] text-cyan-300 mt-1">NOISE FLOOR: -112 dBm</div>
                </div>

                <div className="bg-slate-900/70 p-3 rounded-lg border border-cyan-900/40">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>QUARANTINE DEFENSE</span>
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-base font-bold text-emerald-400">LEVEL 4 ACTIVE</div>
                  <div className="text-[10px] text-slate-400 mt-1">BIO-SEAL: NOMINAL</div>
                </div>
              </div>

              {/* Subspace Signal Decomposition */}
              <div className="bg-black/60 p-4 rounded-lg border border-cyan-950 space-y-2">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-900">
                  <span className="flex items-center gap-2 text-cyan-400 font-semibold">
                    <Terminal className="w-3.5 h-3.5" />
                    DECODED PACKET BUFFER (HEX STREAM)
                  </span>
                  <span className="text-[10px] text-slate-400">BUFFER 0x00FF8A</span>
                </div>
                <div className="font-mono text-[11px] text-slate-300 leading-relaxed break-all bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-cyan-400">0000:</span> 4F 52 50 48 45 55 53 2D 30 39 20 54 52 41 4E 53 &nbsp;&nbsp;[ORPHEUS-09 TRANS]<br/>
                  <span className="text-cyan-400">0010:</span> 4D 49 53 53 49 4F 4E 20 52 45 54 55 52 4E 45 44 &nbsp;&nbsp;[MISSION RETURNED]<br/>
                  <span className="text-cyan-400">0020:</span> 32 31 38 39 2D 53 45 43 54 4F 52 2D 50 45 52 53 &nbsp;&nbsp;[2189-SECTOR-PERS]<br/>
                  <span className="text-cyan-400">0030:</span> 4C 49 46 45 2D 53 55 50 50 4F 52 54 2D 55 4E 4B &nbsp;&nbsp;[LIFE-SUPPORT-UNK]
                </div>
              </div>

              {/* System Architecture Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400">
                <div className="border border-slate-800 p-2 rounded bg-slate-900/30">
                  <div className="text-slate-400">OPERATOR ID</div>
                  <div className="text-white font-mono mt-0.5">INV-OP-7749</div>
                </div>
                <div className="border border-slate-800 p-2 rounded bg-slate-900/30">
                  <div className="text-slate-400">RESCUE CRAFT</div>
                  <div className="text-white font-mono mt-0.5">ASTRAEA-IV</div>
                </div>
                <div className="border border-slate-800 p-2 rounded bg-slate-900/30">
                  <div className="text-slate-400">AUDIO SYNTH</div>
                  <div className="text-emerald-400 font-mono mt-0.5">WEB AUDIO ENGINE</div>
                </div>
                <div className="border border-slate-800 p-2 rounded bg-slate-900/30">
                  <div className="text-slate-400">CURRENT TARGET</div>
                  <div className="text-red-400 font-mono mt-0.5">ORPHEUS-09</div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-cyan-950 pt-4 mt-6 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Zap className="w-3.5 h-3.5" />
                ALL RECEPTION SYSTEMS NOMINAL
              </span>
              <button
                onClick={handleClose}
                type="button"
                className="px-4 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 transition"
              >
                RETURN TO CONSOLE [ESC]
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
