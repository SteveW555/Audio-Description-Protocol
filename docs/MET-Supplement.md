# MET (Mood Energy Texture) Framework — Supplementary Notes (No Term Lists)

This document compiles the **interesting supplementary information** from the MET (Mood–Energy–Texture) write‑up without reproducing long term lists. It focuses on theory, design choices, disambiguation strategy, MIR linkages, and practical applications.

---

## 1) Why MET? (Problem & Goals)
- Music is **hard to describe** in words; useful language spans **affective** (mood), **kinetic** (energy), and **sonic** (texture) dimensions.
- MET offers a **tripartite, orthogonal-but-related** model to bridge **subjective perception** and **objective audio features**.
- The aim is a **computationally tractable** vocabulary that is precise enough for ML, recommendation, and UI filtering.

**Design goals**
- Disambiguate polysemous words through **category context** (e.g., *intense* as mood vs energy vs texture).
- Keep definitions **short, operational**, and **consistent** across sources (reviews, academia, production).
- Provide **hierarchical** structure suitable for search facets and learnable label sets.

---

## 2) Theoretical Foundations (Affective science & MIR)
- **Mood** ≈ **valence** (positive ↔ negative) with nuance from GEMS (e.g., **Wonder**, **Transcendence**, **Tenderness**, **Tension**).
- **Energy** ≈ **arousal** (sleepy ↔ excited) and is perceptually composed from **tempo**, **dynamics**, and **rhythmic character**.
- **Texture** combines **formal musicology** (monophony/homophony/polyphony) with **psychoacoustic/production** descriptors (warm, bright, gritty).

**Key models referenced**
- **Thayer’s 2D model**: valence × arousal.
- **GEMS** emotions: adds granularity for aesthetic feelings beyond simple quadrants.
- **MIR correlates**: tempo, loudness (RMS/crest), spectral centroid, spectral irregularity/roughness, danceability, etc.

---

## 3) Methodology (for expansion & validation)
- Curated from ~120 sources (reviews, glossaries, papers, production notes).
- Added/adjusted subcategories when needed for **logical coherence** (e.g., _Rhythmic Character_, _Negative/Unstable_, _Expansive/Other_).
- Assigned **usage frequency** (ubiquitous / frequent / infrequent / rare) as a quasi‑quantitative prevalence signal across domains.
- Outcome: a **defensible hierarchical lexicon** aligned to measurable properties where possible.

---

## 4) Disambiguation Strategy (Polysemy)
- Same word can validly describe different dimensions:
  - **Mood**: *intense* = emotionally overpowering.
  - **Energy**: *intense* = high tempo/loudness/drive.
  - **Texture**: *intense* = dense or sharply edged timbre.
- Strategy: introduce **category‑specific senses** and, if required, **suffixes** (e.g., `intense-mood`, `chaotic-energy`, `dark-mood` vs `dark` timbre).
- Benefit: tags are **machine‑actionable** and unambiguous in pipelines.

---

## 5) Energy as Composite (Tempo × Dynamics × Rhythm)
- **Tempo** (BPM / mid- vs high-tempo) is the primary driver.
- **Dynamics** (perceived loudness, e.g., RMS) add arousal; large‑scale changes captured by **crescendo/decay/swell**.
- **Rhythmic character** differentiates otherwise similar tempos: **driving/propulsive**, **pulsing/throbbing**, **groovy/swinging/funky**, **syncopated/off‑beat**, **bouncy/lilting**.
- Practical implication: treat these as **separate features** in modeling; do not collapse to a single scalar without context.

---

## 6) Texture at Three Levels
1. **Compositional texture** (formal structure): monophony, homophony, polyphony, heterophony.
2. **Sonic density & layering**: thin/sparse ↔ thick/dense/lush; transparent vs heavy.
3. **Timbral quality / finish**: warm/bright/dark, smooth/gritty/harsh, polished/raw, airy/shimmering, etc.

**Cross‑modal metaphors** (touch, temperature, light) are not arbitrary—many align with **spectral statistics**.

---

## 7) Subjective → Objective: MIR Mapping Cheatsheet
*(Illustrative, not exhaustive)*

| Descriptor family | Likely acoustic correlate(s) | Notes |
|---|---|---|
| **Bright / Crisp / Airy / Sparkling** | Higher **spectral centroid**, more >5 kHz energy | Perceived upper‑band emphasis, clarity |
| **Warm / Full / Rounded / Mellow** | Elevated **low‑mid** (≈200–500 Hz), gentle HF roll‑off | Comforting, “cozy” body |
| **Dark / Muddy** | High **low‑mid** energy + low centroid | Reduced articulation/clarity |
| **Harsh / Gritty / Distorted / Abrasive** | **Spectral irregularity/roughness**, inharmonic content, THD | Fatigue, edge, rasp |
| **Smooth / Polished / Clean** | Lower irregularity, controlled dynamics (**crest factor**), low noise | “Studio” sheen |
| **Driving / Propulsive / Thumping** | Strong periodicity; stable pulse; kick/bass dominance | Motor engagement / danceability |
| **Chaotic (energy)** | Low periodicity; irregular onset patterns | Structural unpredictability |

---

## 8) Functional Labels (Activity → Intrinsic Qualities)
- Activity tags (e.g., **workout**, **study**, **sleep**) are **derived** from intrinsic MET traits.
  - *Workout*: **High Energy**, **driving/propulsive**, often **pumping/thumping**.
  - *Focus/Study*: **Low–Medium Energy**, **steady**, **ambient/soothing**, minimal lyrical salience.
  - *Sleep*: **Low Energy**, **slow**, **soft**, **ambient**, consistent dynamics (no sudden transients).
- System design: translate functional requests to **constrained MET queries**.

---

## 9) Genre ↔ Mood/Energy Coupling
- Many genres encode **conventional affect** (e.g., bluesy ↔ melancholic; funk ↔ groovy/joyful activation).
- Recommenders should **not** treat genre & mood as independent; use **conditional priors** (genre → likely MET distribution) while allowing outliers.

---

## 10) Frequencies & Governance
**Usage frequency semantics**
- **Ubiquitous**: appears across criticism, academia, and production contexts.
- **Frequent**: common in multiple domains, widely understood.
- **Infrequent**: narrower scope or domain‑specific.
- **Rare**: specialist term or rhetorical flourish.

**Governance recommendations**
- Maintain **single canonical registry**; treat values as immutable at runtime.
- All changes via **reviewed PRs** with: definition, category placement, rationale, and (if possible) audio examples.
- Include a **validator**: checks for duplicate IDs, orphaned hierarchy refs, missing defs, and polysemy suffixes.

---

## 11) ID & Naming Conventions
- IDs: lowercase **kebab‑case** slugs (`gritty-texture`, `intense-mood`, `chaotic-energy`).  
- When a surface form spans categories, mint **category‑scoped IDs** with suffixes.  
- Prefer concise, **plain‑English** definitions; avoid theory unless operationally necessary.

---

## 12) Implementation Hints
- **Storage**: flat `Terms` map + `QualityHierarchyRef` (category → cluster → id[]).
- **Search UX**: show **facet breadcrumbs** (e.g., *Mood › Positive / Uplifting*), allow quick **peer** navigation.
- **Disambiguation in UI**: when a user types “intense”, prompt: *Mood? Energy? Texture?* (with brief tooltips).
- **Modeling**: learn **multilabel** predictions per MET dimension; keep **rhythmic character** separate from raw tempo.

---

## 13) Example Query Translations
- “Melancholic, laid‑back, warm acoustic”:  
  → *Mood: melancholic* · *Energy: low/medium steady* · *Texture: warm; source: acoustic*.
- “Epic but not harsh”:  
  → *Mood: epic* · *Energy: medium→high (evolving)* · *Texture: exclude harsh/abrasive*.
- “Focus, no vocals, non‑sleepy”:  
  → *Mood: calm/peaceful* · *Energy: steady, low variance* · *Texture: smooth/clean; density: sparse/transparent*.

---

## 14) Validation Checklist (for future updates)
- [ ] Term has **single‑sense definition** within its category.
- [ ] If polysemous across categories, **suffixes** applied.
- [ ] **Usage frequency** set with rationale.
- [ ] **Hierarchy path** (category → cluster) defined.
- [ ] No **dup IDs**; no **orphan refs**.
- [ ] Optional: MIR correlate(s) identified.

---

*End of supplement (no term lists included).*