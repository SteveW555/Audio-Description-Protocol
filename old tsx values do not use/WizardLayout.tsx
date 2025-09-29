import { type ChangeEvent, useEffect, useMemo, useRef } from 'react';

import { StepType } from '../types/wizard';
import { useWizardNavigation } from '../hooks/useWizardNavigation';
import { useWizardStore } from '../context/WizardContext';
import { AskStep } from './AskStep';
import { FinalStep } from './FinalStep';
import { InstrumentationWizard } from './InstrumentationWizard';
import { JsonPreview } from './JsonPreview';
import { TextInputStep } from './TextInputStep';
import { WizardStep } from './WizardStep';

export const WizardLayout = () => {
    const titleInputRef = useRef<HTMLInputElement>(null);
    const data = useWizardStore((state) => state.data);
    const updateData = useWizardStore((state) => state.updateData);
    const setAddSecondaryGenre = useWizardStore((state) => state.setAddSecondaryGenre);
    const setAddTheory = useWizardStore((state) => state.setAddTheory);
    const setStep = useWizardStore((state) => state.setStep);
    const setInstrumentStep = useWizardStore((state) => state.setInstrumentStep);
    const setCurrentInstrumentIndex = useWizardStore((state) => state.setCurrentInstrumentIndex);
    const resetStore = useWizardStore((state) => state.reset);

    const { currentStepConfig, stepNumber, step, steps, goToNextStep, goToPreviousStep, isFinalStep } = useWizardNavigation();

    useEffect(() => {
        if (step === 0 && titleInputRef.current) {
            titleInputRef.current.select();
        }
    }, [step]);

    const instrumentationIndex = useMemo(
        () => steps.findIndex((entry) => 'special' in entry && entry.special === StepType.INSTRUMENTATION),
        [steps]
    );

    const vocalPresenceIndex = useMemo(
        () => steps.findIndex((entry) => 'path' in entry && entry.path === 'semantic_description.vocals.presence'),
        [steps]
    );

    const handleRestart = () => {
        resetStore();
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    };

    const renderStep = () => {
        if (!currentStepConfig) {
            return <FinalStep onRestart={handleRestart} />;
        }

        if ('special' in currentStepConfig) {
            switch (currentStepConfig.special) {
                case StepType.ASK_SECONDARY_GENRE:
                    return (
                        <AskStep
                            title={`Step ${stepNumber}: Secondary Genre`}
                            prompt="Would you like to add another genre?"
                            onYes={() => {
                                setAddSecondaryGenre(true);
                                goToNextStep();
                            }}
                            onNo={() => {
                                setAddSecondaryGenre(false);
                                if (instrumentationIndex >= 0) {
                                    setStep(instrumentationIndex);
                                } else {
                                    goToNextStep();
                                }
                            }}
                        />
                    );
                case StepType.ASK_THEORY:
                    return (
                        <AskStep
                            title={`Step ${stepNumber}: Music Theory`}
                            prompt="Do you want to add music theory details, or leave that to auto-detection?"
                            onYes={() => {
                                setAddTheory(true);
                                goToNextStep();
                            }}
                            onNo={() => {
                                setAddTheory(false);
                                updateData('theory.bpm', 'tbc');
                                updateData('theory.key', 'tbc');
                                updateData('theory.scale', 'tbc');
                                if (vocalPresenceIndex >= 0) {
                                    setStep(vocalPresenceIndex);
                                } else {
                                    goToNextStep();
                                }
                            }}
                        />
                    );
                case StepType.INSTRUMENTATION:
                    return (
                        <InstrumentationWizard
                            stepNumber={stepNumber}
                            onNext={() => {
                                setInstrumentStep(0);
                                setCurrentInstrumentIndex(0);
                                goToNextStep();
                            }}
                        />
                    );
                case StepType.FINAL:
                    return <FinalStep onRestart={handleRestart} />;
                case StepType.TEXT_INPUT:
                    return (
                        <TextInputStep
                            title={currentStepConfig.title}
                            path={currentStepConfig.path}
                            placeholder={currentStepConfig.placeholder}
                            stepNumber={stepNumber}
                            onNext={goToNextStep}
                        />
                    );
                default:
                    break;
            }
        }

        return (
            <WizardStep
                title={currentStepConfig.title}
                path={'path' in currentStepConfig ? currentStepConfig.path : ''}
                terms={'terms' in currentStepConfig ? currentStepConfig.terms : []}
                multi={'multi' in currentStepConfig ? currentStepConfig.multi : undefined}
                stepNumber={stepNumber}
                onNext={goToNextStep}
            />
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Audio Protocol Wizard</h1>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Create structured, machine-readable audio descriptions step-by-step.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 lg:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Sample Title</h2>
                        <input
                            ref={titleInputRef}
                            autoFocus
                            type="text"
                            value={data.path === 'tbc' ? '' : data.path}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => updateData('path', event.target.value)}
                            placeholder="e.g., Cool_Synth_Loop_01.wav"
                            className="w-full p-3 mt-4 border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">(In production this will be auto-filled from the audio sample)</p>

                        <hr className="my-6 border-gray-200 dark:border-gray-700" />

                        {step > 0 && !isFinalStep && (
                            <button
                                type="button"
                                onClick={goToPreviousStep}
                                className="mb-4 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                &larr; Back
                            </button>
                        )}
                        {renderStep()}
                    </div>

                    <div className="h-[32rem] lg:h-auto">
                        <JsonPreview />
                    </div>
                </div>
            </div>
        </div>
    );
};
