import { AudioProtocolData } from './protocol';

export enum StepType {
    ASK_SECONDARY_GENRE = 'ask_secondary_genre',
    ASK_THEORY = 'ask_theory',
    FINAL = 'final',
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
