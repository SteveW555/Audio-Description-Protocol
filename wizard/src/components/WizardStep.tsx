import React from 'react';
import { useMemo } from 'react';

import { useWizardStore } from '../context/WizardContext';
import { getValueAtPath } from '../utils/dataPaths';
import { TermSelector } from './TermSelector';
import { FrequencyFilter } from './FrequencyFilter';
import { GroupByFilter } from './GroupByFilter';
import { useFrequencyFilter } from '../hooks/useFrequencyFilter';
import { useGroupByFilter } from '../hooks/useGroupByFilter';
import { convertToTermsWithFrequency } from '../utils/termFrequencies';

interface WizardStepProps {
    title: string;
    path: string;
    terms?: string[] | ((data: any) => string[]);
    multi?: boolean;
    stepNumber: number;
    onNext: () => void;
    isMusicTheoryStep?: boolean;
}

export const WizardStep = ({ title, path, terms = [], multi, stepNumber, onNext, isMusicTheoryStep }: WizardStepProps) => {
    const data = useWizardStore((state) => state.data);
    const updateData = useWizardStore((state) => state.updateData);
    const { filterTerms } = useFrequencyFilter();
    const { groupByMethod } = useGroupByFilter();

    const resolvedTerms = useMemo(() => (typeof terms === 'function' ? terms(data) : terms), [data, terms]);
    const currentValue = useMemo(() => getValueAtPath(data, path), [data, path]);

    // Convert string terms to Term objects with frequency metadata
    const termsWithFrequency = useMemo(() => convertToTermsWithFrequency(resolvedTerms ?? []), [resolvedTerms]);

    // Apply frequency filter to get filtered term values
    const filteredTermValues = useMemo(() => filterTerms(termsWithFrequency), [filterTerms, termsWithFrequency]);

    return (
        <div className="p-1">
            <h2 className="text-base font-bold text-gray-800 dark:text-white mb-1">Step {stepNumber}: {title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {multi ? 'Select one or more terms, or skip.' : 'Select a term, or skip.'}
            </p>
            {resolvedTerms && resolvedTerms.length > 0 && !isMusicTheoryStep && (
                <div className="mb-4 flex flex-col gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900/50">
                    <FrequencyFilter terms={termsWithFrequency} className="mb-0 bg-transparent dark:bg-transparent" />
                    <GroupByFilter className="mb-0 bg-transparent dark:bg-transparent" />
                </div>
            )}
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
                groupByMethod={groupByMethod}
                attributeType={title}
            />
        </div>
    );
};
