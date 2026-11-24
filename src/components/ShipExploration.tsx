import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, CheckCircle2, ChevronRight, Award, Compass, Sparkles } from 'lucide-react';
import type { EvidenceId, EvidenceRecord, InvestigationObject, LocationId } from '../types/exploration';
import { EVIDENCE_RECORDS, INVESTIGATION_OBJECTS, SHIP_LOCATIONS } from '../data/shipExplorationData';
import { LocationEnvironment } from './LocationEnvironment';
import { ObjectInspectionModal } from './ObjectInspectionModal';
import { soundEngine } from '../utils/audio';

interface ShipExplorationProps {
  collectedEvidenceIds: EvidenceId[];
  onCollectEvidence: (evidence: EvidenceRecord) => void;
  onOpenEvidenceReview: () => void;
}

export const ShipExploration: React.FC<ShipExplorationProps> = ({
  collectedEvidenceIds,
  onCollectEvidence,
  onOpenEvidenceReview,
}) => {
  const [activeLocationId, setActiveLocationId] = useState<LocationId>('bridge');
  const [selectedObject, setSelectedObject] = useState<InvestigationObject | null>(null);
  const [inspectedObjectIds, setInspectedObjectIds] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const activeLocation = SHIP_LOCATIONS[activeLocationId];
  const activeObjects = activeLocation.objectIds.map((id) => INVESTIGATION_OBJECTS[id]);

  const handleLocationSwitch = (locId: LocationId) => {
    if (locId === activeLocationId) return;
    soundEngine.playClick();
    soundEngine.playLocationSwitch();
    setActiveLocationId(locId);
  };

  const handleSelectObject = (obj: InvestigationObject) => {
    setSelectedObject(obj);
    if (!inspectedObjectIds.includes(obj.id)) {
      setInspectedObjectIds((prev) => [...prev, obj.id]);
    }
  };

  const handleCollectEvidenceWrapper = (evidence: EvidenceRecord) => {
    onCollectEvidence(evidence);
    setNotification(`EVIDENCE RECOVERED: ${evidence.number}/3 — ${evidence.title}`);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const isSelectedEvidenceCollected = selectedObject?.evidenceId
    ? collectedEvidenceIds.includes(selectedObject.evidenceId)
    : false;

  const selectedEvidenceRecord = selectedObject?.evidenceId
    ? EVIDENCE_RECORDS[selectedObject.evidenceId]
    : null;

  const evidenceCount = collectedEvidenceIds.length;
  const isAllEvidenceCollected = evidenceCount === 3;

  return (
    <div className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 md:py-8 flex flex-col gap-6">
      
      {/* Dynamic Floating Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl bg-cyan-950/95 border-2 border-cyan-400 text-white font-mono text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-[0_0_30px_rgba(0,240,255,0.5)] backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A. LOCATION NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/80 p-2 rounded-xl border border-cyan-900/40 backdrop-blur-md">
        <div className="text-xs font-mono text-slate-400 px-2 flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">SHIP DECKS:</span>
        </div>

        <div className="grid grid-cols-3 gap-2 flex-1 sm:max-w-2xl">
          {(['bridge', 'quarters', 'engineering'] as LocationId[]).map((locId) => {
            const loc = SHIP_LOCATIONS[locId];
            const isActive = locId === activeLocationId;
            // Check if evidence for this location is collected
            const locEvidenceId: EvidenceId =
              locId === 'bridge'
                ? 'evidence-01'
                : locId === 'quarters'
                ? 'evidence-02'
                : 'evidence-03';
            const hasCollectedEvidence = collectedEvidenceIds.includes(locEvidenceId);

            return (
              <button
                key={locId}
                onClick={() => handleLocationSwitch(locId)}
                type="button"
                className={`relative px-3 py-2.5 rounded-lg border text-left transition-all duration-200 font-mono ${
                  isActive
                    ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-cyan-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400/90 font-semibold tracking-wider">
                    {loc.shortCode}
                  </span>
                  {hasCollectedEvidence ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>
                <div className="text-xs sm:text-sm font-heading font-bold tracking-tight truncate mt-0.5">
                  {loc.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: B. ENVIRONMENT VIEW (left) & C. INVESTIGATION PANEL (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: B. ENVIRONMENT VIEW */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <LocationEnvironment
            location={activeLocation}
            objects={activeObjects}
            collectedEvidenceIds={collectedEvidenceIds}
            inspectedObjectIds={inspectedObjectIds}
            selectedObjectId={selectedObject?.id || null}
            onSelectObject={handleSelectObject}
          />
        </div>

        {/* Right Column: C. INVESTIGATION PANEL & INVENTORY */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Investigation Progress Card */}
          <div className="bg-slate-950/90 border border-cyan-500/30 rounded-xl p-5 backdrop-blur-md space-y-4 shadow-[0_0_25px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between border-b border-cyan-950 pb-2.5 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider">
                <Archive className="w-4 h-4 text-cyan-400" />
                INVESTIGATION PANEL
              </span>
              <span className={`font-bold ${isAllEvidenceCollected ? 'text-emerald-400' : 'text-cyan-300'}`}>
                {evidenceCount}/3 RECOVERED
              </span>
            </div>

            {/* Progress Bar with 3 Segments */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>EVIDENCE RECOVERED: {evidenceCount}/3</span>
                <span>{Math.round((evidenceCount / 3) * 100)}% COMPLETE</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 h-2 w-full">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className="relative h-full bg-slate-800 rounded-full overflow-hidden"
                  >
                    <div
                      className={`h-full transition-all duration-300 ${
                        step <= evidenceCount ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)]' : 'bg-transparent'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 3/3 Completion Event Banner */}
            {isAllEvidenceCollected ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-500/60 space-y-3"
              >
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>ALL PRIMARY EVIDENCE RECOVERED</span>
                </div>
                <div className="text-[11px] font-mono text-slate-200">
                  INVESTIGATION PHASE COMPLETE. All three primary records have been recovered from ORPHEUS-09.
                </div>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onOpenEvidenceReview();
                  }}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono tracking-wider uppercase transition shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
                >
                  <span>REVIEW EVIDENCE</span>
                  <ChevronRight className="w-4 h-4 text-slate-950" />
                </button>
              </motion.div>
            ) : (
              <div className="text-[11px] font-mono text-slate-400 bg-slate-900/50 p-2.5 rounded border border-cyan-900/30">
                Explore the Command Bridge, Crew Quarters, and Engineering Bay to discover and decrypt all 3 primary records.
              </div>
            )}

            {/* Evidence Inventory List */}
            <div className="space-y-2 pt-2 border-t border-cyan-950">
              <div className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                EVIDENCE INVENTORY:
              </div>

              {(['evidence-01', 'evidence-02', 'evidence-03'] as EvidenceId[]).map((eId) => {
                const rec = EVIDENCE_RECORDS[eId];
                const isCollected = collectedEvidenceIds.includes(eId);
                const sourceObj = INVESTIGATION_OBJECTS[rec.sourceObjectId];

                return (
                  <button
                    key={eId}
                    disabled={!isCollected}
                    onClick={() => {
                      if (isCollected) {
                        handleSelectObject(sourceObj);
                      }
                    }}
                    type="button"
                    className={`w-full p-2.5 rounded-lg border text-left transition-all duration-200 font-mono text-xs ${
                      isCollected
                        ? 'bg-slate-900/80 border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/40 text-slate-200 cursor-pointer'
                        : 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold tracking-tight">
                        EVIDENCE 0{rec.number}: {rec.title}
                      </span>
                      {isCollected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-slate-600 font-bold uppercase">
                          LOCKED
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {isCollected
                        ? `Decrypted from ${rec.location}`
                        : `Undiscovered on ${rec.location}`}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Deck Investigation Shortcut Guide */}
            <div className="pt-2 text-[10px] font-mono text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>INSPECTED OBJECTS:</span>
                <span className="text-cyan-400 font-bold">{inspectedObjectIds.length}/9</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ACTIVE DECK:</span>
                <span className="text-white">{activeLocation.name}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* D. INTERACTION MODAL / PANEL */}
      <ObjectInspectionModal
        object={selectedObject}
        evidence={selectedEvidenceRecord}
        isEvidenceCollected={isSelectedEvidenceCollected}
        onClose={() => setSelectedObject(null)}
        onCollectEvidence={handleCollectEvidenceWrapper}
      />

    </div>
  );
};
