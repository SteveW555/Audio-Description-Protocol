"""Test AI phrase translation - converting casual language to standardized vocabulary."""
import json
from adp_core.ai_clients.openai_client import OpenAIClient


def load_translator_prompt():
    """Load the translator system prompt from phrase-translator-prompt.md."""
    with open('phrase-translator-prompt.md', 'r') as f:
        content = f.read()
    return content.strip()


def test_phrase_translation():
    """Test translating casual phrase to standardized vocabulary."""

    print("\n" + "="*80)
    print("TESTING PHRASE TRANSLATION (Casual -> Standardized Vocabulary)")
    print("="*80)

    # Initialize OpenAI client
    client = OpenAIClient()

    # Load translator prompt
    system_prompt = load_translator_prompt()

    # Test phrases
    test_phrases = [
        "Huge, sweeping orchestra music for a fantasy battle, with big horns and powerful strings.",
        "A really sad rock song with some weepy, distorted guitars and a slow, heavy beat.",
        "Sounds like it's from an 80s action movie, with a fast, pulsing synth bass and super bright keys.",
        "Super angry, fast metal with screaming vocals and guitars that sound like a chainsaw.",
        "A chill, jazzy beat for studying, with a smooth electric piano and a simple drum loop."
    ]

    for i, casual_phrase in enumerate(test_phrases, 1):
        print(f"\n{'='*40}")
        print(f"Test {i}")
        print(f"{'='*40}")

        print(f"\n🗣️ Casual Input:")
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

        print(f"\n📝 Standardized Output:")
        print(f'"{standardized_phrase}"')

        # Analyze the translation
        print(f"\n📊 Translation Analysis:")

        # Check for key vocabulary terms
        vocabulary_terms = {
            'Genres': ['electronic', 'rock', 'pop', 'hip_hop', 'jazz', 'classical', 'folk', 'soundtrack', 'ambient'],
            'Moods': ['epic', 'triumphant', 'melancholic', 'sad', 'aggressive', 'angry', 'relaxed', 'contemplative', 'heroic'],
            'Energy': ['soaring', 'sweeping', 'downtempo', 'low-energy', 'frenetic', 'high-energy', 'laid-back', 'chill', 'driving', 'propulsive'],
            'Instruments': ['strings', 'brass', 'electric_guitar', 'synthesizer', 'bass_synthesizer', 'electric_piano', 'drum_machine', 'drums']
        }

        found_terms = {}
        for category, terms in vocabulary_terms.items():
            found = [term for term in terms if term.lower() in standardized_phrase.lower()]
            if found:
                found_terms[category] = found

        for category, terms in found_terms.items():
            print(f"  • {category}: {', '.join(terms)}")

        # Check if it maintained the core concept
        if i == 1:  # The main test case
            key_elements = {
                'orchestral/film score': any(word in standardized_phrase.lower() for word in ['orchestral', 'film', 'score', 'soundtrack']),
                'epic/triumphant': any(word in standardized_phrase.lower() for word in ['epic', 'triumphant', 'heroic', 'majestic']),
                'strings': 'string' in standardized_phrase.lower(),
                'brass/horns': any(word in standardized_phrase.lower() for word in ['brass', 'horn']),
                'sweeping/soaring': any(word in standardized_phrase.lower() for word in ['sweeping', 'soaring', 'expansive'])
            }

            print(f"\n🎯 Key Elements Preserved:")
            for element, present in key_elements.items():
                status = "✅" if present else "❌"
                print(f"  {status} {element}")

    print("\n" + "="*80)
    print("TRANSLATION TEST COMPLETED")
    print("="*80)


if __name__ == "__main__":
    test_phrase_translation()