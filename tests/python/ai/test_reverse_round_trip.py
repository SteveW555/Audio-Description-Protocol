"""Test reverse round-trip conversion: Phrase -> Structure -> Phrase."""
import json
from adp_core.ai_clients.openai_client import OpenAIClient


def load_forward_prompt():
    """Load the forward system prompt from phrase-prompt.md."""
    with open('phrase-prompt.md', 'r') as f:
        content = f.read()
    # Extract just the prompt part (between "### **LLM Prompt Start**" and "### **LLM Prompt End**")
    start_marker = "### **LLM Prompt Start**"
    end_marker = "### **LLM Prompt End**"
    start = content.find(start_marker) + len(start_marker)
    end = content.find(end_marker)
    return content[start:end].strip()


def load_reverse_prompt():
    """Load the reverse system prompt from phrase-reverse-prompt.md."""
    with open('phrase-reverse-prompt.md', 'r') as f:
        content = f.read()
    return content.strip()


def compare_phrases(original, reconstructed):
    """Compare two phrases and identify key differences."""
    # Split into words for comparison
    orig_words = set(original.lower().replace(',', '').replace('.', '').split())
    recon_words = set(reconstructed.lower().replace(',', '').replace('.', '').split())

    missing = orig_words - recon_words
    added = recon_words - orig_words

    return missing, added


def test_reverse_round_trip():
    """Test reverse round-trip conversion from phrase to structure and back."""

    print("\n" + "="*80)
    print("REVERSE ROUND-TRIP TEST: Phrase -> Structure -> Phrase")
    print("="*80)

    # Initialize OpenAI client
    client = OpenAIClient()

    # Step 1: Start with an original phrase
    original_phrase = "A melancholic and dreamy synthwave track with a polished, reverberant texture, driven by warm analog synthesizer melodies, punchy retro drum machine rhythms, and ethereal, breathy female vocals."

    print("\n📝 STEP 1: Original Phrase")
    print(f'"{original_phrase}"')

    # Step 2: Convert phrase to structure
    reverse_prompt = load_reverse_prompt()

    print("\n🔄 STEP 2: Converting to Structure...")
    response = client.client.chat.completions.create(
        model=client.model,
        messages=[
            {"role": "system", "content": reverse_prompt},
            {"role": "user", "content": original_phrase}
        ],
    )

    structure_json = response.choices[0].message.content

    try:
        extracted_structure = json.loads(structure_json)
        print("Extracted Structure:")
        print(json.dumps(extracted_structure, indent=2))

        # Step 3: Convert structure back to phrase
        forward_prompt = load_forward_prompt()

        print("\n🔄 STEP 3: Converting Back to Phrase...")
        response = client.client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "system", "content": forward_prompt},
                {"role": "user", "content": json.dumps(extracted_structure, indent=2)}
            ],
        )

        reconstructed_phrase = response.choices[0].message.content.strip('"')
        print(f'Reconstructed Phrase: "{reconstructed_phrase}"')

        # Step 4: Compare phrases
        print("\n📈 STEP 4: Phrase Comparison")
        print("-" * 40)

        print("\n📊 Side-by-Side Comparison:")
        print("\nORIGINAL:")
        print(f'"{original_phrase}"')
        print("\nRECONSTRUCTED:")
        print(f'"{reconstructed_phrase}"')

        # Word-level analysis
        missing_words, added_words = compare_phrases(original_phrase, reconstructed_phrase)

        print("\n📋 Word Analysis:")
        if missing_words:
            print(f"Words lost: {', '.join(sorted(missing_words))}")
        else:
            print("No words lost ✅")

        if added_words:
            print(f"Words added: {', '.join(sorted(added_words))}")
        else:
            print("No words added ✅")

        # Calculate similarity
        orig_words = set(original_phrase.lower().split())
        recon_words = set(reconstructed_phrase.lower().split())
        common_words = orig_words & recon_words
        all_words = orig_words | recon_words
        similarity = len(common_words) / len(all_words) * 100 if all_words else 0

        print(f"\n📊 Word Similarity: {similarity:.1f}%")

        # Check key musical elements
        print("\n🎵 Key Elements Preserved:")
        elements = {
            "synthwave": "synthwave" in reconstructed_phrase.lower(),
            "melancholic": "melancholic" in reconstructed_phrase.lower(),
            "dreamy": "dreamy" in reconstructed_phrase.lower(),
            "polished": "polished" in reconstructed_phrase.lower(),
            "reverberant": "reverberant" in reconstructed_phrase.lower(),
            "synthesizer": "synth" in reconstructed_phrase.lower(),
            "drum machine": "drum" in reconstructed_phrase.lower(),
            "female vocals": "female" in reconstructed_phrase.lower()
        }

        for element, preserved in elements.items():
            status = "✅" if preserved else "❌"
            print(f"  {status} {element}")

    except json.JSONDecodeError as e:
        print(f"❌ Error: Could not parse extracted structure")
        print(f"Raw response: {structure_json}")
        print(f"Error: {e}")

    print("\n" + "="*80)
    print("REVERSE ROUND-TRIP TEST COMPLETED")
    print("="*80)


if __name__ == "__main__":
    test_reverse_round_trip()