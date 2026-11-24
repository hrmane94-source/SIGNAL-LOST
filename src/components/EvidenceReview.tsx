import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, Database, Sparkles, Award, ChevronRight } from 'lucide-react';
import type { EvidenceRecord } from '../types/exploration';
import { EVIDENCE_RECORDS } from '../data/shipExplorationData';
import { soundEngine } from '../utils/audio';

interface EvidenceReviewProps {
  onReturnToExploration: () => void;
  onReturnToAstraea: () => void;
  onProceedToSignalAnalysis?: () => void;
}

export const EvidenceReview: React.FC<EvidenceReviewProps> = ({
  onReturnToExploration,
  onReturnToAstraea,
  onProceedToSignalAnalysis,
}) => {
  const records: EvidenceRecord[] = [
    EVIDENCE_RECORDS['evidence-01'],
    EVIDENCE_RECORDS['evidence-02'],
    EVIDENCE_RECORDS['evidence-03'],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-20 w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8"
    >
      {/* Top Navigation & Return */}
      <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3 text-xs font-mono text-slate-400">
        <button
          onClick={() => {
            soundEngine.playClick();
            onReturnToExploration();
          }}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/50 bg-slate-900/60 hover:bg-cyan-950/40 text-slate-300 hover:text-cyan-300 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>RETURN TO SHIP EXPLORATION</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold tracking-wider">
            ALL 3 PRIMARY EVIDENCE RECORDS SECURED
          </span>
        </div>
      </div>

      {/* Completion Banner */}
      <div className="relative bg-emerald-950/40 border-2 border-emerald-500/60 rounded-xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_40px_rgba(16,185,129,0.2)] overflow-hidden">
        {/* Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-900/60 border border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  INVESTIGATION ARCHIVE // EVIDENCE VERIFIED
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-500/30">
                  3/3 COLLECTED
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white tracking-tight mt-1 text-glow-cyan">
                ALL PRIMARY EVIDENCE RECOVERED
              </h1>
              <p className="text-xs sm:text-sm font-mono text-emerald-300/90 mt-1">
                Investigation Phase Complete. All three primary records from ORPHEUS-09 have been decoded and cataloged.
              </p>
            </div>
          </div>

          <div className="bg-black/60 p-4 rounded-xl border border-emerald-500/30 font-mono text-xs text-right shrink-0 flex flex-col items-end gap-2">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">EXPERIENCE STATUS</div>
              <div className="text-lg font-heading font-bold text-emerald-400 mt-0.5">
                MILESTONE 02 COMPLETE
              </div>
            </div>
            {onProceedToSignalAnalysis && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playInitiateSequence();
                  onProceedToSignalAnalysis();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-400 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 font-bold hover:text-white transition shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse"
              >
                <span>INITIATE SIGNAL ANALYSIS</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chronological Archive of Recovered Evidence Records */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-cyan-400 border-b border-cyan-950 pb-2">
          <span className="flex items-center gap-2 font-bold tracking-wider uppercase">
            <Database className="w-4 h-4 text-cyan-400" />
            CHRONOLOGICAL EVIDENCE ARCHIVE (ORPHEUS-09 BLACK BOX)
          </span>
          <span className="text-slate-400">STATUS: DECRYPTED & PRESERVED</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {records.map((record) => (
            <motion.div
              key={record.id}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: record.number * 0.15, duration: 0.5 }}
              className="relative bg-slate-950/85 border border-cyan-500/40 rounded-xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_25px_rgba(0,240,255,0.08)] overflow-hidden"
            >
              <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-cyan-950 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                      EVIDENCE 0{record.number}
                    </span>
                    <span className="text-slate-400">// {record.chronologicalLogIndex}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight mt-1">
                    {record.title}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400/90 mt-0.5">
                    LOCATION: <span className="text-slate-200 font-semibold">{record.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold self-start">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>COLLECTION STATUS: ARCHIVED</span>
                </div>
              </div>

              {/* Complete Recovered Message */}
              <div className="relative z-10 bg-black/60 p-5 rounded-lg border border-cyan-900/40 font-mono text-sm sm:text-base text-slate-100 leading-relaxed">
                <span className="text-cyan-400/80 mr-2 font-bold">&gt;&gt;</span>
                "{record.text}"
              </div>

              {/* Forensic Context Footer */}
              <div className="relative z-10 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-3 mt-3 border-t border-cyan-950/60">
                <span>SOURCE: <span className="text-cyan-300">{record.sourceLabel}</span></span>
                <span className="text-slate-400">RECORDED: {record.logTimestamp}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Short Closing Statement Box */}
      <div className="relative bg-slate-950/90 border border-cyan-500/30 rounded-xl p-6 sm:p-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>INVESTIGATION LOG SYNTHESIS</span>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white tracking-tight italic text-glow-cyan">
          "Three records recovered. One question remains unanswered."
        </h2>

        <p className="max-w-2xl mx-auto text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
          The records confirm the signal originated within the vessel's internal communications, drives the crew to psychosis, and caused the ship's AI to execute containment protocol Theta. What answered them from within the network?
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {onProceedToSignalAnalysis && (
            <button
              onClick={() => {
                soundEngine.playInitiateSequence();
                onProceedToSignalAnalysis();
              }}
              type="button"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg border-2 border-cyan-400 bg-cyan-950/90 hover:bg-cyan-900 text-cyan-200 font-mono text-xs font-bold tracking-widest uppercase transition shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:text-white flex items-center justify-center gap-2"
            >
              <span>PROCEED TO SIGNAL ANALYSIS (PHASE 03)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playClick();
              onReturnToExploration();
            }}
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 font-mono text-xs tracking-wider uppercase transition shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:text-white"
          >
            <span>REVISIT SHIP DECKS</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onReturnToAstraea();
            }}
            type="button"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-mono text-xs tracking-wider uppercase transition"
          >
            <span>RETURN TO RESCUE VESSEL ASTRAEA-IV</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
