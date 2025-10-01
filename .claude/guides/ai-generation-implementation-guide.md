# AI Generation Implementation Guide

**Created:** 2025-10-01
**Purpose:** Complete reference for implementing AI-powered generation features using OpenAI GPT-5 Nano

## Overview

This guide documents the complete implementation of the "Generate Casual Phrase" feature, which serves as a template for future AI generation functionality in the Audio Description Protocol project.

---

## Architecture Overview

### Components Required

1. **Backend Service** (`backend/src/services/[feature]-generator.ts`)
   - OpenAI client management
   - Prompt construction
   - Token counting
   - Retry logic
   - Response processing

2. **Backend Route** (`backend/src/routes/generate-[feature].ts`)
   - API endpoint definition
   - Request validation
   - Error handling
   - Response formatting

3. **Frontend Service** (`wizard/src/services/[feature]Generator.ts`)
   - API client wrapper
   - Session management
   - Type definitions

4. **Frontend UI** (`wizard/src/components/WizardLayout.tsx`)
   - Button to trigger generation
   - Loading states
   - Result display (textarea/field)
   - Error display

5. **Prompt Template** (`prompts/[feature]-generator-prompt.md`)
   - System instructions for AI
   - Examples
   - Format specifications

---

## Step-by-Step Implementation

### 1. Backend Service Layer

**File:** `backend/src/services/casual-phrase-generator.ts`

#### Key Components:

**A. Lazy OpenAI Client Initialization**
```typescript
let openai: OpenAI | null = null;
let encoder: ReturnType<typeof encoding_for_model> | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

function getEncoder() {
  if (!encoder) {
    encoder = encoding_for_model('gpt-5-nano');
  }
  return encoder;
}
```

**⚠️ CRITICAL:** Use lazy loading pattern to avoid environment variable timing issues. Do NOT instantiate OpenAI client at module level.

**B. Prompt Management**
```typescript
function loadPromptFile(): string {
  const promptPath = join(process.cwd(), '..', 'prompts', '[feature]-prompt.md');
  return readFileSync(promptPath, 'utf-8');
}

function buildDataString(wizardData: WizardData): string {
  const parts: string[] = [];

  // Extract relevant data from wizardData
  if (wizardData.genre?.primary) {
    parts.push(`Genre: ${wizardData.genre.primary}`);
  }
  // ... add more fields as needed

  return parts.join('. ');
}
```

**C. Token Counting**
```typescript
function countTokens(text: string): number {
  const tokens = getEncoder().encode(text);
  return tokens.length;
}
```

**D. Main Generation Function**
```typescript
export async function generateFeature(
  wizardData: WizardData
): Promise<{ result: string; tokensUsed: number; costUSD: number }> {
  const systemPrompt = loadPromptFile();
  const userData = buildDataString(wizardData);
  const prompt = `${systemPrompt}\n\nData: ${userData}`;
  const promptTokens = countTokens(prompt);

  // Enforce token limit if needed
  if (promptTokens > 900) {
    throw new Error(`Token limit exceeded: ${promptTokens} > 900`);
  }

  // Retry logic
  let lastError: any = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const client = getOpenAIClient();
      const completion = await client.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_completion_tokens: 5000, // CRITICAL: Must be high for reasoning models
        // temperature not supported by gpt-5-nano (defaults to 1)
      });

      let result = completion.choices[0]?.message?.content?.trim() || '';

      // Clean up response (remove numbered list prefixes, etc.)
      result = result.replace(/^\d+\.\s*/, '');

      const totalTokens = completion.usage?.total_tokens || 0;
      const costUSD = (totalTokens / 1000) * 0.0001; // Adjust for actual pricing

      return {
        result,
        tokensUsed: totalTokens,
        costUSD,
      };
    } catch (error: any) {
      lastError = error;
      const statusCode = error.status || error.statusCode;
      const retryableCodes = [429, 500, 502, 503];
      const isRetryable = retryableCodes.includes(statusCode);

      if (!isRetryable) {
        throw new Error(`Terminal error: ${error.message}`);
      }

      // Wait 2s before retry
      if (attempt === 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  throw new Error(`Generation failed after retry: ${lastError?.message}`);
}
```

---

### 2. Backend Route Layer

**File:** `backend/src/routes/generate-[feature].ts`

```typescript
import { Router, Request, Response } from 'express';
import { generateFeature } from '../services/[feature]-generator.js';
import type { WizardData } from '../types/index.js';

const router = Router();

interface GenerateFeatureRequest {
  wizardData: WizardData;
  sessionId: string;
  requestId: string;
}

router.post('/generate-[feature]', async (req: Request, res: Response) => {
  try {
    const { wizardData, sessionId, requestId } = req.body as GenerateFeatureRequest;

    // Validate required fields
    if (!wizardData) {
      return res.status(400).json({ error: 'wizardData is required' });
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    if (!requestId) {
      return res.status(400).json({ error: 'requestId is required' });
    }

    // Add any feature-specific validation here
    // Example: check that certain fields are populated

    // Generate result
    const result = await generateFeature(wizardData);

    // Return response
    return res.status(200).json({
      generatedResult: result.result,
      confidence: 0.85, // Adjust based on feature
      tokensUsed: result.tokensUsed,
      costUSD: result.costUSD,
      requestId,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error generating feature:', error);

    if (error.message?.includes('Token limit exceeded')) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message?.includes('Terminal error')) {
      return res.status(500).json({ error: 'AI service error', details: error.message });
    }

    return res.status(500).json({ error: 'Failed to generate feature' });
  }
});

export default router;
```

**Register Route in `backend/src/index.ts`:**
```typescript
import generateFeatureRouter from './routes/generate-[feature].js';
app.use('/api', generateFeatureRouter);
```

---

### 3. Frontend Service Layer

**File:** `wizard/src/services/[feature]Generator.ts`

```typescript
import { v4 as uuidv4 } from 'uuid';
import type { AudioProtocolData } from '../types/protocol';

export interface FeatureResponse {
  generatedResult: string;
  confidence: number;
  tokensUsed: number;
  costUSD: number;
  requestId: string;
  timestamp: string;
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('adp_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('adp_session_id', sessionId);
  }
  return sessionId;
}

function filterWizardData(data: Partial<AudioProtocolData>): Partial<AudioProtocolData> {
  // Create a clean copy with only necessary fields
  return {
    genre: data.genre,
    semantic_description: data.semantic_description,
    theory: data.theory,
    // ... include other relevant fields
  };
}

export async function generateFeature(
  wizardData: Partial<AudioProtocolData>
): Promise<FeatureResponse> {
  const sessionId = getSessionId();
  const requestId = uuidv4();
  const filteredData = filterWizardData(wizardData);

  const response = await fetch('/api/generate-[feature]', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      wizardData: filteredData,
      sessionId,
      requestId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 500 && errorData.details) {
      throw new Error(errorData.details);
    }
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
```

---

### 4. Frontend UI Integration

**File:** `wizard/src/components/WizardLayout.tsx`

```typescript
// Add state management
const [generatedResult, setGeneratedResult] = useState('');
const [resultLoading, setResultLoading] = useState(false);
const [resultError, setResultError] = useState<string | null>(null);

// Add handler function
const handleGenerateFeature = async () => {
  setResultLoading(true);
  setResultError(null);

  try {
    console.log('🎵 Generating feature with data:', data);
    const response = await generateFeature(data);
    console.log('✅ Feature response:', response);
    console.log('📝 Result:', response.generatedResult);
    setGeneratedResult(response.generatedResult);
  } catch (error: any) {
    console.error('❌ Error generating feature:', error);
    setResultError(error.message || 'Failed to generate feature');
  } finally {
    setResultLoading(false);
  }
};

// Add UI elements in Tools section
<div className="space-y-2">
  <div className="flex items-start justify-between">
    <button
      onClick={handleGenerateFeature}
      disabled={resultLoading}
      className="px-4 py-1.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out"
    >
      {resultLoading ? 'Generating...' : 'Generate Feature'}
    </button>
    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-[0.75px]">
      Description of what this feature does
    </p>
  </div>

  {resultError && (
    <p className="text-xs text-red-600 dark:text-red-400">
      Error: {resultError}
    </p>
  )}

  {(generatedResult || resultLoading) && (
    <div>
      <label
        htmlFor="feature-result-input"
        className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
      >
        Generated Result:
      </label>
      <textarea
        id="feature-result-input"
        value={generatedResult}
        onChange={(e) => setGeneratedResult(e.target.value)}
        disabled={resultLoading}
        placeholder={resultLoading ? 'Generating...' : 'Result will appear here'}
        className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        rows={3}
      />
    </div>
  )}
</div>
```

---

### 5. Prompt Template

**File:** `prompts/[feature]-generator-prompt.md`

Create a clear, concise prompt that:
- Defines the AI's role/persona
- States the goal clearly
- Provides guidelines and constraints
- Includes 5-10 quality examples
- Specifies output format

**Example Structure:**
```markdown
You are [role description].

## Goal

[Clear statement of what the AI should generate]

## Guidelines

* Guideline 1
* Guideline 2
* Guideline 3

## Examples

1. Example 1
2. Example 2
3. Example 3

---

Now generate [what you want].
```

---

## Critical Issues and Solutions

### Issue 1: Environment Variables Not Loading

**Problem:** OpenAI client instantiated at module level before `.env` file loaded.

**Solution:** Use lazy loading pattern with getter function:
```typescript
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}
```

### Issue 2: Empty AI Responses (Reasoning Model Issue)

**Problem:** GPT-5 Nano is a reasoning model that uses completion tokens for internal reasoning. With low token limits (70-200), ALL tokens were consumed by reasoning with ZERO tokens left for output text.

**Symptoms:**
- `"content": ""` (empty)
- `"finish_reason": "length"`
- `"reasoning_tokens": N` (equals max_completion_tokens)
- `"completion_tokens": N` (all tokens used)

**Solution:** Set `max_completion_tokens` to 5000+ to give model room for both reasoning AND output:
```typescript
const completion = await client.chat.completions.create({
  model: 'gpt-5-nano',
  max_completion_tokens: 5000, // CRITICAL for reasoning models
  // ...
});
```

### Issue 3: Unsupported Parameters

**Problems Encountered:**
1. `max_tokens` → Use `max_completion_tokens` instead
2. `temperature: 0.9` → Only default value (1) supported

**Solution:**
```typescript
const completion = await client.chat.completions.create({
  model: 'gpt-5-nano',
  messages: [...],
  max_completion_tokens: 5000, // NOT max_tokens
  // temperature defaults to 1 (only supported value)
});
```

### Issue 4: Numbered List Prefix in Output

**Problem:** AI sometimes returns responses like "1. [actual content]"

**Solution:** Strip numbered prefixes in backend:
```typescript
let result = completion.choices[0]?.message?.content?.trim() || '';
result = result.replace(/^\d+\.\s*/, ''); // Remove "1. " prefix
```

### Issue 5: Genre Validation Too Strict

**Problem:** Required genre field prevented generation with incomplete wizard data.

**Solution:** Remove strict validation, allow any combination of attributes:
```typescript
// No validation required - allow any combination of attributes
```

---

## Testing Checklist

When implementing new AI generation features:

- [ ] Backend service uses lazy OpenAI client loading
- [ ] `max_completion_tokens` set to 5000+ (not `max_tokens`)
- [ ] No `temperature` parameter specified (uses default 1)
- [ ] Prompt loaded from markdown file
- [ ] Token counting implemented
- [ ] Retry logic with 2s delay for retryable errors (429, 500, 502, 503)
- [ ] Response cleaning (remove prefixes, trim, etc.)
- [ ] Route registered in `backend/src/index.ts`
- [ ] Frontend service created with session management
- [ ] UI state management (result, loading, error)
- [ ] Loading states and disabled buttons during generation
- [ ] Error display in UI
- [ ] Console logging for debugging
- [ ] Backend successfully starts on port 3001
- [ ] API endpoint accessible
- [ ] Generate button works without errors
- [ ] Result displays in UI correctly
- [ ] Result is editable after generation

---

## Debugging Tips

### Backend Debugging

Add comprehensive logging:
```typescript
console.log('🔧 Sending prompt to OpenAI (length:', prompt.length, 'chars)');
console.log('📋 Prompt preview:', prompt.substring(0, 200) + '...');
console.log('🤖 OpenAI raw completion:', JSON.stringify(completion, null, 2));
console.log('✂️ Extracted result after processing:', result);
console.log('📤 Sending response:', responseObject);
```

### Frontend Debugging

Add console logging:
```typescript
console.log('🎵 Generating with data:', data);
console.log('✅ Response:', response);
console.log('📝 Result text:', response.generatedResult);
```

### Check Backend Process

```bash
# Find process on port 3001
netstat -ano | findstr :3001

# Kill process (Windows)
taskkill //F //PID [PID]

# Restart backend
cd backend && npx tsx src/index.ts
```

### Check Backend Logs

Use `BashOutput` tool to view running backend logs and identify errors.

---

## Cost Considerations

### Token Usage

- **Prompt tokens:** ~600-700 for typical casual phrase generation
- **Completion tokens:** ~800-1000 (including reasoning tokens)
- **Total:** ~1400-1700 tokens per request

### Pricing Estimate

Based on `0.0001` per 1000 tokens:
- ~$0.00014-0.00017 per generation

**Note:** Adjust pricing calculation based on actual GPT-5 Nano rates.

---

## Performance Optimization

### Reduce Token Usage

1. **Simplify prompts** - Remove verbose instructions if possible
2. **Cache prompt tokens** - OpenAI supports prompt caching
3. **Reduce max_completion_tokens** - After testing, lower from 5000 if possible
4. **Implement rate limiting** - Prevent excessive API calls

### Improve Response Time

1. **Optimize prompt length** - Shorter prompts = faster processing
2. **Implement request queuing** - Handle multiple simultaneous requests
3. **Add response caching** - Cache results for identical inputs

---

## Future Enhancements

### Potential Features to Add

1. **Generate Standardized Phrase** - Already exists, use as reference
2. **Generate Song Title** - Short, creative title based on attributes
3. **Generate Artist Name** - Genre-appropriate artist name
4. **Generate Album Name** - Thematic album title
5. **Generate Track Description** - Detailed technical description
6. **Generate Mood Analysis** - AI-suggested mood tags
7. **Generate Similar Music Recommendations** - Based on attributes

### Implementation Template

For each new feature, follow this checklist:

1. Create `backend/src/services/[feature]-generator.ts`
2. Create `backend/src/routes/generate-[feature].ts`
3. Register route in `backend/src/index.ts`
4. Create `wizard/src/services/[feature]Generator.ts`
5. Add UI in `wizard/src/components/WizardLayout.tsx`
6. Create `prompts/[feature]-generator-prompt.md`
7. Test thoroughly using checklist above
8. Add logging for debugging
9. Document any feature-specific quirks

---

## Common Patterns

### Pattern 1: Simple Text Generation

Use for: titles, names, short descriptions

**Token Limit:** 5000
**Output:** Single string
**UI:** Small textarea or input field

### Pattern 2: Structured Data Generation

Use for: JSON objects, lists, categorized data

**Token Limit:** 5000+
**Output:** Parsed JSON
**UI:** Multiple fields or formatted display

### Pattern 3: Long-Form Generation

Use for: detailed descriptions, essays, reports

**Token Limit:** 8000+
**Output:** Markdown or plain text
**UI:** Large textarea with rich formatting

---

## Summary

This guide provides a complete reference for implementing AI generation features using OpenAI GPT-5 Nano. The key lessons learned:

1. **Always use lazy loading** for OpenAI client
2. **Set max_completion_tokens to 5000+** for reasoning models
3. **Don't specify temperature** (not supported)
4. **Use max_completion_tokens**, not max_tokens
5. **Clean AI responses** (remove prefixes, trim, etc.)
6. **Implement retry logic** for transient errors
7. **Add comprehensive logging** for debugging
8. **Validate minimally** to allow flexible usage

Follow this guide when implementing any new AI generation functionality to ensure consistent, reliable results.
