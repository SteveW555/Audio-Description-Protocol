"""Reusable phrase functions for AI phrase generation, translation, and analysis.

This module provides core functionality for:
- Loading AI prompts from markdown files
- Translating between casual phrases and standardized phrases
- Generating random music descriptions
- Analyzing phrase quality and translation accuracy
- Validating phrase characteristics

All functions are separated from test code for reusability across different contexts.
"""

import json
import random
import re
from typing import Dict, List, Set, Tuple, Optional, Any
from pathlib import Path


# ============================================================================
# PROMPT LOADING FUNCTIONS
# ============================================================================

def load_prompt_file(filename: str, extract_section: bool = False) -> str:
    """Load a prompt from a markdown file.

    Args:
        filename: Name of the markdown file (e.g., 'phrase-translator-prompt.md')
        extract_section: If True, extract content between LLM Prompt markers

    Returns:
        Prompt content as string
    """
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        if extract_section:
            # Extract content between markers
            start_marker = "### **LLM Prompt Start**"
            end_marker = "### **LLM Prompt End**"
            start = content.find(start_marker)
            end = content.find(end_marker)

            if start != -1 and end != -1:
                return content[start + len(start_marker):end].strip()

        return content.strip()
    except FileNotFoundError:
        raise FileNotFoundError(f"Prompt file not found: {filename}")


def load_translator_prompt() -> str:
    """Load the casual → standardized phrase translator prompt.

    Returns:
        System prompt for translating casual to standardized phrases
    """
    return load_prompt_file('phrase-translator-prompt.md')


def load_reverse_prompt() -> str:
    """Load the standardized → casual phrase reverse translator prompt.

    Returns:
        System prompt for reverse translation
    """
    return load_prompt_file('phrase-reverse-prompt.md')


def load_generation_prompt() -> str:
    """Load the standardized phrase generation prompt.

    Returns:
        System prompt for generating standardized phrases from structured data
    """
    return load_prompt_file('phrase-prompt.md', extract_section=True)


def load_creator_prompt() -> str:
    """Load the casual phrase creator prompt.

    Returns:
        System prompt for generating creative casual phrases
    """
    return load_prompt_file('phrase-creator-prompt.md')


# ============================================================================
# MUSIC DESCRIPTION GENERATION
# ============================================================================

def generate_random_music_description() -> Dict[str, Any]:
    """Generate a randomized music description structure for testing.

    Returns:
        Dictionary with genre, mood, energy, texture, instruments, and vocals
    """
    # Define vocabularies
    genres = ["electronic", "rock", "jazz", "hip_hop", "soundtrack", "pop", "classical", "metal"]
    sub_genres = {
        "electronic": ["synthwave", "techno", "house", "drum_and_bass", "ambient"],
        "rock": ["progressive_metal", "indie_rock", "punk", "classic_rock", "alternative"],
        "jazz": ["cool_jazz", "bebop", "fusion", "smooth_jazz", "free_jazz"],
        "hip_hop": ["boom-bap", "trap", "conscious_hip_hop", "gangsta_rap", "experimental"],
        "soundtrack": ["ambient_soundtrack", "orchestral", "cinematic", "game_soundtrack"],
        "pop": ["synth_pop", "indie_pop", "dream_pop", "dance_pop"],
        "classical": ["baroque", "romantic", "contemporary", "minimalist"],
        "metal": ["death_metal", "black_metal", "doom_metal", "thrash_metal"]
    }

    moods = ["intense", "relaxed", "nostalgic", "dreamy", "confident", "ethereal",
             "mysterious", "uplifting", "melancholic", "aggressive", "contemplative",
             "playful", "dark", "bright", "epic", "intimate", "pensive"]

    energies = ["frenetic", "laid-back", "propulsive", "groovy", "static-energy",
                "dynamic-energy", "steady", "mid-tempo", "high-energy", "gradual",
                "explosive", "subdued", "driving", "unhurried"]

    textures = ["dense", "smooth", "synthetic", "spacious", "raw-texture", "polished",
                "layered", "intimate-space", "minimalistic", "atmospheric", "reverberant",
                "dry", "distorted", "grainy", "lush", "sparse"]

    instruments = ["electric_guitar", "drums", "saxophone", "bass_synthesizer",
                   "synthesizer", "piano", "violin", "strings", "drum_machine",
                   "sampler", "double_bass", "trumpet", "flute", "cello"]

    roles = ["melody", "rhythm", "riffs", "ostinato", "beat", "harmony",
             "walking_bassline", "orchestral_bed", "pad", "lead", "bass"]

    descriptors = ["chugging", "distorted", "breathy", "jazzy", "driving", "analog",
                   "soaring", "tight", "heavy", "warm", "plucked", "sweeping", "distant",
                   "lofi", "rhythmic", "clear", "technical", "reverberant", "bright",
                   "dark", "metallic", "organic", "crisp"]

    vocal_styles = ["singing", "rapping", "spoken", "screaming", "whispering"]
    vocal_genders = ["male", "female", "mixed", "androgynous"]
    vocal_presences = ["lead", "choir", "background", "none"]

    # Generate random selections
    genre = random.choice(genres)
    sub_genre = random.choice(sub_genres[genre])

    selected_moods = random.sample(moods, k=random.randint(2, 4))
    selected_energies = random.sample(energies, k=random.randint(1, 3))
    selected_textures = random.sample(textures, k=random.randint(2, 4))

    # Build the description
    description = {
        "Genre": genre,
        "Sub-genre": sub_genre,
        "Mood": selected_moods,
        "Energy": selected_energies,
        "Texture": selected_textures
    }

    # Add 1-3 featured instruments
    num_instruments = random.randint(1, 3)
    for i in range(1, num_instruments + 1):
        instrument = random.choice(instruments)
        description[f"Featured Instrument {i}"] = {
            "Instrument": instrument,
            "Role": random.choice(roles),
            "Descriptors": random.sample(descriptors, k=random.randint(2, 3))
        }

    # Maybe add vocals (60% chance)
    if random.random() < 0.6:
        presence = random.choice(vocal_presences)
        if presence != "none":
            description["Vocals"] = {
                "Presence": presence,
                "Gender": random.choice(vocal_genders),
                "Style": random.choice(vocal_styles),
                "Descriptors": random.sample(descriptors, k=random.randint(2, 3))
            }

    return description


# ============================================================================
# TRANSLATION ANALYSIS
# ============================================================================

def analyze_translation(casual_phrase: str, standardized_phrase: str) -> Dict[str, Any]:
    """Analyze the quality of casual → standardized phrase translation.

    Args:
        casual_phrase: Original casual/colloquial phrase
        standardized_phrase: Translated standardized phrase

    Returns:
        Dictionary with:
        - found_vocabulary: Dict of vocabulary categories and found terms
        - preserved_concepts: List of concepts preserved from original
        - translation_quality: 'Excellent', 'Good', 'Fair', or 'Poor'
        - vocab_count: Total number of vocabulary terms found
    """
    # Keywords that indicate proper ADP vocabulary usage
    vocabulary_keywords = {
        'Genres': ['electronic', 'rock', 'pop', 'hip_hop', 'jazz', 'classical',
                   'folk', 'soundtrack', 'ambient', 'metal', 'punk', 'reggae',
                   'disco', 'techno', 'trance', 'dubstep', 'blues', 'soul', 'gospel'],
        'Moods': ['aggressive', 'relaxed', 'melancholic', 'uplifting', 'dark',
                  'ethereal', 'mysterious', 'joyful', 'sad', 'triumphant',
                  'haunting', 'dreamy', 'nostalgic', 'romantic', 'intense'],
        'Energy': ['high-energy', 'laid-back', 'driving', 'chill', 'frenetic',
                   'steady', 'dynamic', 'explosive', 'flowing', 'hypnotic'],
        'Texture': ['bright', 'dark', 'warm', 'crisp', 'fuzzy', 'smooth',
                    'distorted', 'polished', 'raw', 'layered', 'sparse'],
        'Instruments': ['guitar', 'bass', 'drums', 'synthesizer', 'piano',
                        'strings', 'brass', 'vocals', 'saxophone', 'organ']
    }

    analysis = {
        'found_vocabulary': {},
        'preserved_concepts': [],
        'translation_quality': 'Unknown',
        'vocab_count': 0
    }

    # Check for vocabulary terms in standardized phrase
    for category, terms in vocabulary_keywords.items():
        found = [term for term in terms if term in standardized_phrase.lower()]
        if found:
            analysis['found_vocabulary'][category] = found

    # Check if key concepts were preserved from casual phrase
    key_concepts = {
        'tempo': any(word in casual_phrase.lower() for word in ['fast', 'slow', 'quick', 'laid-back']),
        'mood': any(word in casual_phrase.lower() for word in ['happy', 'sad', 'angry', 'chill', 'spooky']),
        'instruments': any(word in casual_phrase.lower() for word in ['guitar', 'drum', 'bass', 'synth', 'piano']),
        'genre hints': any(word in casual_phrase.lower() for word in ['hip-hop', 'metal', 'jazz', 'rock', 'electronic'])
    }

    for concept, present_in_casual in key_concepts.items():
        if present_in_casual:
            # Check if concept appears in standardized translation
            if concept == 'tempo' and any(word in standardized_phrase.lower() for word in ['tempo', 'energy', 'driving', 'laid-back']):
                analysis['preserved_concepts'].append(concept)
            elif concept == 'mood' and any(word in standardized_phrase.lower() for word in analysis['found_vocabulary'].get('Moods', [])):
                analysis['preserved_concepts'].append(concept)
            elif concept == 'instruments' and any(word in standardized_phrase.lower() for word in analysis['found_vocabulary'].get('Instruments', [])):
                analysis['preserved_concepts'].append(concept)
            elif concept == 'genre hints' and any(word in standardized_phrase.lower() for word in analysis['found_vocabulary'].get('Genres', [])):
                analysis['preserved_concepts'].append(concept)

    # Determine quality based on vocabulary usage
    vocab_count = sum(len(v) for v in analysis['found_vocabulary'].values())
    analysis['vocab_count'] = vocab_count

    if vocab_count >= 5:
        analysis['translation_quality'] = 'Excellent'
    elif vocab_count >= 3:
        analysis['translation_quality'] = 'Good'
    elif vocab_count >= 1:
        analysis['translation_quality'] = 'Fair'
    else:
        analysis['translation_quality'] = 'Poor'

    return analysis


# ============================================================================
# PHRASE ANALYSIS
# ============================================================================

def analyze_casual_phrases(phrases: List[str]) -> Dict[str, Any]:
    """Analyze the quality and diversity of casual phrase generation.

    Args:
        phrases: List of casual/creative phrases to analyze

    Returns:
        Dictionary with comprehensive analysis including:
        - total_phrases: Count of phrases analyzed
        - genre_indicators: Set of genres found
        - mood_indicators: Set of moods found
        - length_distribution: Distribution by word count
        - colloquialisms: List of casual terms used
        - has_metaphors: Indices of phrases with metaphors
        - has_scenarios: Indices of phrases with scenarios
    """
    analysis = {
        'total_phrases': len(phrases),
        'genre_indicators': set(),
        'mood_indicators': set(),
        'has_metaphors': [],
        'has_scenarios': [],
        'length_distribution': {
            'short': 0,    # < 10 words
            'medium': 0,   # 10-20 words
            'long': 0      # > 20 words
        },
        'colloquialisms': []
    }

    # Genre keywords
    genre_keywords = {
        'electronic': ['synth', 'electronic', 'techno', 'trance', 'dubstep', 'edm'],
        'rock': ['rock', 'guitar', 'metal', 'punk', 'grunge'],
        'hip_hop': ['hip-hop', 'hip hop', 'rap', 'beat', 'boom-bap'],
        'jazz': ['jazz', 'saxophone', 'bebop', 'swing'],
        'classical': ['orchestra', 'classical', 'symphony', 'baroque'],
        'folk': ['folk', 'acoustic', 'fingerpicked'],
        'pop': ['pop', 'catchy', 'bubblegum'],
        'r&b': ['r&b', 'soul', 'groove', 'motown']
    }

    # Mood keywords
    mood_keywords = {
        'happy': ['happy', 'joyful', 'cheerful', 'upbeat', 'uplifting'],
        'sad': ['sad', 'melancholic', 'mournful', 'weepy', 'heartbreaking'],
        'aggressive': ['aggressive', 'angry', 'violent', 'fierce', 'blistering'],
        'chill': ['chill', 'relaxed', 'laid-back', 'calm', 'peaceful'],
        'mysterious': ['mysterious', 'spooky', 'eerie', 'haunting', 'creepy'],
        'energetic': ['energetic', 'pumping', 'driving', 'frenetic', 'explosive']
    }

    # Colloquial terms
    colloquial_terms = ['banger', 'vibe', 'grimy', 'fat', 'sick', 'dope',
                       'fire', 'lit', 'slaps', 'chunky', 'nasty', 'filthy']

    # Scenario indicators
    scenario_patterns = [
        r'for a?\s+\w+', r'feels like', r'sounds like', r'perfect for',
        r'music for', r'theme for', r'at \d+\s*[AP]M', r'in a \w+'
    ]

    for i, phrase in enumerate(phrases):
        phrase_lower = phrase.lower()
        word_count = len(phrase.split())

        # Analyze length
        if word_count < 10:
            analysis['length_distribution']['short'] += 1
        elif word_count <= 20:
            analysis['length_distribution']['medium'] += 1
        else:
            analysis['length_distribution']['long'] += 1

        # Check for genres
        for genre, keywords in genre_keywords.items():
            if any(keyword in phrase_lower for keyword in keywords):
                analysis['genre_indicators'].add(genre)

        # Check for moods
        for mood, keywords in mood_keywords.items():
            if any(keyword in phrase_lower for keyword in keywords):
                analysis['mood_indicators'].add(mood)

        # Check for metaphors
        if any(word in phrase_lower for word in ['like a', 'sounds like', 'feels like']):
            analysis['has_metaphors'].append(i + 1)

        # Check for scenarios
        if any(re.search(pattern, phrase_lower) for pattern in scenario_patterns):
            analysis['has_scenarios'].append(i + 1)

        # Check for colloquialisms
        found_colloquialisms = [term for term in colloquial_terms if term in phrase_lower]
        if found_colloquialisms:
            analysis['colloquialisms'].extend(found_colloquialisms)

    return analysis


# ============================================================================
# PHRASE VALIDATION
# ============================================================================

def validate_phrase_length(phrase: str, min_words: int = 10, max_words: int = 30) -> Tuple[bool, int, str]:
    """Validate that a phrase has the correct word count.

    Args:
        phrase: Phrase to validate
        min_words: Minimum word count (default 10)
        max_words: Maximum word count (default 30)

    Returns:
        Tuple of (is_valid, word_count, message)
    """
    word_count = len(phrase.split())

    if word_count < min_words:
        return (False, word_count, f"Phrase too short ({word_count} < {min_words} words)")
    elif word_count > max_words:
        return (False, word_count, f"Phrase too long ({word_count} > {max_words} words)")
    else:
        return (True, word_count, f"Phrase length valid ({word_count} words)")


def extract_phrases_from_response(response_text: str) -> List[str]:
    """Extract numbered phrases from AI response text.

    Args:
        response_text: Raw response text from AI containing numbered phrases

    Returns:
        List of extracted phrases (without numbering)
    """
    phrases = []
    lines = response_text.split('\n')

    for line in lines:
        # Match lines starting with numbers followed by . or )
        if re.match(r'^\d+[\.\)]\s+', line):
            phrase = re.sub(r'^\d+[\.\)]\s+', '', line).strip()
            if phrase:
                phrases.append(phrase)

    return phrases


def parse_structured_json(json_text: str) -> Optional[Dict]:
    """Parse JSON from AI response, handling common formatting issues.

    Args:
        json_text: JSON string from AI response

    Returns:
        Parsed dictionary or None if parsing fails
    """
    try:
        return json.loads(json_text)
    except json.JSONDecodeError:
        # Try to extract JSON if wrapped in markdown code blocks
        json_match = re.search(r'```(?:json)?\s*(\{.*\})\s*```', json_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass
    return None


# ============================================================================
# FORMATTING HELPERS
# ============================================================================

def format_music_structure(structured_data: Dict) -> str:
    """Format structured music data for display.

    Args:
        structured_data: Dictionary with music structure

    Returns:
        Formatted string representation
    """
    lines = []
    lines.append(f"Genre: {structured_data.get('Genre', 'N/A')}")
    lines.append(f"Sub-genre: {structured_data.get('Sub-genre', 'N/A')}")
    lines.append(f"Mood: {', '.join(structured_data.get('Mood', []))}")
    lines.append(f"Energy: {', '.join(structured_data.get('Energy', []))}")
    lines.append(f"Texture: {', '.join(structured_data.get('Texture', []))}")

    # Format instruments
    for i in range(1, 4):  # Check up to 3 instruments
        inst_key = f"Featured Instrument {i}"
        if inst_key in structured_data:
            inst = structured_data[inst_key]
            descriptors = ', '.join(inst.get('Descriptors', []))
            lines.append(f"Featured Instrument {i}: [{inst.get('Instrument')}], "
                        f"[Role: {inst.get('Role')}], [Descriptors: {descriptors}]")

    # Format vocals if present
    if 'Vocals' in structured_data:
        vocals = structured_data['Vocals']
        descriptors = ', '.join(vocals.get('Descriptors', []))
        lines.append(f"Vocals: [{vocals.get('Presence')}], [Gender: {vocals.get('Gender')}], "
                    f"[Style: {vocals.get('Style')}], [Descriptors: {descriptors}]")

    return '\n'.join(lines)
