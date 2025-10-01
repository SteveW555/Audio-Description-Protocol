import React, { useState } from 'react';
import { type ChangeEvent, useEffect, useMemo, useRef } from 'react';

import { StepType } from '../types/wizard';
import { useWizardNavigation } from '../hooks/useWizardNavigation';
import { useAIPhraseGeneration } from '../hooks/useAIPhraseGeneration';
import { useWizardStore } from '../context/WizardContext';
import { AskStep } from './AskStep';
import { FinalStep } from './FinalStep';
import { InstrumentationWizard } from './InstrumentationWizard';
import { GenreStep } from './GenreStep';
import { VocalsStep } from './VocalsStep';
import { JsonPreview } from './JsonPreview';
import { HumanReadablePreview } from './HumanReadablePreview';
import { NLPhraseDisplay } from './NLPhraseDisplay';
import { TextInputStep } from './TextInputStep';
import { ThemeToggleButton } from './ThemeToggleButton';
import { WizardStep } from './WizardStep';
import { generateRandomMET, generateRandomGenre, generateRandomInstrument, generateRandomVocals } from '../utils/randomMET';
import { generateCasualPhrase } from '../services/casualPhraseGenerator';
import { VOCABULARY } from '../constants/vocabulary';

export const WizardLayout = () => {
    // Initialize AI phrase generation hook
    useAIPhraseGeneration();
    const titleInputRef = useRef<HTMLInputElement>(null);
    const data = useWizardStore((state) => state.data);
    const updateData = useWizardStore((state) => state.updateData);
    const setAddTheory = useWizardStore((state) => state.setAddTheory);
    const setStep = useWizardStore((state) => state.setStep);
    const setInstrumentStep = useWizardStore((state) => state.setInstrumentStep);
    const setCurrentInstrumentIndex = useWizardStore((state) => state.setCurrentInstrumentIndex);
    const resetStore = useWizardStore((state) => state.reset);

    const { currentStepConfig, stepNumber, step, steps, goToNextStep, goToPreviousStep, isFinalStep } = useWizardNavigation();

    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [hasRandomized, setHasRandomized] = useState(false);
    const [casualPhrase, setCasualPhrase] = useState('');
    const [casualPhraseLoading, setCasualPhraseLoading] = useState(false);
    const [casualPhraseError, setCasualPhraseError] = useState<string | null>(null);

    const handleRandomizeAll = () => {
        setHasRandomized(true);
        // Randomize Genre
        const randomGenre = generateRandomGenre();
        updateData('semantic_description.genre.primary', randomGenre.primary);
        updateData('semantic_description.genre.primary_subgenres', randomGenre.subgenres);

        // Randomize MET
        const { mood, energy, texture } = generateRandomMET();
        updateData('semantic_description.attributes.mood', mood);
        updateData('semantic_description.attributes.energy', energy);
        updateData('semantic_description.attributes.texture', texture);

        // Randomize Instrumentation (add 1-2 random instruments)
        const instrumentCount = Math.random() > 0.5 ? 2 : 1;
        const instruments = Array.from({ length: instrumentCount }, () => generateRandomInstrument());
        updateData('semantic_description.instrumentation', instruments);

        // Randomize Vocals (50% chance)
        const vocals = generateRandomVocals();
        if (vocals) {
            updateData('semantic_description.vocals.presence', vocals.presence);
            updateData('semantic_description.vocals.gender', vocals.gender);
            updateData('semantic_description.vocals.style', vocals.style);
            updateData('semantic_description.vocals.descriptors', vocals.descriptors);
        } else {
            // Clear vocals if not generated
            updateData('semantic_description.vocals', undefined);
        }

        // Randomize Music Theory
        const randomBPM = Math.floor(Math.random() * (150 - 100 + 1)) + 100;
        const randomKey = VOCABULARY.key[Math.floor(Math.random() * VOCABULARY.key.length)];
        const randomScale = VOCABULARY.scale[Math.floor(Math.random() * VOCABULARY.scale.length)];
        updateData('theory.bpm', randomBPM.toString());
        updateData('theory.key', randomKey);
        updateData('theory.scale', randomScale);
        updateData('theory.chords', 'tbc');
    };

    const handleSaveJSON = () => {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.path || 'audio-description'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleGenerateCasualPhrase = async () => {
        setCasualPhraseLoading(true);
        setCasualPhraseError(null);

        try {
            console.log('🎵 Generating casual phrase with data:', data);
            const response = await generateCasualPhrase(data);
            console.log('✅ Casual phrase response:', response);
            console.log('📝 Casual phrase text:', response.casualPhrase);
            setCasualPhrase(response.casualPhrase);
        } catch (error: any) {
            console.error('❌ Error generating casual phrase:', error);
            setCasualPhraseError(error.message || 'Failed to generate casual phrase');
        } finally {
            setCasualPhraseLoading(false);
        }
    };

    useEffect(() => {
        if (step === 0 && titleInputRef.current) {
            titleInputRef.current.select();
        }
    }, [step]);

    const instrumentationIndex = useMemo(
        () => steps.findIndex((entry) => 'special' in entry && entry.special === StepType.INSTRUMENTATION),
        [steps]
    );

    const vocalsIndex = useMemo(
        () => steps.findIndex((entry) => 'special' in entry && entry.special === StepType.VOCALS),
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
            return <FinalStep onRestart={handleRestart} onBack={goToPreviousStep} />;
        }

        if ('special' in currentStepConfig) {
            switch (currentStepConfig.special) {
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
                                if (vocalsIndex >= 0) {
                                    setStep(vocalsIndex);
                                } else {
                                    goToNextStep();
                                }
                            }}
                            onRandom={() => {
                                setAddTheory(true);
                                // Randomize Music Theory
                                const randomBPM = Math.floor(Math.random() * (150 - 100 + 1)) + 100;
                                const randomKey = VOCABULARY.key[Math.floor(Math.random() * VOCABULARY.key.length)];
                                const randomScale = VOCABULARY.scale[Math.floor(Math.random() * VOCABULARY.scale.length)];
                                updateData('theory.bpm', randomBPM.toString());
                                updateData('theory.key', randomKey);
                                updateData('theory.scale', randomScale);
                                // Skip to vocals or next step
                                if (vocalsIndex >= 0) {
                                    setStep(vocalsIndex);
                                } else {
                                    goToNextStep();
                                }
                            }}
                        />
                    );
                case StepType.GENRE:
                    return (
                        <GenreStep
                            stepNumber={stepNumber}
                            title={currentStepConfig.title}
                            onNext={goToNextStep}
                        />
                    );
                case StepType.VOCALS:
                    return (
                        <VocalsStep
                            stepNumber={stepNumber}
                            title={currentStepConfig.title}
                            onNext={goToNextStep}
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
                    return <FinalStep onRestart={handleRestart} onBack={goToPreviousStep} />;
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
                            <p className="text-xs text-gray-500 dark:text-slate-400 sm:ml-auto">(Automatic AI tagging will be in the next phase of development once the description protocol is ratified. In production the title will be auto-filled from the audio sample)</p>
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

                {/* Tools Section */}
                <div className="mt-6">
                    <hr className="border-t border-gray-400/50 mb-4" />

                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur rounded-xl shadow-lg p-4">
                        <button
                            onClick={() => setIsToolsOpen(!isToolsOpen)}
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <svg
                                className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-90' : ''}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm font-semibold">Tools</span>
                        </button>

                        {isToolsOpen && (
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700 space-y-4">
                                {/* Randomize All and Save JSON */}
                                <div className="flex items-center gap-3 scale-[0.7] origin-left">
                                    <button
                                        onClick={handleRandomizeAll}
                                        className="px-4 py-1.5 text-sm font-semibold text-white bg-purple-600 rounded-lg shadow-sm hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        Randomize All
                                    </button>
                                    {hasRandomized && (
                                        <button
                                            onClick={handleSaveJSON}
                                            className="ml-5 px-4 py-1.5 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            Save JSON
                                        </button>
                                    )}
                                </div>

                                {/* Generate Random Casual Phrase Section */}
                                <div className="space-y-2">
                                    <div>
                                        <button
                                            onClick={handleGenerateCasualPhrase}
                                            disabled={casualPhraseLoading}
                                            className="px-4 py-1.5 text-sm font-semibold text-white bg-orange-600 rounded-lg shadow-sm hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed scale-[0.7] origin-left"
                                        >
                                            {casualPhraseLoading ? 'Generating...' : 'Generate Random Casual Phrase '}
                                        </button>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-[0.75px]">
                                            Creates a random, non-standardized, human-like phrase, to use for testing (may take a few seconds)
                                        </p>
                                    </div>

                                    {casualPhraseError && (
                                        <p className="text-xs text-red-600 dark:text-red-400">
                                            Error: {casualPhraseError}
                                        </p>
                                    )}

                                    {(casualPhrase || casualPhraseLoading) && (
                                        <div>
                                            <label
                                                htmlFor="casual-phrase-input"
                                                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Casual Response:
                                            </label>
                                            <textarea
                                                id="casual-phrase-input"
                                                value={casualPhrase}
                                                onChange={(e) => setCasualPhrase(e.target.value)}
                                                disabled={casualPhraseLoading}
                                                placeholder={casualPhraseLoading ? 'Generating casual phrase...' : 'Casual phrase will appear here'}
                                                className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                                rows={3}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
