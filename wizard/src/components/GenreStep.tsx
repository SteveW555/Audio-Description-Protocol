import React, { useMemo } from 'react';

import { TermSelector } from './TermSelector';
import { VOCABULARY } from '../constants/vocabulary';
import { useWizardStore } from '../context/WizardContext';
import { getSubgenresFor } from '../utils/genreHelpers';

interface GenreStepProps {
    stepNumber: number;
    title: string;
    onNext: () => void;
}

export const GenreStep = ({ stepNumber, title, onNext }: GenreStepProps) => {
    const primary = useWizardStore((state) => state.data.semantic_description.genre.primary);
    const primarySubgenres = useWizardStore((state) => state.data.semantic_description.genre.primary_subgenres);
    const updateData = useWizardStore((state) => state.updateData);

    const primaryOptions = useMemo(() => [...VOCABULARY.primary_genre], []);
    const subgenreOptions = useMemo(() => getSubgenresFor(primary), [primary]);

    const handlePrimarySelect = (value: string | string[]) => {
        const nextPrimary = Array.isArray(value) ? value[0] : value;
        updateData('semantic_description.genre.primary', nextPrimary);
        updateData('semantic_description.genre.primary_subgenres', []);
    };

    const handleSubgenreSelect = (value: string | string[]) => {
        const values = Array.isArray(value) ? value : [value];
        const cleaned = values.filter(Boolean);
        const normalized = cleaned.length > 1 ? cleaned.filter((entry) => entry !== 'tbc') : cleaned;
        updateData('semantic_description.genre.primary_subgenres', normalized);
    };

    const markPrimaryUnknown = () => {
        updateData('semantic_description.genre.primary', 'tbc');
        updateData('semantic_description.genre.primary_subgenres', ['tbc']);
    };

    const markSubgenresUnknown = () => {
        updateData('semantic_description.genre.primary_subgenres', ['tbc']);
    };

    const handleSkip = () => {
        markPrimaryUnknown();
        onNext();
    };

    const handleContinue = () => {
        const resolvedPrimary = primary || 'tbc';
        const resolvedSubgenres = primarySubgenres && primarySubgenres.length > 0 ? primarySubgenres : ['tbc'];

        updateData('semantic_description.genre.primary', resolvedPrimary);
        updateData('semantic_description.genre.primary_subgenres', resolvedSubgenres);
        onNext();
    };

    const isContinueDisabled = !primary;

    return (
        <div className="p-1 space-y-6">
            <div>
                <h2 className="text-base font-bold text-gray-800 dark:text-white">Step {stepNumber}: {title}</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Select the primary genre first, then add one or more subgenres that refine the description.
                </p>
            </div>

            <section className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Primary Genre</h3>
                    <button
                        type="button"
                        onClick={markPrimaryUnknown}
                        className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        Mark as TBC
                    </button>
                </div>
                <TermSelector
                    terms={primaryOptions}
                    selected={primary}
                    onSelect={handlePrimarySelect}
                    onNext={() => {}}
                    onSkip={markPrimaryUnknown}
                    controlsLayout="none"
                />
            </section>

            <section className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Subgenres</h3>
                    <button
                        type="button"
                        onClick={markSubgenresUnknown}
                        className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        Mark as TBC
                    </button>
                </div>
                {subgenreOptions.length > 0 ? (
                    <TermSelector
                        terms={subgenreOptions}
                        selected={primarySubgenres}
                        multi
                        onSelect={handleSubgenreSelect}
                        onNext={() => {}}
                        onSkip={markSubgenresUnknown}
                        controlsLayout="none"
                    />
                ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-gray-400">
                        Choose a primary genre to see matching subgenres.
                    </div>
                )}
            </section>

            <div className="flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={handleSkip}
                    className="px-4 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-800/60 rounded-lg hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                    Skip
                </button>
                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={isContinueDisabled}
                    className="px-5 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save &amp; Continue
                </button>
            </div>
        </div>
    );
};

GenreStep.displayName = 'GenreStep';
