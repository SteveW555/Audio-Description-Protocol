import React from 'react';
import { type ChangeEvent, useEffect, useMemo, useRef } from 'react';

import { StepType } from '../types/wizard';
import { useWizardNavigation } from '../hooks/useWizardNavigation';
import { useAIPhraseGeneration } from '../hooks/useAIPhraseGeneration';
import { useWizardStore } from '../context/WizardContext';
import { AskStep } from './AskStep';
import { FinalStep } from './FinalStep';
import { InstrumentationWizard } from './InstrumentationWizard';
import { JsonPreview } from './JsonPreview';
import { HumanReadablePreview } from './HumanReadablePreview';
import { NLPhraseDisplay } from './NLPhraseDisplay';
import { TextInputStep } from './TextInputStep';
import { ThemeToggleButton } from './ThemeToggleButton';
import { WizardStep } from './WizardStep';

export const WizardLayout = () => {
    // Initialize AI phrase generation hook
    useAIPhraseGeneration();
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
                                // Manually jump to BPM step (next step after ASK_THEORY)
                                setStep(step + 1);
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
                            numericOnly={currentStepConfig.path === 'theory.bpm'}
                        />
                    );
                default:
                    break;
            }
        }

        // Check if this is a Music Theory step (BPM, Key, Scale)
        const isMusicTheoryStep = 'path' in currentStepConfig &&
            (currentStepConfig.path === 'theory.bpm' ||
                currentStepConfig.path === 'theory.key' ||
                currentStepConfig.path === 'theory.scale');

        return (
            <WizardStep
                title={currentStepConfig.title}
                path={'path' in currentStepConfig ? currentStepConfig.path : ''}
                terms={'terms' in currentStepConfig ? currentStepConfig.terms : []}
                multi={'multi' in currentStepConfig ? currentStepConfig.multi : undefined}
                stepNumber={stepNumber}
                onNext={goToNextStep}
                isMusicTheoryStep={isMusicTheoryStep}
            />
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Audio Protocol Wizard</h1>
                        <p className="mt-1.5 text-lg text-gray-500 dark:text-gray-400">Create structured, machine-readable audio descriptions step-by-step.</p>
                    </div>
                    <ThemeToggleButton />
                </header>

                <hr className="border-t-2 border-gray-300 dark:border-slate-700 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_0.7fr)_minmax(0,_0.3fr)] gap-8">
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur rounded-xl shadow-lg px-6 pb-6 pt-2 md:px-8 md:pb-8 md:pt-4">
                        <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <h2 className="text-base font-bold text-gray-800 dark:text-white">Sample Title</h2>
                            <p className="text-xs text-gray-500 dark:text-slate-400 sm:ml-auto">(In production this will be auto-filled from the audio sample)</p>
                        </div>
                        <input
                            ref={titleInputRef}
                            autoFocus
                            type="text"
                            value={data.path === 'tbc' ? '' : data.path}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => updateData('path', event.target.value)}
                            placeholder="e.g., Cool_Synth_Loop_01.wav"
                            className="w-full px-2 py-1 mt-2 text-sm border border-gray-300 rounded-lg dark:bg-slate-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
                        />

                        <hr className="my-6 border-gray-200 dark:border-slate-700" />

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

                    <div className="mt-4 md:mt-0 flex flex-col gap-3">
                        <div className="h-[17.82rem] md:h-[22.28rem] flex flex-col">
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-white mb-2">Live JSON Preview:</h3>
                            <div className="flex-1 min-h-0">
                                <JsonPreview />
                            </div>
                        </div>
                        <div className="h-[19.01rem] md:h-[23.76rem] flex flex-col border-t border-gray-200 dark:border-slate-700 pt-3">
                            <h3 className="text-[12px] font-semibold text-gray-500 dark:text-white mb-2">Human-Readable Summary:</h3>
                            <div className="flex-1 min-h-0">
                                <HumanReadablePreview />
                            </div>
                        </div>
                        <NLPhraseDisplay />
                    </div>
                </div>
            </div>
        </div>
    );
};
