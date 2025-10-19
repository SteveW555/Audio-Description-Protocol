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
import { buildApiUrl } from '../config/api';
import { VOCABULARY } from '../constants/vocabulary';
import { RANDOM_BUTTON_COLORS, LAYOUT_HEIGHTS } from '../constants/uiConstants';
import { usageTracker } from '../services/usageTracking';
import {
    extractRandomizeAllData,
    extractModelTestData,
    extractCasualPhraseData,
    extractTranslatePhraseData,
    extractStandardizedPhraseData,
    extractSaveJsonData
} from '../services/usageDataExtractors';

export const WizardLayout = () => {
    // Initialize AI phrase generation hook
    useAIPhraseGeneration();
    const titleInputRef = useRef<HTMLInputElement>(null);
    const isManuallyGeneratingRef = useRef(false);
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
    const [casualPhraseAttempted, setCasualPhraseAttempted] = useState(false);
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

    // Phrase from structure states
    const [structurePhrase, setStructurePhrase] = useState('');
    const [structurePhraseLoading, setStructurePhraseLoading] = useState(false);
    const [structurePhraseError, setStructurePhraseError] = useState<string | null>(null);
    const [structurePhraseAttempted, setStructurePhraseAttempted] = useState(false);

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

        // Track usage after completion
        usageTracker.track(extractRandomizeAllData(data));

        // Navigate to final step
        const finalStepIndex = steps.length; // Final step is after all configured steps
        setStep(finalStepIndex);
    };

    const handleSaveJSON = () => {
        const filename = `${data.path || 'audio-description'}.json`;
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Track usage after completion
        usageTracker.track(extractSaveJsonData(data, filename));
    };

    const handleGenerateCasualPhrase = async () => {
        setCasualPhraseLoading(true);
        setCasualPhraseError(null);
        setCasualPhraseAttempted(true);
        let generatedPhrase = '';

        try {
            console.log('🎵 Generating casual phrase with data:', data, 'poeticLevel:', poeticLevel);
            const response = await generateCasualPhrase(data, poeticLevel);
            console.log('✅ Casual phrase response:', response);
            console.log('📝 Casual phrase text:', response.casualPhrase);
            generatedPhrase = response.casualPhrase;
            setCasualPhrase(generatedPhrase);
        } catch (error: any) {
            console.error('❌ Error generating casual phrase:', error);
            setCasualPhraseError(error.message || 'Failed to generate casual phrase');
        } finally {
            setCasualPhraseLoading(false);
            // Track usage after completion (success or error)
            if (generatedPhrase) {
                usageTracker.track(extractCasualPhraseData(generatedPhrase, poeticLevel));
            }
        }
    };

    const handleRunModelTest = async () => {
        setModelTestRunning(true);
        setModelTestResults(null);
        let results: any = null;

        try {
            console.log('🧪 Starting model timing test...');
            const response = await fetch(buildApiUrl('/api/test-models'), {
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
            results = data.results;
            setModelTestResults(results);

            // Download results as JSON
            const jsonString = JSON.stringify(results, null, 2);
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
            // Track usage after completion (success or error)
            if (results) {
                usageTracker.track(extractModelTestData(results));
            }
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
        let standardized = '';

        try {
            // Call backend API to translate casual phrase to standardized vocabulary
            const response = await fetch(buildApiUrl('/api/translate-phrase'), {
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
            standardized = result.standardizedPhrase;
            setTranslatedPhrase(standardized);

            // Also set the structure phrase for display on final page
            setStructurePhrase(standardized);

            // Set the original input phrase as the casual phrase for display on final page
            setCasualPhrase(inputPhrase);

            // Parse and populate wizard with terms from standardized phrase
            console.log('🎯 About to parse and populate terms...');
            parseAndPopulateTerms(standardized);
            console.log('✅ Parsing complete!');

            // After parsing, estimate BPM based on the structured data
            console.log('🎵 Estimating BPM...');
            await estimateBpm(inputPhrase, standardized);
            console.log('✅ BPM estimation complete!');
        } catch (error: any) {
            console.error('❌ Error translating phrase:', error);
            setTranslateError(error.message || 'Failed to translate phrase');
        } finally {
            setTranslating(false);
            // Track usage after completion (success or error)
            if (standardized) {
                usageTracker.track(extractTranslatePhraseData(inputPhrase, standardized, data));
            }
        }
    };

    const estimateBpm = async (inputPhrase: string, standardizedPhrase: string) => {
        try {
            const response = await fetch(buildApiUrl('/api/estimate-bpm'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputPhrase,
                    standardizedPhrase,
                    genre: data.semantic_description.genre.primary,
                    subgenres: data.semantic_description.genre.primary_subgenres,
                    mood: data.semantic_description.attributes.mood,
                    energy: data.semantic_description.attributes.energy,
                    texture: data.semantic_description.attributes.texture,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to estimate BPM');
            }

            const result = await response.json();
            console.log('🎵 BPM estimated:', result.bpm);

            // Update the BPM in the data structure
            updateData('theory.bpm', result.bpm);
        } catch (error: any) {
            console.error('❌ Error estimating BPM:', error);
            // Don't throw - BPM estimation is optional, don't block the translation flow
        }
    };

    const parseAndPopulateTerms = (standardizedPhrase: string) => {
        console.log('🔍 === Starting parseAndPopulateTerms ===');
        console.log('🔍 Input phrase:', standardizedPhrase);
        console.log('📊 Current genre before:', data.semantic_description.genre);
        const lowerPhrase = standardizedPhrase.toLowerCase();

        // Extract Genre - First try to find exact primary genre match
        let foundPrimaryGenre: string | null = null;
        for (const genre of VOCABULARY.primary_genres) {
            if (lowerPhrase.includes(genre.toLowerCase())) {
                foundPrimaryGenre = genre;
                console.log('✅ Found primary genre directly:', genre);
                updateData('semantic_description.genre.primary', genre);
                break;
            }
        }

        // If no primary genre found, try to infer from subgenres
        if (!foundPrimaryGenre) {
            console.log('🔎 No primary genre found, checking subgenres...');
            // Check all subgenres across all primary genres
            for (const [genreKey, subgenreList] of Object.entries(VOCABULARY.secondary_genres)) {
                for (const subgenre of subgenreList) {
                    const subgenrePattern = subgenre.toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ');
                    if (lowerPhrase.includes(subgenrePattern)) {
                        // Found a subgenre match! Infer the primary genre
                        // Map the genreKey back to the display name
                        const genreMapping: Record<string, string> = {
                            'electronic': 'Electronic',
                            'dance': 'Dance',
                            'rock': 'Rock',
                            'pop': 'Pop',
                            'hip_hop': 'Hip-Hop',
                            'rnb_soul': 'R&B / Soul',
                            'jazz': 'Jazz',
                            'blues': 'Blues',
                            'country': 'Country',
                            'classical': 'Classical',
                            'folk': 'Folk',
                            'latin': 'Latin',
                            'reggae': 'Reggae',
                            'world': 'World',
                            'soundtrack': 'Soundtrack',
                            'ambient': 'Ambient',
                            'spoken_word': 'Spoken Word',
                            'sound_effect': 'Sound Effect',
                        };
                        foundPrimaryGenre = genreMapping[genreKey] || null;
                        if (foundPrimaryGenre) {
                            console.log('✅ Inferred primary genre from subgenre:', foundPrimaryGenre, 'from', subgenre);
                            updateData('semantic_description.genre.primary', foundPrimaryGenre);
                            break;
                        }
                    }
                }
                if (foundPrimaryGenre) break;
            }
        }

        // Extract Subgenres (if primary genre was found or inferred)
        if (foundPrimaryGenre) {
            const genreKey = foundPrimaryGenre.toLowerCase().replace(/\s*\/\s*/g, '_').replace(/\s+/g, '_').replace(/-/g, '_');
            const subgenreList = (VOCABULARY.secondary_genres as any)[genreKey] || [];
            const foundSubgenres: string[] = [];

            for (const subgenre of subgenreList) {
                const subgenrePattern = subgenre.toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ');
                if (lowerPhrase.includes(subgenrePattern)) {
                    foundSubgenres.push(subgenre);
                }
            }

            if (foundSubgenres.length > 0) {
                updateData('semantic_description.genre.primary_subgenres', foundSubgenres);
                console.log('✅ Found subgenres:', foundSubgenres);
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

        // Extract Vocals (handle separately from instruments)
        if (lowerPhrase.includes('vocal')) {
            const vocalContext = lowerPhrase;

            // Detect presence
            let presence = 'lead';
            if (vocalContext.includes('backing')) presence = 'backing';
            else if (vocalContext.includes('choir')) presence = 'choir';
            else if (vocalContext.includes('sampled')) presence = 'sampled';
            else if (vocalContext.includes('spoken word')) presence = 'spoken_word';
            else if (vocalContext.includes('ad-lib') || vocalContext.includes('ad lib')) presence = 'ad-libs';

            // Detect gender
            let gender = null;
            if (vocalContext.includes('female')) gender = 'female';
            else if (vocalContext.includes('male')) gender = 'male';
            else if (vocalContext.includes('mixed')) gender = 'mixed';
            else if (vocalContext.includes('androgynous')) gender = 'androgynous';

            // Detect style
            let style = 'singing';
            if (vocalContext.includes('rapping')) style = 'rapping';
            else if (vocalContext.includes('screaming')) style = 'screaming';
            else if (vocalContext.includes('growling')) style = 'growling';
            else if (vocalContext.includes('falsetto')) style = 'falsetto';
            else if (vocalContext.includes('whispering')) style = 'whispering';
            else if (vocalContext.includes('operatic')) style = 'operatic';

            // Detect descriptors
            const vocalDescriptors: string[] = [];
            const possibleDescriptors = ['breathy', 'powerful', 'operatic', 'raspy', 'autotuned', 'harmonized', 'ethereal', 'wordless', 'clear', 'rhythmic', 'soulful'];
            for (const desc of possibleDescriptors) {
                if (vocalContext.includes(desc)) {
                    vocalDescriptors.push(desc);
                }
            }

            updateData('semantic_description.vocals', {
                presence,
                gender,
                style,
                descriptors: vocalDescriptors
            });
            console.log('✅ Found vocals:', { presence, gender, style, descriptors: vocalDescriptors });
        }

        // Extract Instruments with roles and descriptors (skip 'vocals' as it's handled above)
        const foundInstruments: any[] = [];
        for (const instrument of VOCABULARY.instrument) {
            // Skip vocals - we handle it separately
            if (instrument === 'vocals') continue;

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

        console.log('✅ === Parsing complete ===');
        console.log('📊 Summary of extracted terms:');
        console.log('  - Genre:', foundPrimaryGenre || 'none');
        console.log('  - Moods:', foundMoods.length, foundMoods);
        console.log('  - Energy:', foundEnergy.length, foundEnergy);
        console.log('  - Texture:', foundTexture.length, foundTexture);
        console.log('  - Instruments:', foundInstruments.length);
    };

    const handleGenerateStandardizedPhrase = () => {
        setStandardizedPhraseLoading(true);
        setStandardizedPhraseError(null);
        let generatedPhrase = '';

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

            generatedPhrase = parts.length > 0 ? parts.join(', ') : 'No data available to generate standardized phrase';
            setStandardizedPhrase(generatedPhrase);
        } catch (error: any) {
            console.error('❌ Error generating standardized phrase:', error);
            setStandardizedPhraseError(error.message || 'Failed to generate standardized phrase');
        } finally {
            setStandardizedPhraseLoading(false);
            // Track usage after completion (success or error)
            if (generatedPhrase) {
                usageTracker.track(extractStandardizedPhraseData(generatedPhrase, data));
            }
        }
    };

    const handleGeneratePhraseFromStructure = async () => {
        setStructurePhraseLoading(true);
        setStructurePhraseError(null);
        setStructurePhraseAttempted(true);

        try {
            console.log('🎵 Generating phrase from structure with data:', data);
            const response = await fetch(buildApiUrl('/api/generate-phrase-from-structure'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wizardData: data.semantic_description,
                    sessionId: sessionStorage.getItem('audio-protocol-session-id') || 'default',
                    requestId: crypto.randomUUID(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.details
                    ? `${errorData.error}: ${errorData.details}`
                    : (errorData.error || 'Failed to generate phrase from structure');
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('✅ Phrase from structure response:', result);
            console.log('📝 Phrase from structure text:', result.phrase);
            setStructurePhrase(result.phrase);
        } catch (error: any) {
            console.error('❌ Error generating phrase from structure:', error);
            setStructurePhraseError(error.message || 'Failed to generate phrase from structure');
        } finally{
            setStructurePhraseLoading(false);
        }
    };

    const handleReRandomizeAll = async () => {
        console.log('🔵 [RE-RANDOMIZE] Button clicked - Starting handleReRandomizeAll');

        // Set flag to prevent useEffect auto-generation from interfering
        isManuallyGeneratingRef.current = true;
        console.log('🔵 [RE-RANDOMIZE] Set isManuallyGeneratingRef.current = true');

        // Reset attempt flags since this is a manual action
        setStructurePhraseAttempted(false);
        setCasualPhraseAttempted(false);

        // Randomize all wizard terms WITHOUT navigating (inline version of handleRandomizeAll)
        setHasRandomized(true);
        console.log('🔵 [RE-RANDOMIZE] Set hasRandomized = true');

        // Randomize Genre
        console.log('🔵 [RE-RANDOMIZE] Randomizing Genre...');
        const randomGenre = generateRandomGenre();
        updateData('semantic_description.genre.primary', randomGenre.primary);
        updateData('semantic_description.genre.primary_subgenres', randomGenre.subgenres);
        console.log('🔵 [RE-RANDOMIZE] Genre randomized:', randomGenre);

        // Randomize MET
        console.log('🔵 [RE-RANDOMIZE] Randomizing MET...');
        const { mood, energy, texture } = generateRandomMET();
        updateData('semantic_description.attributes.mood', mood);
        updateData('semantic_description.attributes.energy', energy);
        updateData('semantic_description.attributes.texture', texture);
        console.log('🔵 [RE-RANDOMIZE] MET randomized:', { mood, energy, texture });

        // Randomize Instrumentation (add 1-2 random instruments)
        console.log('🔵 [RE-RANDOMIZE] Randomizing Instrumentation...');
        const instrumentCount = Math.random() > 0.5 ? 2 : 1;
        const instruments = Array.from({ length: instrumentCount }, () => generateRandomInstrument());
        updateData('semantic_description.instrumentation', instruments);
        console.log('🔵 [RE-RANDOMIZE] Instrumentation randomized:', instruments);

        // Randomize Vocals (50% chance)
        console.log('🔵 [RE-RANDOMIZE] Randomizing Vocals...');
        const vocals = generateRandomVocals();
        if (vocals) {
            updateData('semantic_description.vocals.presence', vocals.presence);
            updateData('semantic_description.vocals.gender', vocals.gender);
            updateData('semantic_description.vocals.style', vocals.style);
            updateData('semantic_description.vocals.descriptors', vocals.descriptors);
            console.log('🔵 [RE-RANDOMIZE] Vocals randomized:', vocals);
        } else {
            // Clear vocals if not generated
            updateData('semantic_description.vocals', undefined);
            console.log('🔵 [RE-RANDOMIZE] Vocals cleared (50% chance)');
        }

        // Randomize Music Theory
        console.log('🔵 [RE-RANDOMIZE] Randomizing Music Theory...');
        const randomBPM = Math.floor(Math.random() * (150 - 100 + 1)) + 100;
        const randomKey = VOCABULARY.key[Math.floor(Math.random() * VOCABULARY.key.length)];
        const randomScale = VOCABULARY.scale[Math.floor(Math.random() * VOCABULARY.scale.length)];
        updateData('theory.bpm', randomBPM.toString());
        updateData('theory.key', randomKey);
        updateData('theory.scale', randomScale);
        updateData('theory.chords', 'tbc');
        console.log('🔵 [RE-RANDOMIZE] Music Theory randomized:', { bpm: randomBPM, key: randomKey, scale: randomScale });

        // Build fresh data object from the randomized values we just created
        console.log('🔵 [RE-RANDOMIZE] Building fresh data object from randomized values...');
        const freshData = {
            ...data,
            semantic_description: {
                ...data.semantic_description,
                genre: {
                    primary: randomGenre.primary,
                    primary_subgenres: randomGenre.subgenres
                },
                attributes: {
                    mood,
                    energy,
                    texture
                },
                instrumentation: instruments,
                vocals: vocals || undefined
            },
            theory: {
                bpm: randomBPM.toString(),
                key: randomKey,
                scale: randomScale,
                chords: 'tbc'
            }
        };
        console.log('🔵 [RE-RANDOMIZE] Fresh data built:', JSON.stringify(freshData.semantic_description, null, 2));

        // Track usage
        console.log('🔵 [RE-RANDOMIZE] Tracking usage...');
        usageTracker.track(extractRandomizeAllData(freshData));
        console.log('🔵 [RE-RANDOMIZE] Usage tracked');

        // Generate structure phrase with fresh data
        console.log('🔵 [RE-RANDOMIZE] Setting structurePhraseLoading = true');
        setStructurePhraseLoading(true);
        setStructurePhraseError(null);
        console.log('🔵 [RE-RANDOMIZE] About to generate structure phrase with fresh data');

        try {
            console.log('🔵 [RE-RANDOMIZE] 🎵 Generating phrase from structure with FRESH data:', freshData);
            console.log('🔵 [RE-RANDOMIZE] Calling fetch to /api/generate-phrase-from-structure...');
            const response = await fetch(buildApiUrl('/api/generate-phrase-from-structure'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wizardData: freshData.semantic_description,
                    sessionId: sessionStorage.getItem('audio-protocol-session-id') || 'default',
                    requestId: crypto.randomUUID(),
                }),
            });
            console.log('🔵 [RE-RANDOMIZE] Fetch completed, response status:', response.status);

            if (!response.ok) {
                console.log('🔵 [RE-RANDOMIZE] Response NOT OK, parsing error...');
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate phrase from structure');
            }

            console.log('🔵 [RE-RANDOMIZE] Response OK, parsing result...');
            const result = await response.json();
            console.log('🔵 [RE-RANDOMIZE] ✅ Phrase from structure response:', result);
            console.log('🔵 [RE-RANDOMIZE] About to call setStructurePhrase with:', result.phrase);
            setStructurePhrase(result.phrase);
            console.log('🔵 [RE-RANDOMIZE] setStructurePhrase called successfully');
        } catch (error: any) {
            console.error('🔵 [RE-RANDOMIZE] ❌ Error generating phrase from structure:', error);
            setStructurePhraseError(error.message || 'Failed to generate phrase from structure');
        } finally {
            console.log('🔵 [RE-RANDOMIZE] Setting structurePhraseLoading = false');
            setStructurePhraseLoading(false);
            console.log('🔵 [RE-RANDOMIZE] structurePhraseLoading set to false');
        }

        // Then generate casual phrase with fresh data
        console.log('🔵 [RE-RANDOMIZE] Now generating casual phrase...');
        setCasualPhraseLoading(true);
        setCasualPhraseError(null);

        try {
            console.log('🔵 [RE-RANDOMIZE] 🎵 Generating casual phrase with FRESH data:', freshData, 'poeticLevel:', poeticLevel);
            const response = await generateCasualPhrase(freshData, poeticLevel);
            console.log('🔵 [RE-RANDOMIZE] ✅ Casual phrase response:', response);
            setCasualPhrase(response.casualPhrase);
            console.log('🔵 [RE-RANDOMIZE] setCasualPhrase called successfully');
            usageTracker.track(extractCasualPhraseData(response.casualPhrase, poeticLevel));
        } catch (error: any) {
            console.error('🔵 [RE-RANDOMIZE] ❌ Error generating casual phrase:', error);
            setCasualPhraseError(error.message || 'Failed to generate casual phrase');
        } finally {
            console.log('🔵 [RE-RANDOMIZE] Setting casualPhraseLoading = false');
            setCasualPhraseLoading(false);
            // Clear flag now that manual generation is complete
            console.log('🔵 [RE-RANDOMIZE] Clearing isManuallyGeneratingRef flag');
            isManuallyGeneratingRef.current = false;
            console.log('🔵 [RE-RANDOMIZE] ✅ handleReRandomizeAll COMPLETE');
        }
    };

    useEffect(() => {
        if (step === 0 && titleInputRef.current) {
            titleInputRef.current.select();
        }
    }, [step]);

    // Auto-generate phrases when reaching the final step
    useEffect(() => {
        console.log('🟡 [USEEFFECT] Auto-generate useEffect fired');
        console.log('🟡 [USEEFFECT] isManuallyGeneratingRef.current:', isManuallyGeneratingRef.current);
        console.log('🟡 [USEEFFECT] isFinalStep:', isFinalStep);
        console.log('🟡 [USEEFFECT] structurePhraseLoading:', structurePhraseLoading);
        console.log('🟡 [USEEFFECT] structurePhrase:', structurePhrase);
        console.log('🟡 [USEEFFECT] structurePhraseAttempted:', structurePhraseAttempted);
        console.log('🟡 [USEEFFECT] casualPhraseLoading:', casualPhraseLoading);
        console.log('🟡 [USEEFFECT] casualPhrase:', casualPhrase);
        console.log('🟡 [USEEFFECT] casualPhraseAttempted:', casualPhraseAttempted);

        // Skip auto-generation if we're manually generating (e.g., from Re-Randomize button)
        if (isManuallyGeneratingRef.current) {
            console.log('🟡 [USEEFFECT] SKIPPING - isManuallyGeneratingRef.current is true');
            return;
        }

        if (isFinalStep) {
            console.log('🟡 [USEEFFECT] isFinalStep is true, checking conditions...');
            // Only attempt once per session - prevent infinite retries if backend is down
            if (!structurePhraseLoading && !structurePhrase && !structurePhraseAttempted) {
                console.log('🟡 [USEEFFECT] ⚠️  Calling handleGeneratePhraseFromStructure() with STALE data');
                handleGeneratePhraseFromStructure();
            } else {
                console.log('🟡 [USEEFFECT] NOT calling handleGeneratePhraseFromStructure (loading, phrase exists, or already attempted)');
            }
            if (!casualPhraseLoading && !casualPhrase && !casualPhraseAttempted) {
                console.log('🟡 [USEEFFECT] ⚠️  Calling handleGenerateCasualPhrase() with STALE data');
                handleGenerateCasualPhrase();
            } else {
                console.log('🟡 [USEEFFECT] NOT calling handleGenerateCasualPhrase (loading, phrase exists, or already attempted)');
            }
        } else {
            console.log('🟡 [USEEFFECT] NOT on final step, doing nothing');
        }
    }, [isFinalStep, structurePhraseLoading, casualPhraseLoading, structurePhrase, casualPhrase, structurePhraseAttempted, casualPhraseAttempted]);

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
        // Reset attempt flags so auto-generation works on next final step
        setStructurePhraseAttempted(false);
        setCasualPhraseAttempted(false);
        setStructurePhrase('');
        setCasualPhrase('');
        setStructurePhraseError(null);
        setCasualPhraseError(null);
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    };

    const renderStep = () => {
        if (!currentStepConfig) {
            return (
                <FinalStep
                    onRestart={handleRestart}
                    onBack={goToPreviousStep}
                    structurePhrase={structurePhrase}
                    structurePhraseLoading={structurePhraseLoading}
                    structurePhraseError={structurePhraseError}
                    casualPhrase={casualPhrase}
                    casualPhraseLoading={casualPhraseLoading}
                    casualPhraseError={casualPhraseError}
                    onRegenerateCasualPhrase={() => {
                        setCasualPhraseAttempted(false);
                        handleGenerateCasualPhrase();
                    }}
                    onReRandomizeAll={handleReRandomizeAll}
                />
            );
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
                            onPrev={stepNumber > 1 ? goToPreviousStep : undefined}
                            onRandomizeAll={handleRandomizeAll}
                        />
                    );
                case StepType.VOCALS:
                    return (
                        <VocalsStep
                            stepNumber={stepNumber}
                            title={currentStepConfig.title}
                            onNext={goToNextStep}
                            onPrev={stepNumber > 1 ? goToPreviousStep : undefined}
                            onRandomizeAll={handleRandomizeAll}
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
                            onPrev={stepNumber > 1 ? goToPreviousStep : undefined}
                        />
                    );
                case StepType.FINAL:
                    return (
                        <FinalStep
                            onRestart={handleRestart}
                            onBack={goToPreviousStep}
                            structurePhrase={structurePhrase}
                            structurePhraseLoading={structurePhraseLoading}
                            structurePhraseError={structurePhraseError}
                            casualPhrase={casualPhrase}
                            casualPhraseLoading={casualPhraseLoading}
                            casualPhraseError={casualPhraseError}
                            onRegenerateCasualPhrase={() => {
                                setCasualPhraseAttempted(false);
                                handleGenerateCasualPhrase();
                            }}
                            onReRandomizeAll={handleReRandomizeAll}
                        />
                    );
                case StepType.TEXT_INPUT:
                    return (
                        <TextInputStep
                            title={currentStepConfig.title}
                            path={currentStepConfig.path}
                            placeholder={currentStepConfig.placeholder}
                            stepNumber={stepNumber}
                            onNext={goToNextStep}
                            onPrev={stepNumber > 1 ? goToPreviousStep : undefined}
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
                onPrev={stepNumber > 1 ? goToPreviousStep : undefined}
                isMusicTheoryStep={isMusicTheoryStep}
                onRandomizeAll={handleRandomizeAll}
            />
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white font-sans px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3 lg:pt-4 pb-4 sm:pb-6 lg:pb-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="pt-0">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Audio Protocol Wizard</h1>
                        <p className="mt-1.5 text-lg text-gray-500 dark:text-gray-400">Create structured, machine-readable audio descriptions step-by-step, or automatically from an audio file</p>
                    </div>
                    <ThemeToggleButton />
                </header>

                <hr className="border-t-2 border-gray-300 dark:border-slate-700 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_0.7fr)_minmax(0,_0.3fr)] gap-6">
                    <div className="space-y-4">
                        {/* Drag & Drop Container */}
                        <div className="bg-white dark:bg-slate-800/50 backdrop-blur rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 px-4 py-4 md:px-5 md:py-4">
                            <div className="flex flex-col sm:flex-row items-stretch gap-4">
                                {/* Drop Zone */}
                                <div className="flex-shrink-0 sm:w-32 h-32 sm:h-auto flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500 dark:text-slate-400">
                                            Drag & Drop
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-slate-500">
                                            audio file
                                        </p>
                                    </div>
                                </div>

                                {/* Original Content */}
                                <div className="flex-1">
                                    <div className="mb-1 flex flex-wrap items-center">
                                        <h2
                                            className="text-base font-bold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-1"
                                            contentEditable="true"
                                            suppressContentEditableWarning={true}
                                            onBlur={(e) =>
                                                updateData(
                                                    'path',
                                                    e.currentTarget.textContent ||
                                                    'audio.wav',
                                                )
                                            }
                                        >
                                            {data.path && data.path !== 'tbc'
                                                ? data.path
                                                : 'audio.wav'}
                                        </h2>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 ml-2">
                                            (Auto AI tagging will be added once trained and this
                                            description protocol is finished)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step Panel Container */}
                        <div
                            className="bg-white dark:bg-slate-800/50 backdrop-blur rounded-xl shadow-lg border border-gray-300 dark:border-slate-700 px-4 pb-4 pt-4 md:px-5 md:pb-5 md:pt-4 flex-shrink-0 overflow-y-auto"
                            style={{
                                height: LAYOUT_HEIGHTS.STEP_PANEL_HEIGHT,
                            }}
                        >
                            {step > 0 && !isFinalStep && (
                                <button
                                    type="button"
                                    onClick={goToPreviousStep}
                                    className="mb-2 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    &larr; Back
                                </button>
                            )}
                            {renderStep()}
                        </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col gap-3">
                        <div className="h-[14.26rem] md:h-[17.82rem] flex flex-col">
                            <div className="flex-1 min-h-0">
                                <JsonPreview />
                            </div>
                        </div>
                        <div className="h-[22.81rem] md:h-[28.51rem] flex flex-col border-t border-gray-200 dark:border-slate-700 pt-3">
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
                        <h2 className="text-sm font-bold text-gray-800 dark:text-white mb-2">Dev Tools</h2>

                        <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700 space-y-4">
                            {/* Generate Phrase and AI Tools */}
                            <div className="flex items-center gap-3 scale-[0.7] origin-left">
                                <button
                                    onClick={() => {
                                        setStructurePhraseAttempted(false);
                                        handleGeneratePhraseFromStructure();
                                    }}
                                    disabled={structurePhraseLoading}
                                    title="Uses AI to transform the current structured wizard data into a concise, human-readable phrase using the phrase-prompt.md template"
                                    className="px-4 py-1.5 text-sm font-semibold text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {structurePhraseLoading ? 'Generating...' : 'Generate Phrase From Structure'}
                                </button>
                                {/* <button
                                    onClick={handleRunModelTest}
                                    disabled={modelTestRunning}
                                    title="Runs performance test on all Groq models (10 requests each) and downloads results as JSON. This will take several minutes."
                                    className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {modelTestRunning ? 'Testing Models...' : 'Test All Models'}
                                </button> */}

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

                            {/* Structure Phrase Display */}
                            {(structurePhrase || structurePhraseLoading || structurePhraseError) && (
                                <div className="space-y-2 pt-4 border-t border-gray-400/80 dark:border-slate-600/80">
                                    <label
                                        htmlFor="structure-phrase-output"
                                        className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        Phrase From Structure:
                                    </label>
                                    <textarea
                                        id="structure-phrase-output"
                                        value={structurePhrase}
                                        readOnly
                                        placeholder={structurePhraseLoading ? 'Generating phrase from structure...' : 'Generated phrase will appear here'}
                                        className="w-full px-3 py-2 text-xs border border-teal-300 dark:border-teal-600 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                                        rows={3}
                                    />
                                    {structurePhraseError && (
                                        <p className="text-xs text-red-600 dark:text-red-400">
                                            Error: {structurePhraseError}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Generate Random Casual Phrase Section */}
                            <div className="space-y-2 pt-4 border-t border-gray-400/80 dark:border-slate-600/80">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <button
                                            onClick={() => {
                                                setCasualPhraseAttempted(false);
                                                handleGenerateCasualPhrase();
                                            }}
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
                                            className="mt-7 px-3 py-1.5 text-sm font-semibold text-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap scale-[0.7] origin-top"
                                            style={{ backgroundColor: RANDOM_BUTTON_COLORS.background }}
                                            onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = RANDOM_BUTTON_COLORS.hover)}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = RANDOM_BUTTON_COLORS.background}
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
                                            rows={5}
                                        />
                                        <button
                                            onClick={handleTranslatePhrase}
                                            disabled={translating || !inputPhrase.trim()}
                                            title="Converts casual musical descriptions into standardized vocabulary using AI, then automatically populates the wizard fields with the extracted terms"
                                            className="px-3 py-1.5 h-fit text-sm font-semibold text-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed scale-[0.7] origin-top"
                                            style={{ backgroundColor: RANDOM_BUTTON_COLORS.background }}
                                            onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = RANDOM_BUTTON_COLORS.hover)}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = RANDOM_BUTTON_COLORS.background}
                                        >
                                            {translating ? 'Translating...' : 'Translate'}
                                        </button>
                                        <textarea
                                            value={translatedPhrase}
                                            readOnly
                                            placeholder="Standardized phrase will appear here"
                                            className="flex-1 px-3 py-2 text-xs border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                                            rows={5}
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
