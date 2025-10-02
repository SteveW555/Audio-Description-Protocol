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
import { generateCasualPhrase } from '../ai/casualPhraseGenerator';
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

    const [hasRandomized, setHasRandomized] = useState(false);
    const [casualPhrase, setCasualPhrase] = useState('');
    const [casualPhraseLoading, setCasualPhraseLoading] = useState(false);
    const [casualPhraseError, setCasualPhraseError] = useState<string | null>(null);
    const [standardizedPhrase, setStandardizedPhrase] = useState('');
    const [standardizedPhraseLoading, setStandardizedPhraseLoading] = useState(false);
    const [standardizedPhraseError, setStandardizedPhraseError] = useState<string | null>(null);

    // Model test states
    const [modelTestRunning, setModelTestRunning] = useState(false);
    const [modelTestResults, setModelTestResults] = useState<any>(null);

    // Poetic-Factual slider state (1-100, default 50)
    const [poeticLevel, setPoeticLevel] = useState(50);

    // Phrase translation states
    const [inputPhrase, setInputPhrase] = useState('');
    const [translatedPhrase, setTranslatedPhrase] = useState('');
    const [translating, setTranslating] = useState(false);
    const [translateError, setTranslateError] = useState<string | null>(null);

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
            console.log('🎵 Generating casual phrase with data:', data, 'poeticLevel:', poeticLevel);
            const response = await generateCasualPhrase(data, poeticLevel);
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

    const handleRunModelTest = async () => {
        setModelTestRunning(true);
        setModelTestResults(null);

        try {
            console.log('🧪 Starting model timing test...');
            const response = await fetch('/api/test-models', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    runsPerModel: 10,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Model test complete:', data);
            setModelTestResults(data.results);

            // Download results as JSON
            const jsonString = JSON.stringify(data.results, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `model-test-results-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert('Model test complete! Results downloaded as JSON. Check console for details.');
        } catch (error: any) {
            console.error('❌ Error running model test:', error);
            alert(`Failed to run model test: ${error.message}`);
        } finally {
            setModelTestRunning(false);
        }
    };

    const handleTranslatePhrase = async () => {
        if (!inputPhrase.trim()) {
            setTranslateError('Please enter a phrase to translate');
            return;
        }

        setTranslating(true);
        setTranslateError(null);
        setTranslatedPhrase('');

        try {
            // Call backend API to translate casual phrase to standardized vocabulary
            const response = await fetch('/api/translate-phrase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ casualPhrase: inputPhrase }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to translate phrase');
            }

            const result = await response.json();
            setTranslatedPhrase(result.standardizedPhrase);

            // Parse and populate wizard with terms from standardized phrase
            // This will be implemented next
            parseAndPopulateTerms(result.standardizedPhrase);
        } catch (error: any) {
            console.error('❌ Error translating phrase:', error);
            setTranslateError(error.message || 'Failed to translate phrase');
        } finally {
            setTranslating(false);
        }
    };

    const parseAndPopulateTerms = (standardizedPhrase: string) => {
        console.log('Parsing phrase:', standardizedPhrase);
        const lowerPhrase = standardizedPhrase.toLowerCase();

        // Extract Genre
        for (const genre of VOCABULARY.primary_genres) {
            if (lowerPhrase.includes(genre.toLowerCase())) {
                updateData('semantic_description.genre.primary', genre);
                console.log('Found genre:', genre);
                break;
            }
        }

        // Extract Mood
        const foundMoods: string[] = [];
        for (const mood of VOCABULARY.mood) {
            if (lowerPhrase.includes(mood.toLowerCase().replace(/_/g, ' ')) ||
                lowerPhrase.includes(mood.toLowerCase().replace(/_/g, '-'))) {
                foundMoods.push(mood);
            }
        }
        if (foundMoods.length > 0) {
            updateData('semantic_description.attributes.mood', foundMoods);
            console.log('Found moods:', foundMoods);
        }

        // Extract Energy
        const foundEnergy: string[] = [];
        for (const energy of VOCABULARY.energy) {
            if (lowerPhrase.includes(energy.toLowerCase().replace(/_/g, ' ')) ||
                lowerPhrase.includes(energy.toLowerCase().replace(/_/g, '-'))) {
                foundEnergy.push(energy);
            }
        }
        if (foundEnergy.length > 0) {
            updateData('semantic_description.attributes.energy', foundEnergy);
            console.log('Found energy:', foundEnergy);
        }

        // Extract Texture
        const foundTexture: string[] = [];
        for (const texture of VOCABULARY.texture) {
            if (lowerPhrase.includes(texture.toLowerCase().replace(/_/g, ' ')) ||
                lowerPhrase.includes(texture.toLowerCase().replace(/_/g, '-'))) {
                foundTexture.push(texture);
            }
        }
        if (foundTexture.length > 0) {
            updateData('semantic_description.attributes.texture', foundTexture);
            console.log('Found texture:', foundTexture);
        }

        // Extract Instruments with roles and descriptors
        const foundInstruments: any[] = [];
        for (const instrument of VOCABULARY.instrument) {
            const instrumentName = instrument.toLowerCase().replace(/_/g, ' ');
            if (lowerPhrase.includes(instrumentName)) {
                // Find the context around this instrument mention
                const instrumentIndex = lowerPhrase.indexOf(instrumentName);
                const contextStart = Math.max(0, instrumentIndex - 50);
                const contextEnd = Math.min(lowerPhrase.length, instrumentIndex + instrumentName.length + 100);
                const context = lowerPhrase.slice(contextStart, contextEnd);

                // Extract role
                let foundRole = 'tbc';
                const generalRoles = VOCABULARY.general_roles;
                const instrumentSpecificRoles = (VOCABULARY.instrument_roles as any)[instrument] || [];
                const allRoles = [...generalRoles, ...instrumentSpecificRoles];

                for (const role of allRoles) {
                    const rolePattern = role.toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ');
                    if (context.includes(rolePattern)) {
                        foundRole = role;
                        break;
                    }
                }

                // Extract descriptors
                const foundDescriptors: string[] = [];
                const generalDescriptors = VOCABULARY.general_descriptors;
                const instrumentSpecificDescriptors = (VOCABULARY.instrument_descriptors as any)[instrument] || [];
                const allDescriptors = [...generalDescriptors, ...instrumentSpecificDescriptors];

                for (const descriptor of allDescriptors) {
                    const descriptorPattern = descriptor.toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ');
                    if (context.includes(descriptorPattern)) {
                        foundDescriptors.push(descriptor);
                    }
                }

                foundInstruments.push({
                    instrument,
                    role: foundRole,
                    descriptors: foundDescriptors
                });
            }
        }
        if (foundInstruments.length > 0) {
            updateData('semantic_description.instrumentation', foundInstruments);
            console.log('Found instruments:', foundInstruments);
        }

        // Extract BPM (pattern: "120 bpm" or "at 120")
        const bpmMatch = lowerPhrase.match(/(\d{2,3})\s*bpm|at\s*(\d{2,3})/);
        if (bpmMatch) {
            const bpm = bpmMatch[1] || bpmMatch[2];
            updateData('theory.bpm', bpm);
            console.log('Found BPM:', bpm);
        }

        // Extract Key
        const keyMatch = lowerPhrase.match(/\bin\s+([a-g][#b]?)\s+(major|minor)/i);
        if (keyMatch) {
            const key = keyMatch[1].toUpperCase().replace('B', '#');
            const scale = keyMatch[2].toLowerCase();

            // Validate key is in vocabulary
            if (VOCABULARY.key.includes(key as any)) {
                updateData('theory.key', key);
                console.log('Found key:', key);
            }

            // Validate scale is in vocabulary
            if (VOCABULARY.scale.includes(scale as any)) {
                updateData('theory.scale', scale);
                console.log('Found scale:', scale);
            }
        }
    };

    const handleGenerateStandardizedPhrase = () => {
        setStandardizedPhraseLoading(true);
        setStandardizedPhraseError(null);

        try {
            // Generate standardized phrase from current data
            const parts: string[] = [];

            // Add genre if present
            if (data.semantic_description?.genre?.primary && data.semantic_description.genre.primary !== 'tbc') {
                parts.push(data.semantic_description.genre.primary);
                if (data.semantic_description.genre.primary_subgenres && data.semantic_description.genre.primary_subgenres.length > 0) {
                    parts.push(`(${data.semantic_description.genre.primary_subgenres.join(', ')})`);
                }
            }

            // Add mood, energy, texture
            const attributes = data.semantic_description?.attributes;
            if (attributes?.mood && attributes.mood.length > 0) {
                const validMood = attributes.mood.filter(m => m !== 'tbc');
                if (validMood.length > 0) {
                    parts.push(`${validMood.join(', ')} mood`);
                }
            }
            if (attributes?.energy && attributes.energy.length > 0) {
                const validEnergy = attributes.energy.filter(e => e !== 'tbc');
                if (validEnergy.length > 0) {
                    parts.push(`${validEnergy.join(', ')} energy`);
                }
            }
            if (attributes?.texture && attributes.texture.length > 0) {
                const validTexture = attributes.texture.filter(t => t !== 'tbc');
                if (validTexture.length > 0) {
                    parts.push(`${validTexture.join(', ')} texture`);
                }
            }

            // Add instrumentation
            const instruments = data.semantic_description?.instrumentation;
            if (instruments && instruments.length > 0) {
                const validInstruments = instruments.filter(i => i.instrument && i.instrument !== 'tbc');
                if (validInstruments.length > 0) {
                    const instrumentNames = validInstruments.map(i => i.instrument);
                    parts.push(`featuring ${instrumentNames.join(', ')}`);
                }
            }

            // Add vocals
            const vocals = data.semantic_description?.vocals;
            if (vocals?.presence && vocals.presence !== 'none' && vocals.presence) {
                const vocalParts = [vocals.presence, 'vocals'];
                if (vocals.gender && vocals.gender !== null) {
                    vocalParts.splice(1, 0, vocals.gender);
                }
                if (vocals.style && vocals.style !== null) {
                    vocalParts.push(`(${vocals.style})`);
                }
                parts.push(`with ${vocalParts.join(' ')}`);
            }

            // Add music theory
            const theory = data.theory;
            if (theory?.bpm && theory.bpm !== 'tbc') {
                parts.push(`at ${theory.bpm} BPM`);
            }
            if (theory?.key && theory.key !== 'tbc' && theory?.scale && theory.scale !== 'tbc') {
                parts.push(`in ${theory.key} ${theory.scale}`);
            }

            const phrase = parts.length > 0 ? parts.join(', ') : 'No data available to generate standardized phrase';
            setStandardizedPhrase(phrase);
        } catch (error: any) {
            console.error('❌ Error generating standardized phrase:', error);
            setStandardizedPhraseError(error.message || 'Failed to generate standardized phrase');
        } finally {
            setStandardizedPhraseLoading(false);
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

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_0.7fr)_minmax(0,_0.3fr)] gap-6">
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur rounded-xl shadow-lg px-4 pb-4 pt-2 md:px-5 md:pb-5 md:pt-3">
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
                        <div className="h-[14.26rem] md:h-[17.82rem] flex flex-col">
                            <h3 className="text-xs font-semibold text-gray-500 dark:text-white mb-2">Live JSON Preview:</h3>
                            <div className="flex-1 min-h-0">
                                <JsonPreview />
                            </div>
                        </div>
                        <div className="h-[22.81rem] md:h-[28.51rem] flex flex-col border-t border-gray-200 dark:border-slate-700 pt-3">
                            <h3 className="text-[12px] font-semibold text-gray-500 dark:text-white mb-2">Human-Readable Summary:</h3>
                            <div className="flex-1 min-h-0">
                                <HumanReadablePreview />
                            </div>
                        </div>
                        <NLPhraseDisplay />
                    </div>
                </div>

                {/* Dev Tools Section */}
                <div className="mt-6">
                    <hr className="border-t border-gray-400/50 mb-4" />

                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur rounded-xl shadow-lg p-4">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Dev Tools</h2>

                        <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700 space-y-4">
                                {/* Randomize All and Save JSON */}
                                <div className="flex items-center gap-3 scale-[0.7] origin-left">
                                    <button
                                        onClick={handleRandomizeAll}
                                        title="Automatically fills all wizard fields with random values from the vocabulary, including genre, mood, energy, texture, instruments, vocals, and music theory (BPM, key, scale)"
                                        className="px-4 py-1.5 text-sm font-semibold text-white bg-purple-600 rounded-lg shadow-sm hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        Randomize All Above
                                    </button>
                                    <button
                                        onClick={handleRunModelTest}
                                        disabled={modelTestRunning}
                                        title="Runs performance test on all Groq models (10 requests each) and downloads results as JSON. This will take several minutes."
                                        className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {modelTestRunning ? 'Testing Models...' : 'Test All Models'}
                                    </button>

                                    {/* Poetic-Factual Slider */}
                                    <div className="flex items-center gap-2 ml-4">
                                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            Poetic
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={poeticLevel}
                                            onChange={(e) => setPoeticLevel(Number(e.target.value))}
                                            className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                            title={`Style level: ${poeticLevel} (1=Very Poetic, 100=Very Factual)`}
                                        />
                                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                            Factual
                                        </label>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 w-8">
                                            {poeticLevel}
                                        </span>
                                    </div>

                                    {hasRandomized && (
                                        <button
                                            onClick={handleSaveJSON}
                                            title="Downloads the current wizard data as a JSON file that can be saved locally or shared with others"
                                            className="ml-5 px-4 py-1.5 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            Save JSON
                                        </button>
                                    )}
                                </div>

                                {/* Generate Random Casual Phrase Section */}
                                <div className="space-y-2 pt-4 border-t border-gray-400/80 dark:border-slate-600/80">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <button
                                                onClick={handleGenerateCasualPhrase}
                                                disabled={casualPhraseLoading}
                                                title="Uses AI to generate a random, non-standardized, human-like musical description for testing the phrase translation feature"
                                                className="px-4 py-1.5 text-sm font-semibold text-white bg-orange-600 rounded-lg shadow-sm hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed scale-[0.7] origin-left"
                                            >
                                                {casualPhraseLoading ? 'Generating...' : 'Generate Random Casual Phrase '}
                                            </button>
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-[0.75px]">
                                                Creates a random, non-standardized, human-like phrase, to use for testing (may take a few seconds)
                                            </p>
                                        </div>

                                        {/* Poetic-Factual Slider (duplicate for casual phrase) */}
                                        <div className="flex items-center gap-2 scale-[0.7] origin-left">
                                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                                Poetic
                                            </label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                value={poeticLevel}
                                                onChange={(e) => setPoeticLevel(Number(e.target.value))}
                                                className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                                title={`Style level: ${poeticLevel} (1=Very Poetic, 100=Very Factual)`}
                                            />
                                            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                                Factual
                                            </label>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 w-8">
                                                {poeticLevel}
                                            </span>
                                        </div>
                                    </div>

                                    {casualPhraseError && (
                                        <p className="text-xs text-red-600 dark:text-red-400">
                                            Error: {casualPhraseError}
                                        </p>
                                    )}

                                    {(casualPhrase || casualPhraseLoading) && (
                                        <div className="flex gap-2 items-start">
                                            <div className="flex-[0.9]">
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
                                                    className="w-full px-3 py-2 text-[11px] border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                                    rows={2}
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setInputPhrase(casualPhrase);
                                                    handleTranslatePhrase();
                                                }}
                                                disabled={!casualPhrase || casualPhraseLoading}
                                                title="Copies the casual phrase from above and uses it as input for the phrase translation tool below, then translates it to standardized vocabulary"
                                                className="mt-7 px-4 py-1.5 text-sm font-semibold text-white bg-purple-600 rounded-lg shadow-sm hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap scale-[0.7] origin-top"
                                            >
                                                Translate Below
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Generate Random Standardized Phrase Section */}
                                <div className="space-y-2 pt-4 border-t border-gray-400/80 dark:border-slate-600/80">
                                    <div>
                                        <button
                                            onClick={handleGenerateStandardizedPhrase}
                                            disabled={standardizedPhraseLoading}
                                            title="Generates a phrase using the protocol's standardized vocabulary based on the current wizard data selections"
                                            className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed scale-[0.7] origin-left"
                                        >
                                            {standardizedPhraseLoading ? 'Generating...' : 'Generate Random Standardized Phrase'}
                                        </button>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-[0.75px]">
                                            Generates a random phrase using the standardized structure of this protocol
                                        </p>
                                    </div>

                                    {standardizedPhraseError && (
                                        <p className="text-xs text-red-600 dark:text-red-400">
                                            Error: {standardizedPhraseError}
                                        </p>
                                    )}

                                    {(standardizedPhrase || standardizedPhraseLoading) && (
                                        <div>
                                            <label
                                                htmlFor="standardized-phrase-input"
                                                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Standardized Response:
                                            </label>
                                            <textarea
                                                id="standardized-phrase-input"
                                                value={standardizedPhrase}
                                                onChange={(e) => setStandardizedPhrase(e.target.value)}
                                                disabled={standardizedPhraseLoading}
                                                placeholder={standardizedPhraseLoading ? 'Generating standardized phrase...' : 'Standardized phrase will appear here'}
                                                className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                                                rows={3}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Phrase Translation Section */}
                                <div className="space-y-2 pt-4 border-t border-gray-400/80 dark:border-slate-600/80">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="input-phrase"
                                            className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
                                        >
                                            Phrase Translation:
                                        </label>
                                        <div className="flex gap-2">
                                            <textarea
                                                id="input-phrase"
                                                value={inputPhrase}
                                                onChange={(e) => setInputPhrase(e.target.value)}
                                                placeholder="Enter any musical description"
                                                className="flex-1 px-3 py-2 text-xs border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 resize-none"
                                                rows={3}
                                            />
                                            <button
                                                onClick={handleTranslatePhrase}
                                                disabled={translating || !inputPhrase.trim()}
                                                title="Converts casual musical descriptions into standardized vocabulary using AI, then automatically populates the wizard fields with the extracted terms"
                                                className="px-4 py-1.5 h-fit text-sm font-semibold text-white bg-purple-600 rounded-lg shadow-sm hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed scale-[0.7] origin-top"
                                            >
                                                {translating ? 'Translating...' : 'Translate'}
                                            </button>
                                            <textarea
                                                value={translatedPhrase}
                                                readOnly
                                                placeholder="Standardized phrase will appear here"
                                                className="flex-1 px-3 py-2 text-xs border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                                                rows={3}
                                            />
                                        </div>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                            Converts casual musical descriptions into standardized vocabulary and populates the wizard
                                        </p>
                                        {translateError && (
                                            <p className="text-xs text-red-600 dark:text-red-400">
                                                Error: {translateError}
                                            </p>
                                        )}
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
