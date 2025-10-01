import { useCallback, useMemo } from 'react';

import { VOCABULARY } from '../constants/vocabulary';
import { useWizardStore } from '../context/WizardContext';
import { InstrumentationEntry } from '../types/protocol';
import { getInstrumentDescriptors, getInstrumentRoles } from '../utils/instrumentation';

export const MAX_NUM_INSTRUMENTS = 2;

const emptyInstrument = (): InstrumentationEntry => ({
    instrument: '',
    role: '',
    descriptors: [],
});

export const useInstrumentationFlow = () => {
    const data = useWizardStore((state) => state.data);
    const instrumentStep = useWizardStore((state) => state.instrumentStep);
    const setInstrumentStep = useWizardStore((state) => state.setInstrumentStep);
    const currentInstrumentIndex = useWizardStore((state) => state.currentInstrumentIndex);
    const setCurrentInstrumentIndex = useWizardStore((state) => state.setCurrentInstrumentIndex);
    const updateData = useWizardStore((state) => state.updateData);

    const instrumentation = data.semantic_description.instrumentation;
    const currentInstrument = instrumentation[currentInstrumentIndex] ?? emptyInstrument();

    const addInstrument = useCallback(() => {
        if (instrumentation.length >= MAX_NUM_INSTRUMENTS) {
            return false;
        }

        const nextInstruments = [...instrumentation, emptyInstrument()];
        updateData('semantic_description.instrumentation', nextInstruments);
        setCurrentInstrumentIndex(nextInstruments.length - 1);
        setInstrumentStep(1);
        return true;
    }, [instrumentation, setCurrentInstrumentIndex, setInstrumentStep, updateData]);

    const updateInstrumentField = useCallback(
        <K extends keyof InstrumentationEntry>(field: K, value: InstrumentationEntry[K]) => {
            const nextInstruments = [...instrumentation];
            nextInstruments[currentInstrumentIndex] = {
                ...(nextInstruments[currentInstrumentIndex] ?? emptyInstrument()),
                [field]: value,
            } as InstrumentationEntry;
            updateData('semantic_description.instrumentation', nextInstruments);
        },
        [currentInstrumentIndex, instrumentation, updateData]
    );

    const overwriteCurrentInstrument = useCallback(
        (nextEntry: InstrumentationEntry) => {
            const nextInstruments = [...instrumentation];
            nextInstruments[currentInstrumentIndex] = {
                ...emptyInstrument(),
                ...nextEntry,
            };
            updateData('semantic_description.instrumentation', nextInstruments);
        },
        [currentInstrumentIndex, instrumentation, updateData]
    );

    const descriptorOptions = useMemo(
        () => getInstrumentDescriptors(currentInstrument.instrument),
        [currentInstrument.instrument]
    );

    const roleOptions = useMemo(
        () => getInstrumentRoles(currentInstrument.instrument),
        [currentInstrument.instrument]
    );

    return {
        instrumentStep,
        setInstrumentStep,
        currentInstrumentIndex,
        currentInstrument,
        instrumentation,
        addInstrument,
        updateInstrumentField,
        overwriteCurrentInstrument,
        descriptorOptions,
        roleOptions,
        instrumentOptions: [...VOCABULARY.instrument],
    };
};
