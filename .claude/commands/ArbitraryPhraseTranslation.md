---
description: Run AI phrase translation test with random casual phrases
---

Run the random phrase translation test to verify AI translation from casual phrases (colloquial/informal language) to standardized phrases (ADP vocabulary).

**Command:** `/ArbitraryPhraseTranslation [count]`

**Arguments:**
- `count` (optional): Number of random casual phrases to test (default: 1, max: 100)

**What this does:**
1. Randomly selects casual phrases from the 100+ curated phrase list
2. Sends them to OpenAI for translation using the phrase-translator prompt
3. Analyzes translation quality and vocabulary usage
4. Displays results with quality metrics

**Instructions:**

Parse the arguments:
```
$ARGUMENTS
```

If arguments are provided, use the first argument as the count (validate 1-100).
If no arguments or invalid, default to 1.

Then run:
```bash
cd "/Users/steve/Desktop/Stuff/Code Projects/Audio Description Protocol" && PYTHONPATH=src python tests/python/ai/test_random_phrase_translator.py [count]
```

Display the complete output including:
- 🗣️ Casual Phrase Input (colloquial/informal language)
- 📝 Standardized Phrase Output (ADP vocabulary)
- 📊 Translation Analysis
- Summary statistics

**Example usage:**
- `/ArbitraryPhraseTranslation` → tests 1 random casual phrase
- `/ArbitraryPhraseTranslation 5` → tests 5 random casual phrases
- `/ArbitraryPhraseTranslation 10` → tests 10 random casual phrases
