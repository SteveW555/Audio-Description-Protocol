import React, { useEffect, useRef } from 'react';
import { TermSelectorProps } from '../types/filter';
import { RANDOM_BUTTON_COLORS } from '../constants/uiConstants';
import { groupTermsByCategory, groupTermsByPopularity } from '../utils/termGrouping';

const isMultiSelected = (selected: string | string[] | undefined, term: string, multi?: boolean) => {
    if (!selected) return false;
    if (multi) return Array.isArray(selected) && selected.includes(term);
    return selected === term;
};

const getNextDisabledState = (selected: string | string[] | undefined, multi?: boolean): boolean => {
    if (multi) return !Array.isArray(selected) || selected.length === 0;
    return !selected;
};

export const TermSelector = ({
    terms,
    onSelect,
    selected,
    multi,
    onNext,
    onSkip,
    onRandom,
    randomButtonLabel,
    groupByMethod,
    attributeType,
    controlsLayout = 'default',
    compactMode = false,
}: TermSelectorProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        if (controlsLayout === 'none') {
            return undefined;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Enter') {
                return;
            }

            const target = event.target as HTMLElement | null;

            if (target) {
                const tag = target.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA' || target.dataset.role === 'next-button' || target.dataset.role === 'skip-button') {
                    return;
                }
            }

            if (!containerRef.current) {
                return;
            }

            const isWithinSelector = target ? containerRef.current.contains(target) : true;

            if (isWithinSelector && !isNextDisabled) {
                event.preventDefault();
                onNext();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [controlsLayout, isNextDisabled, onNext]);

    // Use all terms without filtering to match original simplicity
    const filteredTerms = terms;

    // Group terms if groupByMethod is provided
    const groupedTerms = groupByMethod
        ? groupByMethod === 'category'
            ? groupTermsByCategory(filteredTerms)
            : groupTermsByPopularity(filteredTerms)
        : null;

    // Separate ungrouped terms (terms without metadata)
    const ungroupedTerms = groupByMethod
        ? filteredTerms.filter(term => {
            const allGroupedTerms = groupedTerms?.flatMap(g => g.terms) || [];
            return !allGroupedTerms.includes(term);
        })
        : [];

    // Render a single term button
    const renderTermButton = (term: string) => (
        //-- Main Buttons Styling --
        <button
            key={term}
            type="button"
            onClick={() => handleSelect(term)}
            data-role="term-button"
            className={`px-[8px] py-[2px] text-[10px] font-medium rounded transition-all duration-200 ${isMultiSelected(selected, term, multi)
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-300 dark:border-transparent'
                }`}
        >
            {term.replace(/-/g, ' ')}
        </button>
    );

    return (
        <div ref={containerRef} className="flex flex-col h-full">
            {/* Term Selection Area */}
            <div className={`flex flex-wrap gap-x-1 gap-y-1 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900/50 flex-1 overflow-y-auto items-center ${
                compactMode
                    ? 'px-3 pt-0.5 pb-0 min-h-[3rem]'
                    : 'px-4 pt-2 pb-0 min-h-[6rem]'
            }`}>
                {filteredTerms.length === 0 ? (
                    <div className="w-full text-center py-8 text-gray-500 dark:text-slate-400">
                        No terms available
                    </div>
                ) : groupByMethod && groupedTerms ? (
                    // Grouped layout
                    <div className="w-full">
                        {groupedTerms.map((group, groupIndex) => (
                            <div key={group.label} data-testid="term-group">
                                {/* Group separator (except for first group) */}
                                {groupIndex > 0 && (
                                    <div
                                        data-testid="group-separator"
                                        className="border-t border-gray-300 dark:border-gray-600 pt-1.5 mt-1.5"
                                    />
                                )}

                                {/* Group label */}
                                <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
                                    <span
                                        data-testid="group-label"
                                        className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300 bg-[#f0f0f0] dark:bg-slate-700 px-2 py-[1px] rounded mr-1"
                                    >
                                        {group.label}:
                                    </span>

                                    {group.terms.map(renderTermButton)}
                                </div>
                            </div>
                        ))}

                        {/* Ungrouped terms at end (no label) */}
                        {ungroupedTerms.length > 0 && (
                            <div data-testid="term-group">
                                <div className="border-t border-gray-300 dark:border-gray-600 pt-1.5 mt-1.5" />
                                <div className="flex flex-wrap gap-x-1 gap-y-1">
                                    {ungroupedTerms.map(renderTermButton)}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Flat layout (backward compatible)
                    filteredTerms.map(renderTermButton)
                )}
            </div>

            {controlsLayout === 'default' && (
                <div className="relative flex items-start justify-center gap-4 mt-auto pt-5 flex-shrink-0 scale-[0.7] origin-center">
                    <button
                        type="button"
                        onClick={onSkip}
                        data-role="skip-button"
                        className="px-6 py-1.5 font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-slate-700/40 rounded-lg hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-600/50 transition-colors"
                    >
                        Skip
                    </button>
                    <div className="flex flex-col items-center gap-2">
                        <button
                            type="button"
                            onClick={onNext}
                            disabled={isNextDisabled}
                            data-role="next-button"
                            className="px-6 py-1.5 font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next &rarr;
                        </button>
                        {isNextDisabled && attributeType && (
                            <p className="text-xs" style={{ color: '#D87710' }}>
                                Choose at least 1 {attributeType}
                            </p>
                        )}
                    </div>
                    {onRandom && (
                        <button
                            type="button"
                            onClick={onRandom}
                            data-role="random-button"
                            className="absolute left-[90%] px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-900"
                            style={{ backgroundColor: RANDOM_BUTTON_COLORS.background }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = RANDOM_BUTTON_COLORS.hover}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = RANDOM_BUTTON_COLORS.background}
                        >
                            {randomButtonLabel || 'Random'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
