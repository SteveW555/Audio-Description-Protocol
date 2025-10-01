"""Test AI reverse phrase generation - converting natural language to structured JSON."""
import json
from adp_core.ai_clients.openai_client import OpenAIClient


def load_reverse_system_prompt():
    """Load the reverse system prompt from phrase-reverse-prompt.md."""
    with open('phrase-reverse-prompt.md', 'r') as f:
        content = f.read()
    return content.strip()


def test_phrase_to_structure():
    """Test converting natural language phrase to structured JSON."""

    # Load reverse system prompt
    system_prompt = load_reverse_system_prompt()

    # The natural language phrase to convert
    phrase = "A groovy mid-tempo boom-bap hip-hop track with a raw, grainy texture, featuring a tight, heavy beat and a jazzy, lofi sample underneath clear, rhythmic male rapping."

    print("\n" + "="*80)
    print("TESTING REVERSE PHRASE GENERATION (Natural Language -> Structure)")
    print("="*80)

    print("\n📝 Input Natural Language Phrase:")
    print(f'"{phrase}"')

    # Initialize OpenAI client
    client = OpenAIClient()

    # Call OpenAI with reverse prompt
    response = client.client.chat.completions.create(
        model=client.model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": phrase}
        ],
    )

    result = response.choices[0].message.content

    # Parse the JSON result
    try:
        structured_data = json.loads(result)
        print("\n📊 Generated Structure:")
        print(json.dumps(structured_data, indent=2))

        # Format in the requested style
        print("\n📋 Formatted Output:")
        print(f"Genre: {structured_data.get('Genre', 'N/A')}")
        print(f"Sub-genre: {structured_data.get('Sub-genre', 'N/A')}")
        print(f"Mood: {', '.join(structured_data.get('Mood', []))}")
        print(f"Energy: {', '.join(structured_data.get('Energy', []))}")
        print(f"Texture: {', '.join(structured_data.get('Texture', []))}")

        # Format instruments
        for i in range(1, 3):
            inst_key = f"Featured Instrument {i}"
            if inst_key in structured_data:
                inst = structured_data[inst_key]
                descriptors = ', '.join(inst.get('Descriptors', []))
                print(f"Featured Instrument {i}: [{inst.get('Instrument')}], [Role: {inst.get('Role')}], [Descriptors: {descriptors}]")

        # Format vocals if present
        if 'Vocals' in structured_data:
            vocals = structured_data['Vocals']
            descriptors = ', '.join(vocals.get('Descriptors', []))
            print(f"Vocals: [{vocals.get('Presence')}], [Gender: {vocals.get('Gender')}], [Style: {vocals.get('Style')}], [Descriptors: {descriptors}]")

    except json.JSONDecodeError as e:
        print(f"\n❌ Error: Response was not valid JSON")
        print(f"Raw response: {result}")
        print(f"Error details: {e}")

    print("\n" + "="*80)
    print("TEST COMPLETED")
    print("="*80)

    return result


if __name__ == "__main__":
    test_phrase_to_structure()