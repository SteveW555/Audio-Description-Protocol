import React, { useEffect, useMemo, useRef } from 'react';

import { useWizardStore } from '../context/WizardContext';
import { getValueAtPath } from '../utils/dataPaths';
import { TermSelector } from './TermSelector';
import { FrequencyFilter } from './FrequencyFilter';
import { GroupByFilter } from './GroupByFilter';
import { useFrequencyFilter } from '../hooks/useFrequencyFilter';
import { useGroupByFilter } from '../hooks/useGroupByFilter';
import { convertToTermsWithFrequency } from '../utils/termFrequencies';
import type { GroupByMethod } from '../types/grouping';
import { useGroupByStore } from '../store/groupByStore';
import { generateRandomMETCategory } from '../utils/randomMET';

interface WizardStepProps {
    title: string;
    path: string;
    terms?: string[] | ((data: any) => string[]);
    multi?: boolean;
    stepNumber: number;
    onNext: () => void;
    onPrev?: () => void;
    isMusicTheoryStep?: boolean;
    onRandomizeAll?: () => void;
}

export const WizardStep = ({ title, path, terms = [], multi, stepNumber, onNext, onPrev, isMusicTheoryStep, onRandomizeAll }: WizardStepProps) => {
    const data = useWizardStore((state) => state.data);
    const updateData = useWizardStore((state) => state.updateData);
    const { filterTerms } = useFrequencyFilter();
    const { groupByMethod, setGroupByMethod } = useGroupByFilter();

    const resolvedTerms = useMemo(() => (typeof terms === 'function' ? terms(data) : terms), [data, terms]);
    const currentValue = useMemo(() => getValueAtPath(data, path), [data, path]);

    // Convert string terms to Term objects with frequency metadata
    const termsWithFrequency = useMemo(() => convertToTermsWithFrequency(resolvedTerms ?? []), [resolvedTerms]);

    // Apply frequency filter to get filtered term values
    const filteredTermValues = useMemo(() => filterTerms(termsWithFrequency), [filterTerms, termsWithFrequency]);

    const isTextureStep = path === 'semantic_description.attributes.texture';
    const storedGroupByRef = useRef<GroupByMethod | null>(null);
    const hasStoredGroupByRef = useRef(false);

    // Determine if this is a MET step (Mood, Energy, or Texture)
    const isMETStep = path === 'semantic_description.attributes.mood' ||
        path === 'semantic_description.attributes.energy' ||
        path === 'semantic_description.attributes.texture';

    const metCategory = isMETStep
        ? (title as 'Mood' | 'Energy' | 'Texture')
        : null;

    // Handler for random selection
    const handleRandom = () => {
        if (!metCategory) return;
        const randomTerms = generateRandomMETCategory(metCategory);
        updateData(path, randomTerms);
        onNext();
    };

    useEffect(() => {
        if (!isTextureStep) {
            return;
        }

        const previousGroupBy = useGroupByStore.getState().groupByMethod;
        storedGroupByRef.current = previousGroupBy;
        hasStoredGroupByRef.current = true;

        if (previousGroupBy !== 'popularity') {
            setGroupByMethod('popularity');
        }

        return () => {
            if (!hasStoredGroupByRef.current) {
                return;
            }

            const fallback = storedGroupByRef.current ?? 'category';
            hasStoredGroupByRef.current = false;
            storedGroupByRef.current = null;

            setGroupByMethod(fallback);
        };
    }, [isTextureStep, setGroupByMethod]);

    return (
        <div className="p-1 flex flex-col h-full">
            <div className="flex-shrink-0">
                <h2 className="text-base font-bold text-gray-800 dark:text-white mb-1">Step {stepNumber}: {title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {multi ? 'Select one or more terms, or skip.' : 'Select a term, or skip.'}
                </p>

                {/* Prev/Next Navigation Buttons */}
                <div className="mb-3 flex gap-2">
                    {onPrev && (
                        <button
                            onClick={onPrev}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-200 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
                        >
                            ← Prev
                        </button>
                    )}
                    <button
                        onClick={onNext}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                    >
                        Next →
                    </button>
                </div>

                {resolvedTerms && resolvedTerms.length > 0 && !isMusicTheoryStep && (
                    <div className="mb-2 flex flex-col gap-0.5 rounded-lg border border-gray-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900/50">
                        <FrequencyFilter terms={termsWithFrequency} className="mb-0 bg-transparent dark:bg-transparent" />
                        <GroupByFilter className="mb-0 bg-transparent dark:bg-transparent" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-h-0">
                <TermSelector
                    terms={filteredTermValues}
                    selected={currentValue}
                    multi={multi}
                    onSelect={(value: string | string[]) => updateData(path, value)}
                    onNext={onNext}
                    onSkip={() => {
                        updateData(path, multi ? ['tbc'] : 'tbc');
                        onNext();
                    }}
                    onRandom={isMETStep ? handleRandom : undefined}
                    randomButtonLabel={isMETStep ? `Random ${title}` : undefined}
                    onRandomizeAll={onRandomizeAll}
                    groupByMethod={groupByMethod}
                    attributeType={title}
                />
            </div>
        </div>
    );
};
