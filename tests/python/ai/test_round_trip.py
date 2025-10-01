"""Test round-trip conversion: Structure -> Phrase -> Structure."""
import json
import random
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


def generate_test_structure():
    """Generate a test music structure."""
    # Using a fixed structure for consistency in testing
    return {
        "Genre": "rock",
        "Sub-genre": "indie_rock",
        "Mood": ["uplifting", "nostalgic", "bright"],
        "Energy": ["steady", "driving"],
        "Texture": ["polished", "layered"],
        "Featured Instrument 1": {
            "Instrument": "electric_guitar",
            "Role": "melody",
            "Descriptors": ["bright", "reverberant"]
        },
        "Featured Instrument 2": {
            "Instrument": "drums",
            "Role": "rhythm",
            "Descriptors": ["crisp", "tight"]
        },
        "Vocals": {
            "Presence": "lead",
            "Gender": "female",
            "Style": "singing",
            "Descriptors": ["clear", "warm"]
        }
    }


def compare_structures(original, reconstructed):
    """Compare two structures and report differences."""
    differences = []

    # Check top-level keys
    for key in original:
        if key not in reconstructed:
            differences.append(f"Missing key: {key}")
        elif isinstance(original[key], list):
            orig_set = set(original[key])
            recon_set = set(reconstructed[key]) if key in reconstructed else set()
            if orig_set != recon_set:
                missing = orig_set - recon_set
                extra = recon_set - orig_set
                if missing:
                    differences.append(f"{key}: Missing values {missing}")
                if extra:
                    differences.append(f"{key}: Extra values {extra}")
        elif isinstance(original[key], dict):
            for subkey in original[key]:
                if key not in reconstructed or subkey not in reconstructed[key]:
                    differences.append(f"{key}.{subkey}: Missing")
                elif isinstance(original[key][subkey], list):
                    orig_set = set(original[key][subkey])
                    recon_set = set(reconstructed[key][subkey]) if key in reconstructed and subkey in reconstructed[key] else set()
                    if orig_set != recon_set:
                        missing = orig_set - recon_set
                        extra = recon_set - orig_set
                        if missing:
                            differences.append(f"{key}.{subkey}: Missing {missing}")
                        if extra:
                            differences.append(f"{key}.{subkey}: Extra {extra}")
                elif original[key][subkey] != reconstructed.get(key, {}).get(subkey):
                    differences.append(f"{key}.{subkey}: '{original[key][subkey]}' != '{reconstructed.get(key, {}).get(subkey)}'")
        else:
            if original[key] != reconstructed.get(key):
                differences.append(f"{key}: '{original[key]}' != '{reconstructed.get(key)}'")

    # Check for extra keys in reconstructed
    for key in reconstructed:
        if key not in original:
            differences.append(f"Extra key: {key}")

    return differences


def test_round_trip():
    """Test round-trip conversion from structure to phrase and back."""

    print("\n" + "="*80)
    print("ROUND-TRIP TEST: Structure -> Phrase -> Structure")
    print("="*80)

    # Initialize OpenAI client
    client = OpenAIClient()

    # Step 1: Generate original structure
    original_structure = generate_test_structure()
    print("\n📊 STEP 1: Original Structure")
    print(json.dumps(original_structure, indent=2))

    # Step 2: Convert structure to natural language phrase
    forward_prompt = load_forward_prompt()
    structure_json = json.dumps(original_structure, indent=2)

    print("\n🔄 STEP 2: Converting to Natural Language...")
    response = client.client.chat.completions.create(
        model=client.model,
        messages=[
            {"role": "system", "content": forward_prompt},
            {"role": "user", "content": structure_json}
        ],
    )

    generated_phrase = response.choices[0].message.content.strip('"')
    print(f"Generated Phrase: \"{generated_phrase}\"")

    # Step 3: Convert phrase back to structure
    reverse_prompt = load_reverse_prompt()

    print("\n🔄 STEP 3: Converting Back to Structure...")
    response = client.client.chat.completions.create(
        model=client.model,
        messages=[
            {"role": "system", "content": reverse_prompt},
            {"role": "user", "content": generated_phrase}
        ],
    )

    reconstructed_json = response.choices[0].message.content

    try:
        reconstructed_structure = json.loads(reconstructed_json)
        print("Reconstructed Structure:")
        print(json.dumps(reconstructed_structure, indent=2))

        # Step 4: Compare structures
        print("\n📈 STEP 4: Comparison Analysis")
        print("-" * 40)

        differences = compare_structures(original_structure, reconstructed_structure)

        if not differences:
            print("✅ PERFECT MATCH! The structure was fully preserved through the round-trip.")
        else:
            print("⚠️  Differences found:")
            for diff in differences:
                print(f"  • {diff}")

        # Calculate accuracy percentage
        total_items = sum(1 for _ in json.dumps(original_structure).split(':'))
        diff_count = len(differences)
        accuracy = max(0, (total_items - diff_count) / total_items * 100)
        print(f"\n📊 Approximate Accuracy: {accuracy:.1f}%")

    except json.JSONDecodeError as e:
        print(f"❌ Error: Could not parse reconstructed structure")
        print(f"Raw response: {reconstructed_json}")
        print(f"Error: {e}")

    print("\n" + "="*80)
    print("ROUND-TRIP TEST COMPLETED")
    print("="*80)


if __name__ == "__main__":
    test_round_trip()