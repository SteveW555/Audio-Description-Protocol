"""Test AI phrase translation with random selection from phrase list.

Tests translation from casual phrases (colloquial/informal language)
to standardized phrases (ADP vocabulary).
"""
import random
from adp_core.ai_clients.openai_client import OpenAIClient
from adp_core.constants import CASUAL_PHRASES


def load_translator_prompt():
    """Load the translator system prompt from phrase-translator-prompt.md."""
    with open('phrase-translator-prompt.md', 'r') as f:
        content = f.read()
    return content.strip()


def analyze_translation(original, translated):
    """Analyze the quality of translation."""
    # Keywords that indicate good translation
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
        'translation_quality': 'Unknown'
    }

    # Check for vocabulary terms
    for category, terms in vocabulary_keywords.items():
        found = [term for term in terms if term in translated.lower()]
        if found:
            analysis['found_vocabulary'][category] = found

    # Check if key concepts were preserved
    key_concepts = {
        'tempo': any(word in original.lower() for word in ['fast', 'slow', 'quick', 'laid-back']),
        'mood': any(word in original.lower() for word in ['happy', 'sad', 'angry', 'chill', 'spooky']),
        'instruments': any(word in original.lower() for word in ['guitar', 'drum', 'bass', 'synth', 'piano']),
        'genre hints': any(word in original.lower() for word in ['hip-hop', 'metal', 'jazz', 'rock', 'electronic'])
    }

    for concept, present_in_original in key_concepts.items():
        if present_in_original:
            # Check if concept appears in translation
            if concept == 'tempo' and any(word in translated.lower() for word in ['tempo', 'energy', 'driving', 'laid-back']):
                analysis['preserved_concepts'].append(concept)
            elif concept == 'mood' and any(word in translated.lower() for word in analysis['found_vocabulary'].get('Moods', [])):
                analysis['preserved_concepts'].append(concept)
            elif concept == 'instruments' and any(word in translated.lower() for word in analysis['found_vocabulary'].get('Instruments', [])):
                analysis['preserved_concepts'].append(concept)
            elif concept == 'genre hints' and any(word in translated.lower() for word in analysis['found_vocabulary'].get('Genres', [])):
                analysis['preserved_concepts'].append(concept)

    # Determine quality
    vocab_count = sum(len(v) for v in analysis['found_vocabulary'].values())
    if vocab_count >= 5:
        analysis['translation_quality'] = 'Excellent'
    elif vocab_count >= 3:
        analysis['translation_quality'] = 'Good'
    elif vocab_count >= 1:
        analysis['translation_quality'] = 'Fair'
    else:
        analysis['translation_quality'] = 'Poor'

    return analysis


def test_random_phrase_translation(num_tests=5):
    """Test translation with randomly selected casual phrases.

    Args:
        num_tests: Number of casual phrases to test translation for
    """

    print("\n" + "="*80)
    print("RANDOM PHRASE TRANSLATION TEST")
    print(f"Testing {num_tests} randomly selected casual phrases from {len(CASUAL_PHRASES)} total")
    print("="*80)

    # Initialize OpenAI client
    client = OpenAIClient()

    # Load translator prompt
    system_prompt = load_translator_prompt()

    # Randomly select casual phrases
    selected_phrases = random.sample(CASUAL_PHRASES, min(num_tests, len(CASUAL_PHRASES)))

    results = []

    for i, casual_phrase in enumerate(selected_phrases, 1):
        print(f"\n{'='*40}")
        print(f"Test {i}/{num_tests}")
        print(f"{'='*40}")

        # Show phrase index from original list
        phrase_index = CASUAL_PHRASES.index(casual_phrase) + 1
        print(f"Phrase #{phrase_index} from list")

        print(f"\n🗣️ Casual Phrase Input:")
        print(f'"{casual_phrase}"')

        # Call OpenAI with translator prompt
        response = client.client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": casual_phrase}
            ],
        )

        standardized_phrase = response.choices[0].message.content.strip('"')

        print(f"\n📝 Standardized Phrase Output:")
        print(f'"{standardized_phrase}"')

        # Analyze the translation
        analysis = analyze_translation(casual_phrase, standardized_phrase)

        print(f"\n📊 Translation Analysis:")
        print(f"  • Quality: {analysis['translation_quality']}")

        if analysis['found_vocabulary']:
            print(f"  • Vocabulary found:")
            for category, terms in analysis['found_vocabulary'].items():
                print(f"    - {category}: {', '.join(terms)}")

        if analysis['preserved_concepts']:
            print(f"  • Preserved concepts: {', '.join(analysis['preserved_concepts'])}")

        results.append({
            'index': phrase_index,
            'quality': analysis['translation_quality'],
            'vocab_count': sum(len(v) for v in analysis['found_vocabulary'].values())
        })

    # Summary statistics
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)

    quality_counts = {}
    for result in results:
        quality = result['quality']
        quality_counts[quality] = quality_counts.get(quality, 0) + 1

    print("\nTranslation Quality Distribution:")
    for quality in ['Excellent', 'Good', 'Fair', 'Poor']:
        count = quality_counts.get(quality, 0)
        percentage = (count / len(results)) * 100
        bar = '█' * int(percentage / 5)
        print(f"  {quality:10} {count}/{len(results)} ({percentage:.0f}%) {bar}")

    avg_vocab = sum(r['vocab_count'] for r in results) / len(results)
    print(f"\nAverage vocabulary terms used: {avg_vocab:.1f}")

    print("\n" + "="*80)
    print("RANDOM TRANSLATION TEST COMPLETED")
    print("="*80)


if __name__ == "__main__":
    # Test with 5 random phrases by default
    import sys
    num_tests = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    test_random_phrase_translation(num_tests)