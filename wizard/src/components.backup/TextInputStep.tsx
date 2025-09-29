import React from 'react';
import { type ChangeEvent, useMemo } from 'react';

import { useWizardStore } from '../context/WizardContext';
import { getValueAtPath } from '../utils/dataPaths';

interface TextInputStepProps {
    title: string;
    path: string;
    placeholder?: string;
    stepNumber: number;
    onNext: () => void;
}

export const TextInputStep = ({ title, path, placeholder, stepNumber, onNext }: TextInputStepProps) => {
    const data = useWizardStore((state) => state.data);
    const updateData = useWizardStore((state) => state.updateData);

    const currentValue = useMemo(() => getValueAtPath(data, path), [data, path]);

    return (
        <div className="p-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-1">
                Step {stepNumber}: {title}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mb-4">Enter a value, or leave blank to skip.</p>
            <input
                type="text"
                value={currentValue === 'tbc' ? '' : (currentValue ?? '')}
                onChange={(event: ChangeEvent<HTMLInputElement>) => updateData(path, event.target.value)}
                placeholder={placeholder ?? 'e.g., 120.5'}
                className="w-full p-3 mt-4 border border-gray-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <div className="flex items-center justify-center gap-4 mt-6">
                <button
                    type="button"
                    onClick={() => {
                        if (currentValue === '') {
                            updateData(path, 'tbc');
                        }
                        onNext();
                    }}
                    className="h-10 px-6 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
                >
                    Next &rarr;
                </button>
            </div>
        </div>
    );
};
