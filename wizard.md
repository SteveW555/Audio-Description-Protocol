Project Report & Refactoring Guide: Audio Protocol Wizard Document Version: 1.0

Date: September 27, 2025

Project Purpose & Core Goal The Audio Protocol Wizard is a web-based tool designed to solve the problem of inconsistent and ambiguous audio metadata. Its primary goal is to enable users to create highly structured, machine-readable JSON descriptions of audio samples by guiding them through a step-by-step process.

This moves away from vague, human-centric descriptions (e.g., "a sad piano song") towards a rigid, semantic protocol that can be reliably used by AI systems for tasks such as:

Database Querying: Allowing for complex, precise searches (e.g., "Find all tracks in A minor with a 'distorted' lead guitar and 'dreamy' mood").

AI Music Generation: Providing detailed, structured prompts for text-to-music models.

Automated Analysis: Creating a consistent dataset for training machine learning models to understand audio characteristics.

The application, in its current state, is a fully functional, self-contained prototype that proves the viability of this wizard-based approach.

Current Features The application provides a complete end-to-end user experience for generating a valid JSON record.

Guided Wizard Flow: A multi-step interface that asks one question at a time, ensuring all required fields of the protocol are considered.

Live JSON Preview: A real-time display of the JSON object being constructed, which updates with every user selection.

Context-Aware Selections: The options presented to the user are filtered based on previous selections. For example, after choosing "rock" as a genre, the subgenre list only shows rock-related subgenres.

Conditional Logic: The wizard's path is dynamic. Optional sections, like adding a secondary genre or music theory details, are only shown if the user opts in.

Input Control: The "Next" button is disabled until a valid selection is made, preventing accidental progression with empty data. A "Skip" button allows users to explicitly mark fields as tbc (to be completed).

Complex Sub-Wizards: A dedicated flow for adding multiple instruments, each with its own name, role, and set of descriptors.

Data Export: The final generated JSON can be copied to the clipboard or downloaded as a .json file.

Session Restart: A "Create New Record" button allows the user to reset the wizard and start a new description from scratch.

Technology Stack The project is intentionally built as a self-contained prototype that can run in any modern browser without a build step.

Frontend Library: React v17, loaded directly from the UNPKG CDN.

Language & Transpilation: JavaScript (ES6/JSX), written inside a 

Styling: Tailwind CSS v3, loaded from the Tailwind CDN. Custom dark mode styles are included in a 

Architecture: Single File Application. All HTML, CSS definitions, and JavaScript logic reside within the single audio-protocol-wizard.html file.

Code Architecture & Internal Logic Understanding the current architecture is key to refactoring it effectively.

4.1. Single-File Structure All logic is contained within a 

4.2. State Management State is managed centrally within the App component using the React.useState hook. The main data object holds the entire JSON structure, and a step integer tracks wizard progress. This leads to significant "prop drilling," as state and update functions are passed down through multiple component layers.

4.3. Wizard Control Flow The wizard's logic is driven by a large configuration array: WIZARD_STEPS. Each object in this array represents a potential step and defines its properties.

Example of a step configuration object:

{ title: 'Mood', path: 'semantic_description.attributes.mood', terms: VOCABULARY.mood, multi: true }

"Special" steps (like sub-wizards or question prompts) are handled by a master renderCurrentStep function that acts as a simple router.

Recommended Refactoring Roadmap The goal of the refactor is to transition the project from a single-file prototype to a professional, scalable, and maintainable codebase.

Step 1: Establish a Modern Development Environment Initialize a Project: Use a modern build tool like Vite or Create React App to create a new project. Vite is recommended for its speed.

Add TypeScript: The project should be initialized as a TypeScript project from the start.

Step 2: Deconstruct the Single File Component Separation: Extract every helper component (JsonPreview, TermSelector, etc.) into its own file (e.g., src/components/TermSelector.tsx).

Modularize Constants: Move the VOCABULARY object and WIZARD_STEPS array into their own files (e.g., src/constants/vocabulary.ts).

Define Types: Create a src/types.ts file to hold all TypeScript interfaces for the data structures (AudioProtocolData, SemanticDescription, etc.).

Step 3: Refine the Codebase Convert to TypeScript: Convert all components from JavaScript/JSX to TypeScript/TSX, adding types for props, state, and function signatures.

Improve State Management: To solve prop drilling, introduce React Context or a lightweight state manager like Zustand. A WizardContext could provide the main data object and update functions to any component that needs them.

Custom Hooks: Extract business logic, like the functions for getting context-aware subgenres (getSubgenresFor), into custom hooks (e.g., useSubgenres(genre)).

Step 4: Final Structure Example A mature project structure would look something like this:

/src |-- /components |   |-- AskStep.tsx |   |-- FinalStep.tsx |   |-- JsonPreview.tsx |   |-- TermSelector.tsx |   |-- ...etc |-- /constants |   |-- vocabulary.ts |   |-- wizardConfig.ts |-- /context |   |-- WizardContext.tsx |-- /hooks |   |-- useSubgenres.ts |-- /types |   |-- protocol.ts |-- App.tsx |-- main.tsx

By following this roadmap, the Audio Protocol Wizard can be transformed into a robust application that is easier to debug, extend, and maintain.

