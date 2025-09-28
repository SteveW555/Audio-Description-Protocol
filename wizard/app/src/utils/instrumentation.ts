import { VOCABULARY } from '../constants/vocabulary';

export const getInstrumentDescriptors = (instrument: string): string[] => {
    const specific = VOCABULARY.instrument_descriptors[instrument as keyof typeof VOCABULARY.instrument_descriptors] ?? [];
    const combined = [...specific, ...VOCABULARY.general_descriptors];
    return Array.from(new Set(combined));
};

export const getInstrumentRoles = (instrument: string): string[] => {
    const specific = VOCABULARY.instrument_roles[instrument as keyof typeof VOCABULARY.instrument_roles] ?? [];
    const combined = [...specific, ...VOCABULARY.general_roles];
    return Array.from(new Set(combined));
};
