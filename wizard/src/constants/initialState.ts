import { AudioProtocolData } from '../types/protocol';

export const getInitialState = (): AudioProtocolData => ({
    protocol_version: '1.0',
    path: '',
    theory: {
        bpm: '',
        key: '',
        scale: '',
        key_confidence: 'tbc',
        chords: 'tbc',
        roman_numerals: 'tbc',
    },
    semantic_description: {
        attributes: {
            mood: [],
            energy: [],
            texture: [],
        },
        genre: {
            primary: '',
            primary_subgenres: [],
        },
        instrumentation: [],
        vocals: {
            presence: '',
            gender: null,
            style: null,
            descriptors: [],
        },
    },
});
