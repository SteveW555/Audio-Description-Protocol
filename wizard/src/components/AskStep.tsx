import React from 'react';
import { RANDOM_BUTTON_COLORS } from '../constants/uiConstants';

interface AskStepProps {
    title: string;
    prompt?: string;
    onYes: () => void;
    onNo: () => void;
    onPrev?: () => void;
    onRandom?: () => void;
}

export const AskStep = ({ title, prompt, onYes, onNo, onPrev, onRandom }: AskStepProps) => {
    return (
        <div className="p-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-1">{title}</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-4">{prompt ?? 'Would you like to add more details?'}</p>

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
                    onClick={onNo}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                    Next →
                </button>
            </div>

            <div className="p-4 border border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800/50 min-h-[6rem] items-center text-center flex flex-col justify-center">
                <div className="relative flex gap-4 scale-[0.7] w-full justify-center">
                    <button
                        type="button"
                        onClick={onYes}
                        className="h-10 px-6 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-colors"
                    >
                        Yes
                    </button>
                    <button
                        type="button"
                        onClick={onNo}
                        className="h-10 px-6 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        No, Continue
                    </button>
                    {onRandom && (
                        <button
                            type="button"
                            onClick={onRandom}
                            className="absolute left-[90%] h-10 px-3 text-sm font-semibold whitespace-nowrap text-white rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            style={{ backgroundColor: RANDOM_BUTTON_COLORS.background }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = RANDOM_BUTTON_COLORS.hover}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = RANDOM_BUTTON_COLORS.background}
                        >
                            Random Theory
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
