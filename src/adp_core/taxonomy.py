"""
Comprehensive audio taxonomy system for mood, energy, and texture descriptors.

CURRENT STATUS: This is a STUB/SKELETON implementation with only ~60 sample terms.
The complete 479-term taxonomy lives in the TypeScript wizard UI and is the current
source of truth for the working application.

PURPOSE OF THIS FILE:
    - Future backend validation via FastAPI endpoints
    - AI/ML model integration for automatic description generation
    - Python-based tooling (testing, training data, model outputs)
    - Data model validation for musical annotations

WHY IT'S INCOMPLETE BUT THE APP STILL WORKS:
    - The TypeScript wizard UI has the complete taxonomy and runs independently
    - The wizard doesn't currently call the Python backend for taxonomy data
    - This stub provides minimal validation for future backend services
    - It's aspirational infrastructure for when ML models consume/generate descriptions

TODO: Extract complete taxonomy from TypeScript and populate TAXONOMY_TERMS and
TAXONOMY_HIERARCHY with all 479 terms across all Mood, Energy, and Texture categories.
"""

from enum import Enum
from typing import Dict, List, Optional, Set, Literal
from pydantic import BaseModel, Field


class QualityCategory(str, Enum):
    """Main taxonomy categories."""
    MOOD = "Mood"
    ENERGY = "Energy"
    TEXTURE = "Texture"


class Frequency(str, Enum):
    """Term frequency/rarity indicators."""
    RARE = "rare"
    INFREQUENT = "infrequent"
    FREQUENT = "frequent"
    UBIQUITOUS = "ubiquitous"


class TermDefinition(BaseModel):
    """Individual taxonomy term definition."""

    id: str = Field(description="Stable slug identifier (lowercase, hyphens)")
    term: str = Field(description="Display string")
    freq: Frequency = Field(description="Rarity signal")
    desc: str = Field(description="Concise description in this category's sense")
    figurative: Optional[bool] = Field(None, description="Metaphorical by nature")
    aliases: Optional[List[str]] = Field(None, description="Synonyms/near-synonyms")
    examples: Optional[List[str]] = Field(None, description="Optional short examples")
    sources: Optional[List[str]] = Field(None, description="Optional notes/urls")
    meta: Optional[Dict[str, any]] = Field(None, description="Additional metadata")


# Complete 479-term taxonomy registry
# NOTE: Currently only contains ~60 sample Mood terms as a stub.
# TODO: Add remaining ~420 terms (rest of Mood, all Energy, all Texture categories)
TAXONOMY_TERMS: Dict[str, TermDefinition] = {
    # ==================== Mood ====================
    # Positive / Uplifting
    'upbeat': TermDefinition(id='upbeat', term='upbeat', freq=Frequency.UBIQUITOUS, desc='Cheerful, lively mood—often mid/fast tempo and major-harmony.'),
    'energetic-mood': TermDefinition(id='energetic-mood', term='energetic', freq=Frequency.UBIQUITOUS, desc='Vital, excited feeling; overlaps with Energy but here denotes affect.'),
    'joyful': TermDefinition(id='joyful', term='joyful', freq=Frequency.UBIQUITOUS, desc='Clearly happy and celebratory in feeling.'),
    'happy': TermDefinition(id='happy', term='happy', freq=Frequency.FREQUENT, desc='Pleasant, contented, lighthearted mood.'),
    'cheerful': TermDefinition(id='cheerful', term='cheerful', freq=Frequency.FREQUENT, desc='Bright, pleasant, and mood-lifting.'),
    'uplifting': TermDefinition(id='uplifting', term='uplifting', freq=Frequency.FREQUENT, desc='Inspiring and elevating; leaves a hopeful afterglow.'),
    'positive-mood': TermDefinition(id='positive-mood', term='positive', freq=Frequency.UBIQUITOUS, desc='Overall optimistic or constructive feeling.'),
    'hopeful': TermDefinition(id='hopeful', term='hopeful', freq=Frequency.FREQUENT, desc='Gently confident that good outcomes await.'),
    'playful': TermDefinition(id='playful', term='playful', freq=Frequency.FREQUENT, desc='Light-hearted, fun, and quirky.'),
    'romantic': TermDefinition(id='romantic', term='romantic', freq=Frequency.FREQUENT, desc='Loving, passionate; tender emotional focus.'),
    'sentimental': TermDefinition(id='sentimental', term='sentimental', freq=Frequency.FREQUENT, desc='Nostalgic, tender, emotionally evocative.'),
    'triumphant': TermDefinition(id='triumphant', term='triumphant', freq=Frequency.FREQUENT, desc='Victorious, celebratory, often climactic.'),
    'heroic': TermDefinition(id='heroic', term='heroic', freq=Frequency.FREQUENT, desc='Bold, valiant, evokes courage and resolve.'),
    'optimistic': TermDefinition(id='optimistic', term='optimistic', freq=Frequency.FREQUENT, desc='Forward-looking confidence and positivity.'),
    'euphoric': TermDefinition(id='euphoric', term='euphoric', freq=Frequency.INFREQUENT, desc='Intense, overwhelming happiness or excitement.'),
    'exuberant': TermDefinition(id='exuberant', term='exuberant', freq=Frequency.FREQUENT, desc='Highly lively and effusively cheerful.'),
    'ecstatic': TermDefinition(id='ecstatic', term='ecstatic', freq=Frequency.INFREQUENT, desc='Overwhelming joyful excitement.'),
    'elated': TermDefinition(id='elated', term='elated', freq=Frequency.INFREQUENT, desc='Extremely happy and exhilarated.'),
    'celebratory': TermDefinition(id='celebratory', term='celebratory', freq=Frequency.INFREQUENT, desc='Marked by festivity and celebration.'),
    'festive': TermDefinition(id='festive', term='festive', freq=Frequency.INFREQUENT, desc='Cheerful mood associated with holidays/events.'),
    'inspiring': TermDefinition(id='inspiring', term='inspiring', freq=Frequency.INFREQUENT, desc='Evokes motivation, uplift, or awe.'),
    'sparkly-mood': TermDefinition(id='sparkly-mood', term='sparkly', freq=Frequency.RARE, desc='Glittering, lively mood coloration.', figurative=True),

    # Calm / Peaceful
    'peaceful': TermDefinition(id='peaceful', term='peaceful', freq=Frequency.UBIQUITOUS, desc='Serene and undisturbed; invites calm.'),
    'calm': TermDefinition(id='calm', term='calm', freq=Frequency.UBIQUITOUS, desc='Peaceful, unagitated, often slow and soft.'),
    'relaxed': TermDefinition(id='relaxed', term='relaxed', freq=Frequency.UBIQUITOUS, desc='Easy-going, unhurried, comfortable.'),
    'serene': TermDefinition(id='serene', term='serene', freq=Frequency.FREQUENT, desc='Calm, peaceful, and untroubled.'),
    'dreamy': TermDefinition(id='dreamy', term='dreamy', freq=Frequency.FREQUENT, desc='Soft, drifting, hazy; lull-like.'),
    'tranquil': TermDefinition(id='tranquil', term='tranquil', freq=Frequency.FREQUENT, desc='Very calm; stillness and quietude.'),
    'meditative': TermDefinition(id='meditative', term='meditative', freq=Frequency.FREQUENT, desc='Contemplative, repetitive, induces reflection.'),
    'soothing': TermDefinition(id='soothing', term='soothing', freq=Frequency.FREQUENT, desc='Comforting, tension-reducing, gentle.'),
    'gentle': TermDefinition(id='gentle', term='gentle', freq=Frequency.FREQUENT, desc='Mild, tender, and soft in character.'),
    'contemplative': TermDefinition(id='contemplative', term='contemplative', freq=Frequency.INFREQUENT, desc='Invites reflection and inward focus.'),
    'restful': TermDefinition(id='restful', term='restful', freq=Frequency.INFREQUENT, desc='Encourages rest; soothing calm.'),
    'ethereal-mood': TermDefinition(id='ethereal-mood', term='ethereal', freq=Frequency.INFREQUENT, desc='Delicate, light, beyond the ordinary; mood sense.', figurative=True),
    'atmospheric-mood': TermDefinition(id='atmospheric-mood', term='atmospheric', freq=Frequency.INFREQUENT, desc='Immersive calm ambience as a mood state.'),
    'flowing-mood': TermDefinition(id='flowing-mood', term='flowing', freq=Frequency.INFREQUENT, desc='Gently continuous, smooth emotional movement.'),
    'smooth-mood': TermDefinition(id='smooth-mood', term='smooth', freq=Frequency.FREQUENT, desc='Even, unruffled feeling; no sharp changes.'),
    'gossamer-mood': TermDefinition(id='gossamer-mood', term='gossamer', freq=Frequency.RARE, desc='Extremely light/delicate emotional hue.', figurative=True),

    # Dark / Negative
    'dark-mood': TermDefinition(id='dark-mood', term='dark', freq=Frequency.UBIQUITOUS, desc='Somber or ominous overall emotional cast (mood sense).'),
    'melancholic': TermDefinition(id='melancholic', term='melancholic', freq=Frequency.FREQUENT, desc='Pensive sadness; beautiful gloom.'),
    'sad': TermDefinition(id='sad', term='sad', freq=Frequency.UBIQUITOUS, desc='Plainly unhappy or sorrowful mood.'),
    'somber': TermDefinition(id='somber', term='somber', freq=Frequency.FREQUENT, desc='Grave, serious, darkly quiet.'),
    'brooding': TermDefinition(id='brooding', term='brooding', freq=Frequency.FREQUENT, desc='Heavy, simmering darkness; inward tension.'),
    'mournful': TermDefinition(id='mournful', term='mournful', freq=Frequency.FREQUENT, desc='Expressing grief or loss.'),
    'gloomy': TermDefinition(id='gloomy', term='gloomy', freq=Frequency.FREQUENT, desc='Oppressively dark or dejected.'),
    'haunting': TermDefinition(id='haunting', term='haunting', freq=Frequency.FREQUENT, desc='Eerily evocative; lingers in memory.'),
    'moody': TermDefinition(id='moody', term='moody', freq=Frequency.FREQUENT, desc='Darkly expressive; emotionally changeable.'),
    'desolate': TermDefinition(id='desolate', term='desolate', freq=Frequency.INFREQUENT, desc='Bleak emptiness; abandoned feeling.'),
    'forlorn': TermDefinition(id='forlorn', term='forlorn', freq=Frequency.INFREQUENT, desc='Pitifully sad and abandoned.'),
    'wistful': TermDefinition(id='wistful', term='wistful', freq=Frequency.INFREQUENT, desc='Reflective longing; gentle sadness.'),
    'tragic': TermDefinition(id='tragic', term='tragic', freq=Frequency.INFREQUENT, desc='Marked by extreme distress or sorrow.'),
    'lonely': TermDefinition(id='lonely', term='lonely', freq=Frequency.INFREQUENT, desc='Evokes isolation and solitude.'),
    'ominous': TermDefinition(id='ominous', term='ominous', freq=Frequency.INFREQUENT, desc='Foreboding; signals approaching threat.'),
    'disturbing': TermDefinition(id='disturbing', term='disturbing', freq=Frequency.INFREQUENT, desc='Causes unease or psychological discomfort.'),
    'shadowy-mood': TermDefinition(id='shadowy-mood', term='shadowy', freq=Frequency.RARE, desc='Suggests obscurity or lurking darkness.'),
    'plaintive': TermDefinition(id='plaintive', term='plaintive', freq=Frequency.RARE, desc='Sounding sad and mournful.'),
    'negative-mood': TermDefinition(id='negative-mood', term='negative', freq=Frequency.FREQUENT, desc='Overall pessimistic or destructive feeling.'),

    # Continue with remaining terms... (truncating for brevity, but would include all 479 terms)
    # [Energy and Texture terms would follow the same pattern]
}


# Hierarchical organization
# NOTE: Currently only contains 3 Mood subcategories as a stub.
# TODO: Add remaining Mood subcategories, all Energy subcategories, all Texture subcategories
TAXONOMY_HIERARCHY: Dict[QualityCategory, Dict[str, List[str]]] = {
    QualityCategory.MOOD: {
        'Positive / Uplifting': [
            'upbeat', 'energetic', 'joyful', 'happy', 'cheerful', 'uplifting', 'positive',
            'hopeful', 'playful', 'romantic', 'sentimental', 'triumphant', 'heroic', 'optimistic',
            'euphoric', 'exuberant', 'ecstatic', 'elated', 'celebratory', 'festive', 'inspiring', 'sparkly-mood'
        ],
        'Calm / Peaceful': [
            'peaceful', 'calm', 'relaxed', 'serene', 'dreamy', 'tranquil', 'meditative', 'soothing',
            'gentle', 'contemplative', 'restful', 'ethereal-mood', 'atmospheric-mood', 'flowing-mood',
            'smooth-mood', 'gossamer-mood'
        ],
        'Dark / Negative': [
            'dark-mood', 'melancholic', 'sad', 'somber', 'brooding', 'mournful', 'gloomy', 'haunting',
            'moody', 'desolate', 'forlorn', 'wistful', 'tragic', 'lonely', 'ominous', 'disturbing',
            'shadowy-mood', 'plaintive', 'negative-mood'
        ],
        # Additional mood categories would be added here...
    },
    # Energy and Texture categories would follow...
}


class TaxonomyValidator:
    """Validates taxonomy terms and provides lookup utilities."""

    @staticmethod
    def is_valid_term(term_id: str) -> bool:
        """Check if term ID exists in taxonomy."""
        return term_id in TAXONOMY_TERMS

    @staticmethod
    def get_term(term_id: str) -> Optional[TermDefinition]:
        """Get term definition by ID."""
        return TAXONOMY_TERMS.get(term_id)

    @staticmethod
    def get_terms_by_category(category: QualityCategory) -> List[TermDefinition]:
        """Get all terms for a specific category."""
        if category not in TAXONOMY_HIERARCHY:
            return []

        term_ids = []
        for cluster_terms in TAXONOMY_HIERARCHY[category].values():
            term_ids.extend(cluster_terms)

        return [TAXONOMY_TERMS[term_id] for term_id in term_ids if term_id in TAXONOMY_TERMS]

    @staticmethod
    def get_terms_by_frequency(freq: Frequency) -> List[TermDefinition]:
        """Get all terms with specific frequency."""
        return [term for term in TAXONOMY_TERMS.values() if term.freq == freq]

    @staticmethod
    def validate_term_list(term_ids: List[str]) -> List[str]:
        """Validate a list of term IDs, return list of valid ones."""
        return [term_id for term_id in term_ids if TaxonomyValidator.is_valid_term(term_id)]


class SemanticAttributes(BaseModel):
    """Semantic attributes using validated taxonomy terms."""

    mood: List[str] = Field(
        default_factory=list,
        description="Mood descriptors from taxonomy"
    )

    energy: List[str] = Field(
        default_factory=list,
        description="Energy descriptors from taxonomy"
    )

    texture: List[str] = Field(
        default_factory=list,
        description="Texture descriptors from taxonomy"
    )

    def validate_terms(self) -> Dict[str, List[str]]:
        """Validate all terms against taxonomy and return invalid ones."""
        invalid_terms = {}

        for category in ['mood', 'energy', 'texture']:
            terms = getattr(self, category, [])
            invalid = [term for term in terms if not TaxonomyValidator.is_valid_term(term)]
            if invalid:
                invalid_terms[category] = invalid

        return invalid_terms

    def get_term_definitions(self) -> Dict[str, List[TermDefinition]]:
        """Get term definitions for all semantic attributes."""
        return {
            'mood': [TaxonomyValidator.get_term(term) for term in self.mood if TaxonomyValidator.is_valid_term(term)],
            'energy': [TaxonomyValidator.get_term(term) for term in self.energy if TaxonomyValidator.is_valid_term(term)],
            'texture': [TaxonomyValidator.get_term(term) for term in self.texture if TaxonomyValidator.is_valid_term(term)]
        }


# Convenience functions
def get_mood_terms() -> List[TermDefinition]:
    """Get all mood taxonomy terms."""
    return TaxonomyValidator.get_terms_by_category(QualityCategory.MOOD)


def get_energy_terms() -> List[TermDefinition]:
    """Get all energy taxonomy terms."""
    return TaxonomyValidator.get_terms_by_category(QualityCategory.ENERGY)


def get_texture_terms() -> List[TermDefinition]:
    """Get all texture taxonomy terms."""
    return TaxonomyValidator.get_terms_by_category(QualityCategory.TEXTURE)


def validate_semantic_terms(mood: List[str] = None, energy: List[str] = None, texture: List[str] = None) -> bool:
    """Quick validation of semantic term lists."""
    terms_to_check = []
    if mood:
        terms_to_check.extend(mood)
    if energy:
        terms_to_check.extend(energy)
    if texture:
        terms_to_check.extend(texture)

    return all(TaxonomyValidator.is_valid_term(term) for term in terms_to_check)