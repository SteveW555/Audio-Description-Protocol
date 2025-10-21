# Gemini's Recommendations for Audio-Description-Protocol

This file contains a summary of the recommendations for improving the project.

### High Priority: Frontend Performance & Refactoring

1.  **Refactor `WizardLayout.tsx`**: This is the most critical task. The component is too large and complex.
    *   **Action:** Break it down into smaller, more focused components.
    *   **Action:** Extract business logic and related state into custom hooks (e.g., `usePhraseTranslation`, `useCasualPhraseGeneration`, `useModelTesting`). This will improve performance by isolating state changes and reducing unnecessary re-renders.

2.  **Abstract API Calls**: API logic is currently mixed with UI logic in the `WizardLayout.tsx` component.
    *   **Action:** Create a dedicated service layer for making API calls (`fetch` requests). This will handle all request/response logic, error handling, and centralize API interactions.

3.  **Clarify State Management Strategy**: There is an overlap between the global Zustand store and the local `useState` hooks in `WizardLayout.tsx`.
    *   **Action:** Define a clear boundary between what should be in the global store versus what should be local component state. Move shared state and states that are updated by multiple components into Zustand.

### Medium Priority: Backend & Developer Experience

1.  **Consolidate Python Dependencies**: The project uses both `pyproject.toml` and `requirements.txt`.
    *   **Action:** Merge all dependencies from `requirements.txt` into `pyproject.toml` to create a single source of truth.

2.  **Externalize CORS Configuration**: The backend's CORS origins are hardcoded in `api_server.py`.
    *   **Action:** Move the CORS origins list to environment variables to allow for more flexible and secure deployments.

### Low Priority: Optimizations

1.  **Optimize Frontend Dependencies**: The project uses both `lodash` and `lodash-es`.
    *   **Action:** Standardize on `lodash-es` to take advantage of tree-shaking and reduce the final bundle size.

2.  **Improve Taxonomy Search**: The backend's taxonomy search performs a simple linear scan.
    *   **Action:** If this becomes a performance bottleneck, consider implementing a more advanced search solution (e.g., using a dedicated search library or database indexing).

3.  **Use a Template Engine for Code Generation**: The backend's code generation logic uses basic string manipulation.
    *   **Action:** For more complex code generation, consider using a template engine like Jinja2 to make the code more maintainable.
