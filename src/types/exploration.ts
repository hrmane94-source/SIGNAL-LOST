export type LocationId = 'bridge' | 'quarters' | 'engineering';

export type InvestigationObjectId =
  // Bridge
  | 'bridge-captain-terminal'
  | 'bridge-nav-console'
  | 'bridge-comm-panel'
  // Crew Quarters
  | 'quarters-personal-terminal'
  | 'quarters-recording-device'
  | 'quarters-medical-station'
  // Engineering Bay
  | 'eng-reactor-panel'
  | 'eng-ai-terminal'
  | 'eng-power-console';

export type EvidenceId = 'evidence-01' | 'evidence-02' | 'evidence-03';

export interface EvidenceRecord {
  id: EvidenceId;
  number: number;
  title: string;
  location: string;
  locationId: LocationId;
  sourceObjectId: InvestigationObjectId;
  text: string;
  chronologicalLogIndex: string;
  logTimestamp: string;
  sourceLabel: string;
}

export interface InvestigationObject {
  id: InvestigationObjectId;
  name: string;
  subtitle: string;
  locationId: LocationId;
  // Position percentage for tactical environmental hotspot placement
  position: { x: number; y: number };
  hasEvidence: boolean;
  evidenceId?: EvidenceId;
  readoutTitle: string;
  readoutContent: string;
  telemetryMetadata?: {
    terminalId: string;
    subsystem: string;
    powerState: string;
    securityLevel: string;
  };
}

export interface ShipLocation {
  id: LocationId;
  name: string;
  shortCode: string;
  deck: string;
  status: string;
  atmosphere: string;
  lightingDescription: string;
  ambientTone: 'cyan' | 'amber' | 'red';
  description: string;
  objectIds: InvestigationObjectId[];
}
