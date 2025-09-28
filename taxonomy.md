# Musical Quality Taxonomy

## Context
This taxonomy defines a structured vocabulary of **musical qualities** — 
terms that describe the emotional, energetic, and timbral character of music.  
It balances **musicological language** (used by critics, musicians, and listeners)  
with **technical structure** (for use in data annotation, ML training, and software systems).

The vocabulary is organized under three top-level qualities:

- **Mood** – emotional content (e.g. *joyful, melancholic, mysterious*).  
- **Energy** – tempo and intensity (e.g. *driving, slow, frenetic*).  
- **Texture** – sonic character and timbre (e.g. *bright, warm, gritty*).  

Each quality is subdivided into semantic clusters (e.g. *Positive / Uplifting* under Mood).  
Each cluster contains individual **terms** restricted to single words or hyphenated dual-words.  
Widely used metaphorical descriptors (e.g. *cathedral-like, icy*) are also included.

---

## Purpose
The taxonomy is designed to serve both **creative** and **technical** goals:

1. **Canonical Dictionary (`Terms`)**  
   - Defines every term once with description, frequency-of-use rating, and optional extras  
     (aliases, examples, sources).  
   - Ensures consistency and prevents drift across contexts.

2. **Hierarchy (`QualityHierarchyRef`)**  
   - Maps terms into clusters under the three top-level qualities.  
   - Supports flexible traversal, categorization, and querying.  
   - Same term can appear in multiple clusters without duplicating its definition.

3. **Helper Functions (`quality.helpers.ts`)**  
   - `printTermDef(id)` → show description, frequency, and hierarchy path for a term.  
   - `getClusterAndSiblings(id)` → get the cluster path and all sibling terms.  
   - `printCluster(id)` → pretty-print a cluster’s terms with optional details.  
   - `getByFrequency(freq, category?)` → get all terms at a frequency level, optionally filtered by category.  
   - `getUbiquitous(category?)` → shortcut for ubiquitous terms.  
   - `getByFrequencyGrouped(freq)` → grouped by Mood, Energy, Texture.

---

## Usage

### Creative Applications
- Tagging tracks with nuanced descriptors.  
- Building playlist generators (e.g. “calm + warm” selection).  
- Designing UI filters for music search/discovery platforms.  

### Technical / ML Applications
- Preparing structured annotation datasets.  
- Training models to map audio features ↔ descriptive language.  
- Building recommender systems that use mood/energy/texture tags.  
- Exporting denormalized versions (CSV/JSON) for easy integration into pipelines.  

---

## Example
```ts
printTermDef('upbeat');

/*
📂 Mood -> Positive / Uplifting -> upbeat
🎵 upbeat
   Description: Cheerful, lively mood—often mid/fast tempo with bright harmony.
   Frequency:   frequent
   Aliases:     cheerful
   Examples:    “An upbeat pop chorus with handclaps”
   Sources:     AllMusic reviews, Last.fm tags
*/