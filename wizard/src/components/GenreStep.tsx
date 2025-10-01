import React, { useMemo } from 'react';
import { TermSelector } from './TermSelector';
import { VOCABULARY } from '../constants/vocabulary';
import { useWizardStore } from '../context/WizardContext';
import { getSecondaryGenresFor } from '../utils/genreHelpers';
import { generateRandomGenre } from '../utils/randomMET';
interface GenreStepProps {
    stepNumber: number;
    title: string;
    onNext: () => void;
}
export const GenreStep = ({ stepNumber, title, onNext }: GenreStepProps) => {
    const primary = useWizardStore(
        (state) => state.data.semantic_description.genre.primary,
    );
    const primarySubgenres = useWizardStore(
        (state) => state.data.semantic_description.genre.primary_subgenres,
    );
    const updateData = useWizardStore((state) => state.updateData);
    const primaryOptions = useMemo(() => [...VOCABULARY.primary_genres], []);
    const secondaryGenreOptions = useMemo(
        () => getSecondaryGenresFor(primary),
        [primary],
    );
    const hasPrimarySelection = Boolean(primary && primary !== 'tbc');
    const hasSecondaryOptions = secondaryGenreOptions.length > 0;
    const handlePrimarySelect = (value: string | string[]) => {
        const nextPrimary = Array.isArray(value) ? value[0] : value;
        updateData('semantic_description.genre.primary', nextPrimary);
        updateData('semantic_description.genre.primary_subgenres', []);
    };
    const handleSecondaryGenreSelect = (value: string | string[]) => {
        const values = Array.isArray(value) ? value : [value];
        const cleaned = values.filter(Boolean);
        const normalized =
            cleaned.length > 1
                ? cleaned.filter((entry) => entry !== 'tbc')
                : cleaned;
        updateData('semantic_description.genre.primary_subgenres', normalized);
    };
    const markPrimaryUnknown = () => {
        updateData('semantic_description.genre.primary', 'tbc');
        updateData('semantic_description.genre.primary_subgenres', ['tbc']);
    };
    const markSecondaryGenresUnknown = () => {
        updateData('semantic_description.genre.primary_subgenres', ['tbc']);
    };
    const handleSkip = () => {
        markPrimaryUnknown();
        onNext();
    };
    const handleContinue = () => {
        const resolvedPrimary = primary || 'tbc';
        const resolvedSubgenres =
            primarySubgenres && primarySubgenres.length > 0
                ? primarySubgenres
                : ['tbc'];
        updateData('semantic_description.genre.primary', resolvedPrimary);
        updateData(
            'semantic_description.genre.primary_subgenres',
            resolvedSubgenres,
        );
        onNext();
    };

    const handleRandomize = () => {
        const randomGenre = generateRandomGenre();
        updateData('semantic_description.genre.primary', randomGenre.primary);
        updateData('semantic_description.genre.primary_subgenres', randomGenre.subgenres);
        onNext();
    };

    const isContinueDisabled = !primary;
    return (
        <div className="p-1 space-y-6">
            <div>
                <h2 className="text-base font-bold text-gray-800 dark:text-white">
                    Step {stepNumber}: {title}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Select the primary genre first, then add one or more
                    secondary genres that refine the description.
                </p>
            </div>
            <section className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Primary Genre
                </h3>
                <TermSelector
                    terms={primaryOptions}
                    selected={primary}
                    onSelect={handlePrimarySelect}
                    onNext={() => {}}
                    onSkip={markPrimaryUnknown}
                    controlsLayout="none"
                />
                {isContinueDisabled && (
                    <p className="text-xs mt-1" style={{ color: '#D87710' }}>
                        Choose at least 1 genre
                    </p>
                )}
            </section>
            <section
                className={
                    hasPrimarySelection
                        ? 'space-y-2 transition-opacity'
                        : 'space-y-2 transition-opacity opacity-60'
                }
                aria-disabled={!hasPrimarySelection}
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Secondary Genres
                    </h3>
                    {!hasPrimarySelection && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Select a primary genre first.
                        </span>
                    )}
                </div>
                {hasPrimarySelection ? (
                    hasSecondaryOptions ? (
                        <TermSelector
                            terms={secondaryGenreOptions}
                            selected={primarySubgenres}
                            multi
                            onSelect={handleSecondaryGenreSelect}
                            onNext={() => {}}
                            onSkip={markSecondaryGenresUnknown}
                            controlsLayout="none"
                        />
                    ) : (
                        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-gray-400">
                            No secondary genres available for the selected primary genre.
                        </div>
                    )
                ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-gray-400">
                        Choose a primary genre to enable secondary genre selection.
                    </div>
                )}
            </section>
            <div className="flex flex-col-reverse items-center gap-3 pt-2 sm:flex-row sm:justify-center scale-[0.7] origin-center">
                <button
                    type="button"
                    onClick={handleSkip}
                    className="px-4 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-slate-700/40 rounded-lg hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-600/50 transition-colors"
                >
                    Skip
                </button>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleContinue}
                        disabled={isContinueDisabled}
                        className="px-5 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save &amp; Continue
                    </button>
                    <button
                        type="button"
                        onClick={handleRandomize}
                        className="ml-5 px-5 py-1.5 text-sm font-semibold text-white bg-purple-600 rounded-lg shadow-sm hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-slate-900"
                    >
                        Random
                    </button>
                </div>
            </div>
        </div>
    );
};
GenreStep.displayName = 'GenreStep';
