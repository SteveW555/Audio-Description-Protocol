
# Audio Description Protocol (ADP)

To see this document properly formatted open in VS Code and use Cmd-Shift-V, or view on Github

## Vision

A standardized protocol for describing music that enables **consistent communication** between humans, LLMs, and music generation AIs.

## The Problem

Different people and AIs describe the same track using completely different vocabulary:
- 🎵 Person A: *"Euphoric atmospheric EDM with rich chords and piano and female vox"*
- 🎵 Person B: *"Uplifting trance with lush arrangement featuring piano and haunting vocals"*

**Result:** Inconsistent and unpredictable music generation outcomes across different AI systems.

## The Solution

**ADP provides a fixed grammar** of attributes, categories, and keywords through an interactive Description Wizard that:

1. **Structures descriptions** into machine-readable JSON
2. **Enforces consistency** across users and AI systems
3. **Enables interoperability** between different music generation tools
4. **Remains human-friendly** with natural language translation

---

## Example Description

### Structured Format

```yaml
Genre: EDM
  Sub-genre: Trance

Mood: Uplifting, Emotional
Energy: Pumping, High_Energy
Texture: Polished, Lush

Featured Instrument 1:
  - Instrument: Piano
  - Role: Main melody
  - Descriptors: Bright, Reverberant

Vocals:
  - Type: Lead
  - Gender: Female
  - Style: Breathy
  - Descriptors: Ethereal, Echo, Sparse

Music Theory:
  - BPM: 135
  - Key: A minor
  - Chord Progression: [Am, F, Dm, Em]
```

### Human-Readable Translation

> *"Uplifting trance track with full, lush arrangement featuring sparkling piano and haunting female vocals"*

---

## Goal

Ensure that diverse descriptions like:
- *"Uplifting trance track with lush arrangement and haunting female vocals"*
- *"Euphoric atmospheric EDM with rich chords, piano, and female vox"*

**Produce similar musical outputs** when submitted to different music generation AIs.

---

## Current Status

✅ **479-term taxonomy** across Mood, Energy, and Texture dimensions
✅ **React-based Description Wizard** with interactive term selection
✅ **JSON schema validation** and export functionality
🚧 **Integration with music generation APIs** (planned)

---

## Next Steps

This project combines **music theory, natural language processing, and AI interoperability**:

- 🎼 **Taxonomy refinement** - Expanding/validating musical descriptors
- 🧠 **AI integration** - Connecting to music generation APIs
- 🎨 **UX/UI** - Improving the Description Wizard interface
- 📊 **Validation** - Testing consistency across AI systems
- 📖 **Documentation** - User guides and API specifications

**Tech Stack:** Python 3.11+ | PyTorch | React/TypeScript | FastAPI
