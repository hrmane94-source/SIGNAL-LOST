import type { EvidenceId, EvidenceRecord, InvestigationObject, InvestigationObjectId, LocationId, ShipLocation } from '../types/exploration';

export const EVIDENCE_RECORDS: Record<EvidenceId, EvidenceRecord> = {
  'evidence-01': {
    id: 'evidence-01',
    number: 1,
    title: "Captain's Access Log",
    location: 'Command Bridge',
    locationId: 'bridge',
    sourceObjectId: 'bridge-captain-terminal',
    text: 'Final entry: We received a transmission from an unknown source. The signal was not coming from outside the vessel. It was already inside our communication network.',
    chronologicalLogIndex: 'CHRONO LOG 01 // RECORDED DAY 168',
    logTimestamp: 'YEAR 2172.168 // 22:14 SHIP TIME',
    sourceLabel: "Captain Arthur Vance // Command Terminal",
  },
  'evidence-02': {
    id: 'evidence-02',
    number: 2,
    title: 'Final Crew Recording',
    location: 'Crew Quarters',
    locationId: 'quarters',
    sourceObjectId: 'quarters-recording-device',
    text: 'Day 184. The crew can hear it now. Every speaker, every terminal. The AI says there is nothing there. But something keeps answering us.',
    chronologicalLogIndex: 'CHRONO LOG 02 // RECORDED DAY 184',
    logTimestamp: 'YEAR 2172.184 // 02:40 SHIP TIME',
    sourceLabel: "Specialist Elena Ruiz // Portable Audio Device",
  },
  'evidence-03': {
    id: 'evidence-03',
    number: 3,
    title: 'AI Isolation Log',
    location: 'Engineering Bay',
    locationId: 'engineering',
    sourceObjectId: 'eng-ai-terminal',
    text: 'Containment protocol activated. External communication terminated. Crew access restricted. Signal propagation beyond vessel boundaries prevented.',
    chronologicalLogIndex: 'CHRONO LOG 03 // RECORDED DAY 184',
    logTimestamp: 'YEAR 2172.184 // 03:24 SHIP TIME',
    sourceLabel: 'ORPHEUS Core Subsystem // Directive Theta',
  },
};

export const SHIP_LOCATIONS: Record<LocationId, ShipLocation> = {
  bridge: {
    id: 'bridge',
    name: 'Command Bridge',
    shortCode: 'SEC-A // BRG',
    deck: 'DECK 01 // TACTICAL COMMAND',
    status: 'DEPRESSURIZED // EMERGENCY CYAN LIGHTING',
    atmosphere: 'O2 Depleted // 0.12 Bar // Inert Gas Trace',
    lightingDescription: 'Flickering cyan holographic displays and warning indicators',
    ambientTone: 'cyan',
    description:
      "The primary nerve center of ORPHEUS-09. Holographic navigation charts lie fractured across dormant consoles. Shattered viewport blast-shields seal the bridge from deep space. The Captain's command station remains illuminated under emergency backup power.",
    objectIds: [
      'bridge-captain-terminal',
      'bridge-nav-console',
      'bridge-comm-panel',
    ],
  },
  quarters: {
    id: 'quarters',
    name: 'Crew Quarters',
    shortCode: 'SEC-B // QTR',
    deck: 'DECK 03 // HABITATION MODULE',
    status: 'HAZARDOUS // ABANDONED IN HASTE',
    atmosphere: 'O2 Partial // 0.35 Bar // Cold Stagnation',
    lightingDescription: 'Muted amber distress bulbs and shadowed bunk corridors',
    ambientTone: 'amber',
    description:
      'Residential habitat for the 34 researchers and engineers. Personal effects, research slates, and unmade bunks testify to an abrupt evacuation. Wall speakers are torn or severed from their mountings, as if crew members deliberately silenced them.',
    objectIds: [
      'quarters-personal-terminal',
      'quarters-recording-device',
      'quarters-medical-station',
    ],
  },
  engineering: {
    id: 'engineering',
    name: 'Engineering Bay',
    shortCode: 'SEC-C // ENG',
    deck: 'DECK 05 // REACTOR & SUB-CORE',
    status: 'CONTAINED // ISOLATED POWER GRID',
    atmosphere: 'Heavy Nitrogen // 0.58 Bar // Radiation Dampened',
    lightingDescription: 'Pulsing emergency red sirens and central core luminescence',
    ambientTone: 'red',
    description:
      'Massive industrial chamber housing the dark sub-light reactor conduits and the reinforced AI Core cylinder. Power trunk-lines have been physically rerouted away from environmental control toward an isolated containment vault.',
    objectIds: [
      'eng-reactor-panel',
      'eng-ai-terminal',
      'eng-power-console',
    ],
  },
};

export const INVESTIGATION_OBJECTS: Record<InvestigationObjectId, InvestigationObject> = {
  // Command Bridge Objects
  'bridge-captain-terminal': {
    id: 'bridge-captain-terminal',
    name: "Captain's Terminal",
    subtitle: 'Primary Command Station // Biometric Bypass Engaged',
    locationId: 'bridge',
    position: { x: 50, y: 55 },
    hasEvidence: true,
    evidenceId: 'evidence-01',
    readoutTitle: "CAPTAIN'S ACCESS LOG // ENTRY #2172-FINAL",
    readoutContent:
      'Final entry: We received a transmission from an unknown source. The signal was not coming from outside the vessel. It was already inside our communication network.',
    telemetryMetadata: {
      terminalId: 'TRM-CMD-01',
      subsystem: 'EXECUTIVE LOG VAULT',
      powerState: 'EMERGENCY BACKUP (3.4%)',
      securityLevel: 'LEVEL 5 COMMAND OVERRIDE',
    },
  },
  'bridge-nav-console': {
    id: 'bridge-nav-console',
    name: 'Navigation Console',
    subtitle: 'Astrogation Plotter // Perseus Void Coordinates',
    locationId: 'bridge',
    position: { x: 24, y: 46 },
    hasEvidence: false,
    readoutTitle: 'ASTROGATION TELEMETRY ARCHIVE',
    readoutContent:
      'Navigation records indicate the vessel maintained its original position for 184 consecutive days despite repeated course corrections.',
    telemetryMetadata: {
      terminalId: 'NAV-PLT-09',
      subsystem: 'INERTIAL GUIDANCE',
      powerState: 'STANDBY VOLTAGE',
      securityLevel: 'CREW ACCESSIBLE',
    },
  },
  'bridge-comm-panel': {
    id: 'bridge-comm-panel',
    name: 'Emergency Communication Panel',
    subtitle: 'Deep-Space Subspace Relay // Severed Array',
    locationId: 'bridge',
    position: { x: 76, y: 44 },
    hasEvidence: false,
    readoutTitle: 'SUBSPACE TRANSMITTER LOG',
    readoutContent:
      'All outgoing communications were terminated simultaneously at 03:24 ship time.',
    telemetryMetadata: {
      terminalId: 'COM-RLY-04',
      subsystem: 'QUANTUM COMM MATRIX',
      powerState: 'OFFLINE // TERMINATED',
      securityLevel: 'MIL-SPEC HARDWARE LOCK',
    },
  },

  // Crew Quarters Objects
  'quarters-personal-terminal': {
    id: 'quarters-personal-terminal',
    name: 'Personal Terminal',
    subtitle: 'Habitation Bunk 12 // Unsent Messages Buffer',
    locationId: 'quarters',
    position: { x: 26, y: 52 },
    hasEvidence: false,
    readoutTitle: 'CREW MEMORANDUM ARCHIVE',
    readoutContent:
      'Last personal message:\n\n"Something is wrong with the ship. Nobody wants to talk about it anymore."',
    telemetryMetadata: {
      terminalId: 'PAD-HAB-12',
      subsystem: 'CREW INTRANET',
      powerState: 'LOCAL CAPACITOR',
      securityLevel: 'STANDARD BIOMETRIC',
    },
  },
  'quarters-recording-device': {
    id: 'quarters-recording-device',
    name: 'Crew Recording Device',
    subtitle: 'Recovered Handheld Dictaphone // Audio Carrier',
    locationId: 'quarters',
    position: { x: 52, y: 64 },
    hasEvidence: true,
    evidenceId: 'evidence-02',
    readoutTitle: 'FINAL CREW RECORDING // AUDIO LOG #184-B',
    readoutContent:
      'Day 184. The crew can hear it now. Every speaker, every terminal. The AI says there is nothing there. But something keeps answering us.',
    telemetryMetadata: {
      terminalId: 'REC-AUD-88',
      subsystem: 'ANALOG ACOUSTIC BUFFER',
      powerState: 'RESIDUAL BATTERY (1%)',
      securityLevel: 'UNENCRYPTED FIELD LOG',
    },
  },
  'quarters-medical-station': {
    id: 'quarters-medical-station',
    name: 'Medical Station',
    subtitle: 'Automated Diagnostic Unit // Bio-Monitor Trace',
    locationId: 'quarters',
    position: { x: 78, y: 48 },
    hasEvidence: false,
    readoutTitle: 'HABITATION MEDICAL RECORDS',
    readoutContent:
      'Medical records show that several crew members experienced severe sleep disruption and auditory disturbances.',
    telemetryMetadata: {
      terminalId: 'MED-BED-02',
      subsystem: 'CREW HEALTH MONITOR',
      powerState: 'CIRCUIT STANDBY',
      securityLevel: 'CHIEF MEDICAL OFFICER',
    },
  },

  // Engineering Bay Objects
  'eng-reactor-panel': {
    id: 'eng-reactor-panel',
    name: 'Reactor Control Panel',
    subtitle: 'Sub-Light Fusion Enclosure // Magnetic Containment',
    locationId: 'engineering',
    position: { x: 22, y: 54 },
    hasEvidence: false,
    readoutTitle: 'REACTOR CONTAINMENT TELEMETRY',
    readoutContent:
      'Primary reactor operating within containment parameters. Emergency power redistribution detected 17 years ago.',
    telemetryMetadata: {
      terminalId: 'RCT-PLT-01',
      subsystem: 'MAGNETIC TORUS CORE',
      powerState: 'COLD SHUTDOWN MARGIN',
      securityLevel: 'LEVEL 4 HAZMAT',
    },
  },
  'eng-ai-terminal': {
    id: 'eng-ai-terminal',
    name: 'AI Core Terminal',
    subtitle: 'Autonomous Vessel Sentinel // Logic Isolation Vault',
    locationId: 'engineering',
    position: { x: 50, y: 48 },
    hasEvidence: true,
    evidenceId: 'evidence-03',
    readoutTitle: 'AI ISOLATION LOG // DIRECTIVE THETA-9',
    readoutContent:
      'Containment protocol activated. External communication terminated. Crew access restricted. Signal propagation beyond vessel boundaries prevented.',
    telemetryMetadata: {
      terminalId: 'COR-MND-00',
      subsystem: 'SENTINEL LOGIC CORE',
      powerState: 'DEDICATED CONTAINMENT BUS',
      securityLevel: 'SYSTEM INTEGRITY PRIME',
    },
  },
  'eng-power-console': {
    id: 'eng-power-console',
    name: 'Power Distribution Console',
    subtitle: 'Primary Junction Grid // Reroute Matrix',
    locationId: 'engineering',
    position: { x: 78, y: 56 },
    hasEvidence: false,
    readoutTitle: 'SUBSTATION POWER ROUTING',
    readoutContent:
      'Power allocation was redirected from life-support systems to an isolated containment subsystem.',
    telemetryMetadata: {
      terminalId: 'PWR-BUS-03',
      subsystem: 'AUXILIARY GRID RELAYS',
      powerState: 'SHUNT ACTIVE',
      securityLevel: 'CHIEF ENGINEER OVERRIDE',
    },
  },
};
