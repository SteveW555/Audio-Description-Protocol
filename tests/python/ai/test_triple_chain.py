"""Test triple chain: Create phrase → Translate → Convert to structure."""
import json
from adp_core.ai_clients.openai_client import OpenAIClient


def load_creator_prompt_single():
    """Load and modify the creator prompt for single phrase generation."""
    with open('phrase-creator-prompt.md', 'r') as f:
        content = f.read()
    # Modify the last line to request just one phrase
    content = content.replace(
        "generate a list of **10 new and original** musical description phrases.",
        "generate **1 new and original** musical description phrase."
    )
    return content.strip()


def load_translator_prompt():
    """Load the translator system prompt."""
    with open('phrase-translator-prompt.md', 'r') as f:
        content = f.read()
    return content.strip()


def load_reverse_prompt():
    """Load the reverse system prompt."""
    with open('phrase-reverse-prompt.md', 'r') as f:
        content = f.read()
    return content.strip()


def test_triple_chain(num_tests=3):
    """Test the complete chain from creation to structure."""

    print("\n" + "="*80)
    print("TRIPLE CHAIN TEST: Create → Translate → Structure")
    print("="*80)

    # Initialize OpenAI client
    client = OpenAIClient()

    # Load all prompts
    creator_prompt = load_creator_prompt_single()
    translator_prompt = load_translator_prompt()
    reverse_prompt = load_reverse_prompt()

    for test_num in range(1, num_tests + 1):
        print(f"\n{'='*60}")
        print(f"TEST {test_num}/{num_tests}")
        print(f"{'='*60}")

        # Step 1: Generate creative phrase
        print("\n🎨 STEP 1: Generating Creative Phrase...")
        print("-" * 40)

        response = client.client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "system", "content": creator_prompt},
                {"role": "user", "content": "Generate 1 new creative music description phrase."}
            ],
        )

        creative_phrase = response.choices[0].message.content.strip()
        # Remove numbering if present
        if creative_phrase.startswith(('1.', '1)')):
            creative_phrase = creative_phrase[2:].strip()

        print(f"Generated: \"{creative_phrase}\"")

        # Step 2: Translate to standardized vocabulary
        print("\n📝 STEP 2: Translating to Standardized Vocabulary...")
        print("-" * 40)

        response = client.client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "system", "content": translator_prompt},
                {"role": "user", "content": creative_phrase}
            ],
        )

        standardized_phrase = response.choices[0].message.content.strip('"')
        print(f"Translated: \"{standardized_phrase}\"")

        # Step 3: Convert to structure
        print("\n📊 STEP 3: Converting to Structure...")
        print("-" * 40)

        response = client.client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "system", "content": reverse_prompt},
                {"role": "user", "content": standardized_phrase}
            ],
        )

        structure_json = response.choices[0].message.content

        try:
            structure = json.loads(structure_json)
            print("Structure Generated:")
            print(json.dumps(structure, indent=2))

            # Analysis of the chain
            print("\n📈 CHAIN ANALYSIS:")
            print("-" * 40)

            # Check what elements made it through the chain
            elements_preserved = []

            # Check for genre/subgenre
            if 'Genre' in structure:
                elements_preserved.append(f"Genre: {structure['Genre']}")
            if 'Sub-genre' in structure:
                elements_preserved.append(f"Sub-genre: {structure['Sub-genre']}")

            # Check for mood preservation
            if 'Mood' in structure and structure['Mood']:
                elements_preserved.append(f"Moods: {len(structure['Mood'])} terms")

            # Check for instruments
            instrument_count = 0
            for key in structure:
                if key.startswith('Featured Instrument'):
                    instrument_count += 1
            if instrument_count > 0:
                elements_preserved.append(f"Instruments: {instrument_count}")

            # Check for vocals
            if 'Vocals' in structure:
                elements_preserved.append("Vocals: Present")

            print("Elements preserved through chain:")
            for element in elements_preserved:
                print(f"  ✓ {element}")

            # Calculate complexity score
            complexity_score = 0
            complexity_score += 10 if 'Genre' in structure else 0
            complexity_score += 10 if 'Sub-genre' in structure else 0
            complexity_score += 15 if 'Mood' in structure and len(structure['Mood']) >= 2 else 5
            complexity_score += 15 if 'Energy' in structure and len(structure['Energy']) >= 2 else 5
            complexity_score += 15 if 'Texture' in structure and len(structure['Texture']) >= 2 else 5
            complexity_score += 15 * instrument_count
            complexity_score += 20 if 'Vocals' in structure else 0

            print(f"\nComplexity Score: {min(complexity_score, 100)}/100")

        except json.JSONDecodeError as e:
            print(f"❌ Error parsing structure: {e}")
            print(f"Raw output: {structure_json}")

    print("\n" + "="*80)
    print("TRIPLE CHAIN TEST COMPLETED")
    print("="*80)


if __name__ == "__main__":
    test_triple_chain(num_tests=3)