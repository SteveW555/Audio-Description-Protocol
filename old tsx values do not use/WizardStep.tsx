import { useMemo } from 'react';

import { useWizardStore } from '../context/WizardContext';
import { getValueAtPath } from '../utils/dataPaths';
import { TermSelector } from './TermSelector';

interface WizardStepProps {
    title: string;
    path: string;
    terms?: string[] | ((data: any) => string[]);
    multi?: boolean;
    stepNumber: number;
    onNext: () => void;
}

export const WizardStep = ({ title, path, terms = [], multi, stepNumber, onNext }: WizardStepProps) => {
    const data = useWizardStore((state) => state.data);
    const updateData = useWizardStore((state) => state.updateData);

    const resolvedTerms = useMemo(() => (typeof terms === 'function' ? terms(data) : terms), [data, terms]);
    const currentValue = useMemo(() => getValueAtPath(data, path), [data, path]);

    return (
        <div className="p-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Step {stepNumber}: {title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
                {multi ? 'Select one or more terms, or skip.' : 'Select a term, or skip.'}
            </p>
            <TermSelector
                terms={resolvedTerms ?? []}
                selected={currentValue}
                multi={multi}
                onSelect={(value: string | string[]) => updateData(path, value)}
                onNext={onNext}
                onSkip={() => {
                    updateData(path, multi ? ['tbc'] : 'tbc');
                    onNext();
                }}
            />
        </div>
    );
};
