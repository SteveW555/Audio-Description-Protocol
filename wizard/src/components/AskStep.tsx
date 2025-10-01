import React from 'react';
interface AskStepProps {
    title: string;
    prompt?: string;
    onYes: () => void;
    onNo: () => void;
    onRandom?: () => void;
}

export const AskStep = ({ title, prompt, onYes, onNo, onRandom }: AskStepProps) => {
    return (
        <div className="p-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-1">{title}</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-4">{prompt ?? 'Would you like to add more details?'}</p>
            <div className="p-4 border border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800/50 min-h-[6rem] items-center text-center flex flex-col justify-center">
                <div className="flex gap-4 scale-[0.7]">
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
                            className="h-10 px-6 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-colors"
                        >
                            Random
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
