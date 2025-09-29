interface AskStepProps {
    title: string;
    prompt?: string;
    onYes: () => void;
    onNo: () => void;
}

export const AskStep = ({ title, prompt, onYes, onNo }: AskStepProps) => {
    return (
        <div className="p-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{title}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{prompt ?? 'Would you like to add more details?'}</p>
            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50 min-h-[6rem] items-center text-center flex flex-col justify-center">
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onYes}
                        className="px-6 py-2 font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700"
                    >
                        Yes
                    </button>
                    <button
                        type="button"
                        onClick={onNo}
                        className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700"
                    >
                        No, Continue
                    </button>
                </div>
            </div>
        </div>
    );
};
