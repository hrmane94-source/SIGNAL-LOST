import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Sparkles, CheckCircle2, ShieldCheck, Database, FileText, ArrowRight } from 'lucide-react';
import type { EvidenceRecord, InvestigationObject } from '../types/exploration';
import { soundEngine } from '../utils/audio';

interface ObjectInspectionModalProps {
  object: InvestigationObject | null;
  evidence: EvidenceRecord | null;
  isEvidenceCollected: boolean;
  onClose: () => void;
  onCollectEvidence: (evidence: EvidenceRecord) => void;
}

export const ObjectInspectionModal: React.FC<ObjectInspectionModalProps> = ({
  object,
  evidence,
  isEvidenceCollected,
  onClose,
  onCollectEvidence,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playClick();
        onClose();
      }
    };
    if (object) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [object, onClose]);

  if (!object) return null;

  const handleCollect = () => {
    if (!evidence || isEvidenceCollected) return;
    soundEngine.playEvidenceChime();
    onCollectEvidence(evidence);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-2xl bg-slate-950 border border-cyan-500/50 rounded-xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden"
        >
          {/* Corner Brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

          {/* Scanlines inside modal */}
          <div className="absolute inset-0 scanlines opacity-35 pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex items-start justify-between border-b border-cyan-950 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                {evidence ? (
                  <Sparkles className="w-6 h-6 text-cyan-300 animate-pulse" />
                ) : (
                  <Terminal className="w-6 h-6 text-cyan-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 uppercase font-semibold">
                    OBJECT INVESTIGATION
                  </span>
                  {object.hasEvidence && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-400 uppercase font-bold animate-pulse">
                      CRITICAL EVIDENCE
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight mt-1">
                  {object.name}
                </h3>
                <p className="text-xs font-mono text-cyan-400/80 mt-0.5">
                  {object.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              type="button"
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white hover:border-cyan-400 transition"
              aria-label="Close Investigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="relative z-10 space-y-5 font-mono text-xs">
            
            {/* Subsystem Telemetry Specs */}
            {object.telemetryMetadata && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] bg-slate-900/50 p-2.5 rounded-lg border border-cyan-900/30 text-slate-400">
                <div>
                  <span className="text-slate-400">TERMINAL ID:</span>
                  <div className="text-white font-bold mt-0.5">{object.telemetryMetadata.terminalId}</div>
                </div>
                <div>
                  <span className="text-slate-400">SUBSYSTEM:</span>
                  <div className="text-cyan-300 font-medium mt-0.5">{object.telemetryMetadata.subsystem}</div>
                </div>
                <div>
                  <span className="text-slate-400">POWER STATE:</span>
                  <div className="text-amber-300 font-medium mt-0.5">{object.telemetryMetadata.powerState}</div>
                </div>
                <div>
                  <span className="text-slate-400">SECURITY:</span>
                  <div className="text-slate-200 font-medium mt-0.5">{object.telemetryMetadata.securityLevel}</div>
                </div>
              </div>
            )}

            {/* Readout Terminal View */}
            <div className="bg-black/75 rounded-lg border border-cyan-900/60 p-4 sm:p-5 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] space-y-3">
              <div className="flex items-center justify-between border-b border-cyan-950 pb-2 text-[11px] text-cyan-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <Database className="w-3.5 h-3.5" />
                  {object.readoutTitle}
                </span>
                <span className="text-slate-400">RECOVERED STREAM</span>
              </div>

              {/* Exact Evidence / Content Box */}
              <div className="bg-slate-950/80 p-4 rounded border border-cyan-900/40 text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-mono selection:bg-cyan-500/30">
                {object.readoutContent}
              </div>

              {/* Evidence Attribution Tag */}
              {evidence && (
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>SOURCE: <span className="text-cyan-300">{evidence.sourceLabel}</span></span>
                  <span className="text-slate-400">{evidence.logTimestamp}</span>
                </div>
              )}
            </div>

            {/* Evidence Collection Banner & Action */}
            {evidence && (
              <div className="p-4 rounded-lg bg-cyan-950/40 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-cyan-900/40 text-cyan-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      EVIDENCE 0{evidence.number}: {evidence.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {isEvidenceCollected
                        ? 'Record successfully decrypted and archived into investigation inventory.'
                        : 'Action required: Collect record to update investigation progress.'}
                    </div>
                  </div>
                </div>

                {isEvidenceCollected ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold font-mono tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>EVIDENCE COLLECTED</span>
                  </div>
                ) : (
                  <button
                    onClick={handleCollect}
                    type="button"
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 via-cyan-500 to-sky-500 hover:from-cyan-500 hover:to-sky-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>COLLECT EVIDENCE</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                )}
              </div>
            )}

            {!evidence && (
              <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                <span>TELEMETRY DATA LOGGED // NO CLASSIFIED CREW EVIDENCE ON THIS TERMINAL</span>
              </div>
            )}

          </div>

          {/* Footer Controls */}
          <div className="relative z-10 flex items-center justify-between border-t border-cyan-950 pt-4 mt-6 text-xs font-mono text-slate-400">
            <span>PRESS [ESC] TO CLOSE</span>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              type="button"
              className="px-4 py-1.5 rounded-lg bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition"
            >
              RETURN TO DECK
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
