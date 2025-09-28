import React, { useState } from 'react'
import MusicAnnotationWizard from '@components/MusicAnnotationWizard'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a preference stored or system preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('adp-dark-mode')
      if (stored !== null) {
        return JSON.parse(stored)
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('adp-dark-mode', JSON.stringify(newMode))
  }

  // Apply dark mode class to document
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Global dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <SunIcon className="w-5 h-5 text-yellow-500" />
        ) : (
          <MoonIcon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Main application */}
      <MusicAnnotationWizard />
    </div>
  )
}

export default App