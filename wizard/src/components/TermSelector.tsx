import React from 'react';
import { memo } from 'react';

interface TermSelectorProps {
    terms: string[];
    onSelect: (value: string | string[]) => void;
    selected?: string | string[];
    multi?: boolean;
    onNext: () => void;
    onSkip: () => void;
}

const isMultiSelected = (selected: string | string[] | undefined, term: string, multi?: boolean) => {
    if (!selected) return false;
    if (multi) return Array.isArray(selected) && selected.includes(term);
    return selected === term;
};

const getNextDisabledState = (selected: string | string[] | undefined, multi?: boolean): boolean => {
    if (multi) return !Array.isArray(selected) || selected.length === 0;
    return !selected;
};

export const TermSelector = memo(({ terms, onSelect, selected, multi, onNext, onSkip }: TermSelectorProps) => {

    const handleSelect = (term: string) => {
        if (multi) {
            const list = Array.isArray(selected) ? selected : [];
            const nextSelected = list.includes(term) ? list.filter((entry) => entry !== term) : [...list, term];
            onSelect(nextSelected);
        } else {
            onSelect(term);
        }
    };

    // Use all terms without filtering to match original simplicity
    const filteredTerms = terms;

    const isNextDisabled = getNextDisabledState(selected, multi);

    return (
        <div>
            {/* Term Selection Area */}
            <div className="flex flex-wrap gap-x-1 gap-y-1 p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900/50 min-h-[6rem] max-h-80 overflow-y-auto items-center">
                {filteredTerms.length === 0 ? (
                    <div className="w-full text-center py-8 text-gray-500 dark:text-slate-400">
                        No terms available
                    </div>
                ) : (
                    filteredTerms.map((term) => (
                        //-- Main Buttons Styling --
                        <button
                            key={term}
                            type="button"
                            onClick={() => handleSelect(term)}
                            className={`px-[8px] py-[2px] text-[10px] font-medium rounded transition-all duration-200 ${isMultiSelected(selected, term, multi)
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-300 dark:border-transparent'
                                }`}
                        >
                            {term.replace(/-/g, ' ')}
                        </button>
                    ))
                )}
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
                <button
                    type="button"
                    onClick={onSkip}
                    className="px-6 py-2 font-semibold text-gray-600 dark:text-gray-400 bg-transparent rounded-lg hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                    Skip
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next &rarr;
                </button>
            </div>
        </div>
    );
});

TermSelector.displayName = 'TermSelector';