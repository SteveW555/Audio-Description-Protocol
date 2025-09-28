import { useMemo } from 'react';

import { VOCABULARY } from '../constants/vocabulary';
import { useWizardStore } from '../context/WizardContext';
import { StepType, WizardStepConfig } from '../types/wizard';
import { getSubgenresFor, shouldShowVocalDetails } from '../utils/genreHelpers';

export const useWizardSteps = (): WizardStepConfig[] => {
    const data = useWizardStore((state) => state.data);
    const addSecondaryGenre = useWizardStore((state) => state.addSecondaryGenre);
    const addTheory = useWizardStore((state) => state.addTheory);

    return useMemo(() => {
        const steps: WizardStepConfig[] = [
            {
                title: 'Mood',
                path: 'semantic_description.attributes.mood',
                terms: [...VOCABULARY.mood],
                multi: true,
                category: 'mood',
                enableSearch: true,
                enableFrequencyGroups: true
            },
            {
                title: 'Energy',
                path: 'semantic_description.attributes.energy',
                terms: [...VOCABULARY.energy],
                multi: true,
                category: 'energy',
                enableSearch: true,
                enableFrequencyGroups: true
            },
            {
                title: 'Texture',
                path: 'semantic_description.attributes.texture',
                terms: [...VOCABULARY.texture],
                multi: true,
                category: 'texture',
                enableSearch: true,
                enableFrequencyGroups: true
            },
            { title: 'Primary Genre', path: 'semantic_description.genre.primary', terms: [...VOCABULARY.primary_genre] },
            {
                title: 'Primary Subgenres',
                path: 'semantic_description.genre.primary_subgenres',
                terms: (draft) => getSubgenresFor(draft.semantic_description.genre.primary),
                multi: true,
            },
            { title: 'Add Secondary Genre?', special: StepType.ASK_SECONDARY_GENRE },
            {
                title: 'Secondary Genres',
                path: 'semantic_description.genre.secondary',
                terms: [...VOCABULARY.secondary_genre],
                multi: true,
                condition: () => addSecondaryGenre,
            },
            {
                title: 'Secondary Subgenres',
                path: 'semantic_description.genre.secondary_subgenres',
                terms: (draft) => getSubgenresFor(draft.semantic_description.genre.secondary),
                multi: true,
                condition: () => addSecondaryGenre,
            },
            { title: 'Instrumentation', special: StepType.INSTRUMENTATION },
            { title: 'Music Theory', special: StepType.ASK_THEORY },
            {
                title: 'BPM',
                path: 'theory.bpm',
                placeholder: 'e.g., 128',
                special: StepType.TEXT_INPUT,
                condition: () => addTheory,
            },
            {
                title: 'Key',
                path: 'theory.key',
                terms: [...VOCABULARY.key],
                condition: () => addTheory,
            },
            {
                title: 'Scale',
                path: 'theory.scale',
                terms: [...VOCABULARY.scale],
                condition: () => addTheory,
            },
            {
                title: 'Vocal Presence',
                path: 'semantic_description.vocals.presence',
                terms: [...VOCABULARY.vocals_presence],
            },
            {
                title: 'Vocal Gender',
                path: 'semantic_description.vocals.gender',
                terms: [...VOCABULARY.vocals_gender],
                condition: () => shouldShowVocalDetails(data),
            },
            {
                title: 'Vocal Style',
                path: 'semantic_description.vocals.style',
                terms: [...VOCABULARY.vocals_style],
                condition: () => shouldShowVocalDetails(data),
            },
            { title: 'Final Review', special: StepType.FINAL },
        ];

        return steps;
    }, [addSecondaryGenre, addTheory, data]);
};
