import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, AlertCircle, Terminal, Radio, Cpu, Activity, Zap } from 'lucide-react';
import type { EvidenceId, InvestigationObject, ShipLocation } from '../types/exploration';
import { soundEngine } from '../utils/audio';

interface LocationEnvironmentProps {
  location: ShipLocation;
  objects: InvestigationObject[];
  collectedEvidenceIds: EvidenceId[];
  inspectedObjectIds: string[];
  selectedObjectId: string | null;
  onSelectObject: (obj: InvestigationObject) => void;
}

export const LocationEnvironment: React.FC<LocationEnvironmentProps> = ({
  location,
  objects,
  collectedEvidenceIds,
  inspectedObjectIds,
  selectedObjectId,
  onSelectObject,
}) => {
  const getObjectIcon = (obj: InvestigationObject) => {
    if (obj.hasEvidence) {
      return <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />;
    }
    if (obj.id.includes('terminal') || obj.id.includes('console')) {
      return <Terminal className="w-4 h-4 text-slate-300" />;
    }
    if (obj.id.includes('comm') || obj.id.includes('recording')) {
      return <Radio className="w-4 h-4 text-slate-300" />;
    }
    if (obj.id.includes('ai')) {
      return <Cpu className="w-4 h-4 text-cyan-300" />;
    }
    if (obj.id.includes('reactor') || obj.id.includes('power')) {
      return <Zap className="w-4 h-4 text-amber-300" />;
    }
    return <Activity className="w-4 h-4 text-slate-300" />;
  };

  return (
    <div className="relative w-full rounded-xl bg-slate-950/90 border border-cyan-500/30 overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-md">
      {/* Tactical Corner Brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none z-20" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none z-20" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none z-20" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none z-20" />

      {/* Atmospheric scanlines overlay */}
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none z-10" />

      {/* Location Atmosphere Header Bar */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/80 border-b border-cyan-900/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
              {location.deck}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
              {location.shortCode}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-tight mt-0.5">
            {location.name}
          </h2>
        </div>

        <div className="flex flex-col items-end text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>{location.status}</span>
          </div>
          <div className="text-slate-400 text-[10px] mt-0.5">
            ATMOSPHERE: {location.atmosphere}
          </div>
        </div>
      </div>

      {/* Main Environmental Visual Area */}
      <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] overflow-hidden select-none bg-gradient-to-b from-[#02050f] via-[#040a1c] to-[#02040a]">
        
        {/* Background Atmospheric Layer depending on location */}
        {location.id === 'bridge' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Viewport arc to deep space */}
            <div className="absolute inset-x-8 top-4 h-48 border-b-2 border-x-2 border-cyan-500/20 rounded-b-[40px] bg-gradient-to-b from-cyan-950/20 to-transparent flex items-center justify-center">
              <div className="text-[10px] font-mono text-cyan-400/40 tracking-widest uppercase">
                FORWARD VIEWPORT // CRACKED QUARTZ GLASS
              </div>
            </div>
            {/* Holographic Nav Ring */}
            <div className="absolute left-1/2 top-32 -translate-x-1/2 w-72 h-36 rounded-full border border-dashed border-cyan-400/30 animate-[spin_20s_linear_infinite]" />
            <div className="absolute left-1/2 top-36 -translate-x-1/2 w-56 h-28 rounded-full border border-cyan-400/20 animate-pulse" />
            {/* Ambient Cyan and Red glows */}
            <div className="absolute top-0 right-10 w-44 h-44 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />
            {/* Perspective deck lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="480" x2="380" y2="180" stroke="#00f0ff" strokeWidth="1" />
              <line x1="100%" y1="480" x2="calc(100% - 380px)" y2="180" stroke="#00f0ff" strokeWidth="1" />
              <line x1="20%" y1="480" x2="420" y2="180" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="4 4" />
              <line x1="80%" y1="480" x2="calc(100% - 420px)" y2="180" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="4 4" />
            </svg>
          </div>
        )}

        {location.id === 'quarters' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Amber emergency distress glow */}
            <div className="absolute top-6 left-1/4 w-72 h-72 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-12 w-64 h-64 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />
            {/* Bunk cubicles silhouette layout */}
            <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
              {/* Left bunks */}
              <rect x="20" y="80" width="160" height="90" fill="none" stroke="#f59e0b" strokeWidth="1" />
              <rect x="20" y="200" width="160" height="90" fill="none" stroke="#f59e0b" strokeWidth="1" />
              {/* Right bunks */}
              <rect x="calc(100% - 180px)" y="80" width="160" height="90" fill="none" stroke="#f59e0b" strokeWidth="1" />
              <rect x="calc(100% - 180px)" y="200" width="160" height="90" fill="none" stroke="#f59e0b" strokeWidth="1" />
              {/* Torn cables */}
              <path d="M 120 40 Q 150 120 180 90 T 220 160" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 3" />
              <path d="M calc(100% - 140px) 40 Q calc(100% - 160px) 110 calc(100% - 200px) 80" fill="none" stroke="#00f0ff" strokeWidth="1" />
            </svg>
          </div>
        )}

        {location.id === 'engineering' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Red reactor radiation & containment glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
            {/* Central AI Core silhouette */}
            <div className="absolute left-1/2 top-16 -translate-x-1/2 w-48 h-64 border border-red-500/40 rounded-t-full bg-gradient-to-b from-red-950/40 to-slate-950/80 flex flex-col items-center pt-8">
              <div className="w-20 h-20 rounded-full border-2 border-red-500/60 flex items-center justify-center animate-pulse">
                <div className="w-10 h-10 rounded-full bg-red-500/30 border border-red-400 animate-ping" />
              </div>
              <div className="text-[9px] font-mono text-red-400 mt-4 tracking-widest uppercase">
                AI CORE // ISOLATED
              </div>
            </div>
            {/* Industrial pipe lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 120 L 320 120 L 320 480" fill="none" stroke="#ef4444" strokeWidth="2" />
              <path d="M 100% 120 L calc(100% - 320px) 120 L calc(100% - 320px) 480" fill="none" stroke="#ef4444" strokeWidth="2" />
              <line x1="0" y1="280" x2="100%" y2="280" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 4" />
            </svg>
          </div>
        )}

        {/* Dynamic Interactive Object Hotspots */}
        {objects.map((obj) => {
          const isCollected = obj.evidenceId && collectedEvidenceIds.includes(obj.evidenceId);
          const isInspected = inspectedObjectIds.includes(obj.id);
          const isSelected = selectedObjectId === obj.id;

          return (
            <motion.div
              key={obj.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                left: `${obj.position.x}%`,
                top: `${obj.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-30"
            >
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectObject(obj);
                }}
                type="button"
                className={`group relative flex flex-col items-center focus:outline-none transition-transform duration-200 ${
                  isSelected ? 'scale-110' : 'hover:scale-105'
                }`}
                aria-label={`Investigate ${obj.name}`}
              >
                {/* Hotspot Target Reticle Marker */}
                <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14">
                  {/* Outer animated targeting ring */}
                  <div
                    className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                      obj.hasEvidence
                        ? isCollected
                          ? 'border-emerald-500/70 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'border-cyan-400 bg-cyan-950/50 shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-pulse'
                        : isInspected
                        ? 'border-slate-500/70 bg-slate-900/60'
                        : 'border-cyan-500/40 bg-slate-950/80 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    }`}
                  />

                  {/* Corner crosshair markers */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

                  {/* Center Icon */}
                  <div className="relative z-10 flex items-center justify-center">
                    {isCollected ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      getObjectIcon(obj)
                    )}
                  </div>

                  {/* Evidence Ping Marker */}
                  {obj.hasEvidence && !isCollected && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                    </span>
                  )}
                </div>

                {/* Hotspot Floating Tag Label */}
                <div
                  className={`mt-2 px-2.5 py-1 rounded border text-center transition-all duration-200 pointer-events-none max-w-[160px] sm:max-w-[200px] backdrop-blur-md ${
                    obj.hasEvidence
                      ? isCollected
                        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                        : 'bg-cyan-950/90 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : isInspected
                      ? 'bg-slate-900/80 border-slate-700 text-slate-300'
                      : 'bg-slate-950/90 border-cyan-900/60 text-slate-200 group-hover:border-cyan-400 group-hover:text-cyan-200'
                  }`}
                >
                  <div className="text-[11px] font-mono font-bold tracking-tight uppercase truncate">
                    {obj.name}
                  </div>
                  <div className="text-[9px] font-mono text-cyan-400/90 tracking-widest uppercase">
                    {isCollected
                      ? 'EVIDENCE ARCHIVED'
                      : obj.hasEvidence
                      ? 'EVIDENCE DETECTED'
                      : isInspected
                      ? 'INSPECTED'
                      : 'INTERACT [CLICK]'}
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}

        {/* Ambient environmental lighting descriptions */}
        <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-slate-400/90 pointer-events-none bg-slate-950/70 p-2 rounded-lg border border-cyan-900/30">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>{location.lightingDescription}</span>
          </div>
          <span className="text-cyan-400 font-semibold mt-1 sm:mt-0">
            CLICK ANY HIGHLIGHTED OBJECT TO INVESTIGATE
          </span>
        </div>
      </div>

      {/* Location Narrative Description Card */}
      <div className="relative z-20 p-4 sm:p-5 bg-slate-900/70 border-t border-cyan-900/40 text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
        <span className="text-cyan-400 font-bold mr-2 uppercase tracking-wider">
          ENVIRONMENTAL LOG:
        </span>
        {location.description}
      </div>
    </div>
  );
};
