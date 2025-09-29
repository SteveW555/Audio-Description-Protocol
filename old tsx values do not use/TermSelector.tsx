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

    const isNextDisabled = getNextDisabledState(selected, multi);

    return (
        <div>
            <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 min-h-[6rem] items-center">
                {terms.map((term) => (
                    <button
                        key={term}
                        type="button"
                        onClick={() => handleSelect(term)}
                        className={`px-[8px] py-1.1 text-[11px] font-medium rounded transition-all duration-200 ${isMultiSelected(selected, term, multi)
                            ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300 dark:ring-blue-500'
                            : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        {term}
                    </button>
                ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
                <button
                    type="button"
                    onClick={onSkip}
                    className="px-6 py-2 font-semibold text-gray-600 bg-transparent rounded-lg hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                    Skip
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next &rarr;
                </button>
            </div>
        </div>
    );
});

TermSelector.displayName = 'TermSelector';
