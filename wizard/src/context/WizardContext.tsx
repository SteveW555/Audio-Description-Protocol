import React, { createContext, ReactNode, useContext, useRef } from 'react';
import { create, StoreApi, UseBoundStore } from 'zustand';

import { getInitialState } from '../constants/initialState';
import { AudioProtocolData } from '../types/protocol';
import { setValueAtPath } from '../utils/dataPaths';

export interface WizardState {
    data: AudioProtocolData;
    step: number;
    instrumentStep: number;
    currentInstrumentIndex: number;
    addSecondaryGenre: boolean;
    addTheory: boolean;
    setStep: (step: number) => void;
    setInstrumentStep: (step: number) => void;
    setCurrentInstrumentIndex: (index: number) => void;
    setAddSecondaryGenre: (value: boolean) => void;
    setAddTheory: (value: boolean) => void;
    updateData: (path: string, value: unknown) => void;
    replaceData: (data: AudioProtocolData) => void;
    reset: () => void;
}

type WizardStoreSetter = (
    partial:
        | WizardState
        | Partial<WizardState>
        | ((state: WizardState) => WizardState | Partial<WizardState>),
    replace?: boolean
) => void;

const createWizardStore = () => {
    const initializer = (set: WizardStoreSetter): WizardState => ({
        data: getInitialState(),
        step: 0,
        instrumentStep: 0,
        currentInstrumentIndex: 0,
        addSecondaryGenre: false,
        addTheory: false,
        setStep: (step: number) => set({ step }),
        setInstrumentStep: (instrumentStep: number) => set({ instrumentStep }),
        setCurrentInstrumentIndex: (currentInstrumentIndex: number) => set({ currentInstrumentIndex }),
        setAddSecondaryGenre: (addSecondaryGenre: boolean) => set({ addSecondaryGenre }),
        setAddTheory: (addTheory: boolean) => set({ addTheory }),
        updateData: (path: string, value: unknown) =>
            set((state) => ({
                data: setValueAtPath(state.data, path, value),
            })),
        replaceData: (data: AudioProtocolData) =>
            set({
                data,
            }),
        reset: () =>
            set({
                data: getInitialState(),
                step: 0,
                instrumentStep: 0,
                currentInstrumentIndex: 0,
                addSecondaryGenre: false,
                addTheory: false,
            }),
    });

    return create(initializer);
};

type WizardStore = UseBoundStore<StoreApi<WizardState>>;

const WizardStoreContext = createContext<WizardStore | undefined>(undefined);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
    const storeRef = useRef<WizardStore>();
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
