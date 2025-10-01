"""Test AI phrase generation with system prompt and randomized music descriptions."""
import random
import json
from adp_core.ai_clients.openai_client import OpenAIClient


def load_system_prompt():
    """Load the system prompt from phrase-prompt.md."""
    with open('phrase-prompt.md', 'r') as f:
        content = f.read()
    # Extract just the prompt part (between "### **LLM Prompt Start**" and "### **LLM Prompt End**")
    start_marker = "### **LLM Prompt Start**"
    end_marker = "### **LLM Prompt End**"
    start = content.find(start_marker) + len(start_marker)
    end = content.find(end_marker)
    return content[start:end].strip()


def generate_random_music_description():
    """Generate a randomized music description structure."""

    # Define possible values for each category
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


def test_phrase_generation_with_system_prompt():
    """Test AI phrase generation using system prompt and randomized description."""

    # Load system prompt
    system_prompt = load_system_prompt()

    # Generate random music description
    music_data = generate_random_music_description()

    print("\n" + "="*80)
    print("TESTING PHRASE GENERATION WITH SYSTEM PROMPT")
    print("="*80)

    print("\n📊 Generated Music Description:")
    print(json.dumps(music_data, indent=2))

    # Prepare the user prompt (just the JSON data)
    user_prompt = json.dumps(music_data, indent=2)

    # Initialize OpenAI client
    client = OpenAIClient()

    # Modify the client to use system prompt
    # We'll need to update the OpenAI client to support system prompts
    response = client.client.chat.completions.create(
        model=client.model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
    )

    phrase = response.choices[0].message.content

    print("\n🎵 Generated Natural Language Phrase:")
    print(f"'{phrase}'")

    # Verify the response
    assert phrase is not None
    assert len(phrase) > 0
    assert isinstance(phrase, str)

    # Check that it's roughly the right length (10-30 words guideline)
    word_count = len(phrase.split())
    print(f"\n📏 Word count: {word_count} words")

    if word_count < 10:
        print("⚠️  Warning: Phrase is shorter than recommended (< 10 words)")
    elif word_count > 30:
        print("⚠️  Warning: Phrase is longer than recommended (> 30 words)")
    else:
        print("✅ Phrase length is within recommended range (10-30 words)")

    print("\n" + "="*80)
    print("TEST COMPLETED SUCCESSFULLY")
    print("="*80)

    return phrase


def test_multiple_responses_same_structure():
    """Test AI with same structure 3 times to see response variation."""

    # Load system prompt
    system_prompt = load_system_prompt()

    # Use a fixed music description structure
    music_data = {
        "Genre": "electronic",
        "Sub-genre": "synthwave",
        "Mood": ["nostalgic", "dreamy", "melancholic"],
        "Energy": ["steady", "mid-tempo"],
        "Texture": ["polished", "synthetic", "reverberant"],
        "Featured Instrument 1": {
            "Instrument": "synthesizer",
            "Role": "melody",
            "Descriptors": ["warm", "analog", "soaring"]
        },
        "Featured Instrument 2": {
            "Instrument": "drum_machine",
            "Role": "rhythm",
            "Descriptors": ["punchy", "retro"]
        },
        "Vocals": {
            "Presence": "lead",
            "Gender": "female",
            "Style": "singing",
            "Descriptors": ["ethereal", "breathy"]
        }
    }

    print("\n" + "="*80)
    print("TESTING MULTIPLE RESPONSES WITH IDENTICAL STRUCTURE")
    print("="*80)

    print("\n📊 Fixed Music Description Structure:")
    print(json.dumps(music_data, indent=2))

    # Prepare the user prompt
    user_prompt = json.dumps(music_data, indent=2)

    # Initialize OpenAI client
    client = OpenAIClient()

    responses = []
    print("-" * 40)

    for i in range(3):
        response = client.client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
        )

        phrase = response.choices[0].message.content
        responses.append(phrase)
        print(f"\nResponse {i+1}:")
        print(f"'{phrase}'")

    print("\n" + "="*80)
    print("TEST COMPLETED SUCCESSFULLY")
    print("="*80)

    return responses


if __name__ == "__main__":
    # Run the multiple responses test
    test_multiple_responses_same_structure()