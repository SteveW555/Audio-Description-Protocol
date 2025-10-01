import React, { createContext, ReactNode, useContext, useRef } from 'react';
import { create, StateCreator, StoreApi, UseBoundStore } from 'zustand';

import { getInitialState } from '../constants/initialState';
import { AudioProtocolData } from '../types/protocol';
import { NLPhraseState } from '../types/wizard';
import { setValueAtPath } from '../utils/dataPaths';

export interface WizardState {
    data: AudioProtocolData;
    step: number;
    instrumentStep: number;
    currentInstrumentIndex: number;
    addTheory: boolean;
    nlPhrase: NLPhraseState;
    setStep: (step: number) => void;
    setInstrumentStep: (step: number) => void;
    setCurrentInstrumentIndex: (index: number) => void;
    setAddTheory: (value: boolean) => void;
    updateData: (path: string, value: unknown) => void;
    replaceData: (data: AudioProtocolData) => void;
    updateNLPhrase: (phrase: string | null) => void;
    setNLGenerating: (isGenerating: boolean) => void;
    setNLError: (error: string | null) => void;
    reset: () => void;
}

type WizardStore = UseBoundStore<StoreApi<WizardState>>;

const createWizardStore = (): WizardStore => {
    const initializer: StateCreator<WizardState> = (set) => ({
        data: getInitialState(),
        step: 0,
        instrumentStep: 0,
        currentInstrumentIndex: 0,
        addTheory: false,
        nlPhrase: {
            currentPhrase: null,
            previousPhrase: null,
            isGenerating: false,
            error: null,
            timestamp: null,
        },
        setStep: (step: number) => set({ step }),
        setInstrumentStep: (instrumentStep: number) => set({ instrumentStep }),
        setCurrentInstrumentIndex: (currentInstrumentIndex: number) => set({ currentInstrumentIndex }),
        setAddTheory: (addTheory: boolean) => set({ addTheory }),
        updateData: (path: string, value: unknown) =>
            set((state) => ({
                data: setValueAtPath(state.data, path, value),
            })),
        replaceData: (data: AudioProtocolData) =>
            set({
                data,
            }),
        updateNLPhrase: (phrase: string | null) =>
            set((state) => ({
                nlPhrase: {
                    ...state.nlPhrase,
                    previousPhrase: state.nlPhrase.currentPhrase,
                    currentPhrase: phrase,
                    timestamp: new Date().toISOString(),
                    error: null,
                },
            })),
        setNLGenerating: (isGenerating: boolean) =>
            set((state) => ({
                nlPhrase: {
                    ...state.nlPhrase,
                    isGenerating,
                },
            })),
        setNLError: (error: string | null) =>
            set((state) => ({
                nlPhrase: {
                    ...state.nlPhrase,
                    error,
                    isGenerating: false,
                },
            })),
        reset: () =>
            set({
                data: getInitialState(),
                step: 0,
                instrumentStep: 0,
                currentInstrumentIndex: 0,
                addTheory: false,
                nlPhrase: {
                    currentPhrase: null,
                    previousPhrase: null,
                    isGenerating: false,
                    error: null,
                    timestamp: null,
                },
            }),
    });

    return create<WizardState>()(initializer);
};

const WizardStoreContext = createContext<WizardStore | undefined>(undefined);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
    const storeRef = useRef<WizardStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = createWizardStore();
    }

    return (
        <WizardStoreContext.Provider value={storeRef.current}>
            {children}
        </WizardStoreContext.Provider>
    );
};

export const useWizardStore = <T,>(selector: (state: WizardState) => T): T => {
    const store = useContext(WizardStoreContext);
    if (!store) {
        throw new Error('useWizardStore must be used within a WizardProvider');
    }
    return store(selector);
};
