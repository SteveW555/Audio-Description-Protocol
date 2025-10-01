import { AudioProtocolData } from './protocol';

export enum StepType {
    ASK_SECONDARY_GENRE = 'ask_secondary_genre',
    ASK_THEORY = 'ask_theory',
    FINAL = 'final',
    GENRE = 'genre',
    INSTRUMENTATION = 'instrumentation',
    TEXT_INPUT = 'text_input',
}

export interface BaseStep {
    title: string;
    condition?: () => boolean;
}

export interface WizardPathStep extends BaseStep {
    path: string;
    multi?: boolean;
    placeholder?: string;
    terms?: string[] | ((data: AudioProtocolData) => string[]);
    special?: StepType.TEXT_INPUT | undefined;
    category?: 'mood' | 'energy' | 'texture';
    enableSearch?: boolean;
    enableFrequencyGroups?: boolean;
}

export interface WizardSpecialStep extends BaseStep {
    special: Exclude<StepType, StepType.TEXT_INPUT>;
}

export type WizardStepConfig = WizardPathStep | WizardSpecialStep;

/**
 * AI-Generated Natural Language Phrase State
 */
export interface NLPhraseState {
    currentPhrase: string | null;
    previousPhrase: string | null;
    isGenerating: boolean;
    error: string | null;
    timestamp: string | null;
}

export interface AIGenerationRequest {
    wizardData: Partial<AudioProtocolData>;
    sessionId: string;
    requestId: string;
}

export interface AIGenerationResponse {
    phrase: string;
    confidence: number;
    tokensUsed: number;
    costUSD: number;
    requestId: string;
    timestamp: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    wordCount: number;
    hasInappropriateContent: boolean;
}
