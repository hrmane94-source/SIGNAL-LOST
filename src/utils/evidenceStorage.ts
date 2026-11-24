import type { EvidenceId } from '../types/exploration';

const STORAGE_KEY = 'signal_lost_evidence_inventory_v1';

export const loadStoredEvidence = (): EvidenceId[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const validIds: EvidenceId[] = ['evidence-01', 'evidence-02', 'evidence-03'];
      return parsed.filter((id): id is EvidenceId => validIds.includes(id));
    }
    return [];
  } catch (error) {
    console.warn('Failed to load evidence from localStorage:', error);
    return [];
  }
};

export const saveStoredEvidence = (evidenceIds: EvidenceId[]): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(evidenceIds));
  } catch (error) {
    console.warn('Failed to save evidence to localStorage:', error);
  }
};

export const clearStoredEvidence = (): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear evidence from localStorage:', error);
  }
};
