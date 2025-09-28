import { memo, useState, useMemo } from 'react';
import { getTermsByFrequency } from '../constants/vocabulary';

interface TermSelectorProps {
    terms: string[];
    onSelect: (value: string | string[]) => void;
    selected?: string | string[];
    multi?: boolean;
    onNext: () => void;
    onSkip: () => void;
    category?: 'mood' | 'energy' | 'texture';
    enableFrequencyGroups?: boolean;
    enableSearch?: boolean;
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

export const TermSelector = memo(({ terms, onSelect, selected, multi, onNext, onSkip, category, enableFrequencyGroups = false, enableSearch = false }: TermSelectorProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFrequencyFilter, setShowFrequencyFilter] = useState<'all' | 'ubiquitous' | 'frequent' | 'infrequent' | 'rare'>('all');

    const handleSelect = (term: string) => {
        if (multi) {
            const list = Array.isArray(selected) ? selected : [];
            const nextSelected = list.includes(term) ? list.filter((entry) => entry !== term) : [...list, term];
            onSelect(nextSelected);
        } else {
            onSelect(term);
        }
    };

    // Filter terms based on search and frequency
    const filteredTerms = useMemo(() => {
        let filtered = terms;

        // Apply search filter
        if (enableSearch && searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(term =>
                term.toLowerCase().includes(query) ||
                term.replace(/-/g, ' ').toLowerCase().includes(query)
            );
        }

        // Apply frequency filter (if enabled and supported)
        if (enableFrequencyGroups && category && showFrequencyFilter !== 'all') {
            const frequencyTerms = getTermsByFrequency(category, showFrequencyFilter);
            filtered = filtered.filter(term => (frequencyTerms as readonly string[]).includes(term));
        }

        return filtered;
    }, [terms, searchQuery, showFrequencyFilter, enableSearch, enableFrequencyGroups, category]);

    const isNextDisabled = getNextDisabledState(selected, multi);

    return (
        <div>
            {/* Search and Filter Controls */}
            {(enableSearch || enableFrequencyGroups) && (
                <div className="mb-4 space-y-3">
                    {enableSearch && (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search terms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    )}

                    {enableFrequencyGroups && category && (
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Filter by frequency:</span>
                            {(['all', 'ubiquitous', 'frequent', 'infrequent', 'rare'] as const).map(freq => (
                                <button
                                    key={freq}
                                    onClick={() => setShowFrequencyFilter(freq)}
                                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                        showFrequencyFilter === freq
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {freq === 'all' ? 'All' : freq.charAt(0).toUpperCase() + freq.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Term Selection Area */}
            <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 min-h-[6rem] max-h-80 overflow-y-auto items-start">
                {filteredTerms.length === 0 ? (
                    <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
                        {searchQuery ? `No terms found matching "${searchQuery}"` : 'No terms available'}
                    </div>
                ) : (
                    filteredTerms.map((term) => (
                        <button
                            key={term}
                            type="button"
                            onClick={() => handleSelect(term)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 break-words ${isMultiSelected(selected, term, multi)
                                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300 dark:ring-blue-500'
                                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
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