import React, { useState } from 'react'

interface AnnotationStep {
  id: string
  title: string
  description: string
  completed: boolean
}

const MusicAnnotationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [annotations, setAnnotations] = useState({
    basicInfo: {
      title: '',
      artist: '',
      duration: 0
    },
    musicalElements: {
      bpm: 0,
      key: '',
      timeSignature: '',
      genre: []
    },
    descriptive: {
      mood: [],
      energy: 0,
      texture: []
    }
  })

  const steps: AnnotationStep[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Provide basic details about the audio clip',
      completed: false
    },
    {
      id: 'musical',
      title: 'Musical Elements',
      description: 'Describe musical characteristics like BPM, key, and genre',
      completed: false
    },
    {
      id: 'descriptive',
      title: 'Descriptive Annotations',
      description: 'Add mood, energy, and texture descriptions',
      completed: false
    },
    {
      id: 'review',
      title: 'Review & Export',
      description: 'Review your annotations and export the ADP data',
      completed: false
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Basic Information
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start by providing basic information about your audio clip.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={annotations.basicInfo.title}
                  onChange={(e) => setAnnotations({
                    ...annotations,
                    basicInfo: { ...annotations.basicInfo, title: e.target.value }
                  })}
                  placeholder="Enter audio clip title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Artist
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={annotations.basicInfo.artist}
                  onChange={(e) => setAnnotations({
                    ...annotations,
                    basicInfo: { ...annotations.basicInfo, artist: e.target.value }
                  })}
                  placeholder="Enter artist name"
                />
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Musical Elements
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Describe the musical characteristics of your audio clip.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  BPM (Beats Per Minute)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={annotations.musicalElements.bpm}
                  onChange={(e) => setAnnotations({
                    ...annotations,
                    musicalElements: { ...annotations.musicalElements, bpm: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Key
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  value={annotations.musicalElements.key}
                  onChange={(e) => setAnnotations({
                    ...annotations,
                    musicalElements: { ...annotations.musicalElements, key: e.target.value }
                  })}
                >
                  <option value="">Select key...</option>
                  <option value="C major">C major</option>
                  <option value="D major">D major</option>
                  <option value="E major">E major</option>
                  <option value="F major">F major</option>
                  <option value="G major">G major</option>
                  <option value="A major">A major</option>
                  <option value="B major">B major</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Descriptive Annotations
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add descriptive elements like mood and energy level.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Energy Level (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                className="w-full"
                value={annotations.descriptive.energy}
                onChange={(e) => setAnnotations({
                  ...annotations,
                  descriptive: { ...annotations.descriptive, energy: parseInt(e.target.value) }
                })}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Calm (1)</span>
                <span>Current: {annotations.descriptive.energy}</span>
                <span>Energetic (10)</span>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Review & Export
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Review your annotations and export the ADP data.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Annotation Summary:</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li><strong>Title:</strong> {annotations.basicInfo.title || 'Not set'}</li>
                <li><strong>Artist:</strong> {annotations.basicInfo.artist || 'Not set'}</li>
                <li><strong>BPM:</strong> {annotations.musicalElements.bpm || 'Not set'}</li>
                <li><strong>Key:</strong> {annotations.musicalElements.key || 'Not set'}</li>
                <li><strong>Energy:</strong> {annotations.descriptive.energy}/10</li>
              </ul>
            </div>
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
              onClick={() => {
                console.log('Exporting ADP data:', annotations)
                alert('ADP data exported! Check console for details.')
              }}
            >
              Export ADP Data
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Audio Description Protocol Wizard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create comprehensive audio annotations using the ADP framework
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <div className="ml-2 text-sm">
                <div className={`font-medium ${
                  index <= currentStep
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${
                  index < currentStep
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default MusicAnnotationWizard