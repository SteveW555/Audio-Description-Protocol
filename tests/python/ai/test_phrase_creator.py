"""Test AI phrase creation - generating creative music descriptions."""
import re
from adp_core.ai_clients.openai_client import OpenAIClient


def load_creator_prompt():
    """Load the creator system prompt from phrase-creator-prompt.md."""
    with open('phrase-creator-prompt.md', 'r') as f:
        content = f.read()
    return content.strip()


def analyze_generated_phrases(phrases):
    """Analyze the quality and diversity of generated phrases."""

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

        # Check length
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

        # Check for metaphors (words like "like", "sounds like", "feels like")
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


def test_phrase_creation(num_batches=3):
    """Test generating creative music description phrases."""

    print("\n" + "="*80)
    print("TESTING PHRASE CREATION (Generating Creative Descriptions)")
    print("="*80)

    # Initialize OpenAI client
    client = OpenAIClient()

    # Load creator prompt
    system_prompt = load_creator_prompt()

    all_phrases = []

    for batch_num in range(1, num_batches + 1):
        print(f"\n🎵 Batch {batch_num}/{num_batches}: Generating 10 phrases...")
        print("-" * 40)

        # Call OpenAI to generate phrases
        response = client.client.chat.completions.create(
            model=client.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate 10 new creative music description phrases."}
            ],
        )

        generated_text = response.choices[0].message.content

        # Extract numbered phrases (handles various numbering formats)
        phrases = []
        lines = generated_text.split('\n')
        for line in lines:
            # Match lines starting with numbers followed by . or )
            if re.match(r'^\d+[\.\)]\s+', line):
                phrase = re.sub(r'^\d+[\.\)]\s+', '', line).strip()
                if phrase:
                    phrases.append(phrase)

        # Display the generated phrases
        for i, phrase in enumerate(phrases, 1):
            print(f"{i}. {phrase}")

        all_phrases.extend(phrases)

    # Analyze all generated phrases
    print("\n" + "="*80)
    print("ANALYSIS OF GENERATED PHRASES")
    print("="*80)

    analysis = analyze_generated_phrases(all_phrases)

    print(f"\n📊 Generation Statistics:")
    print(f"  • Total phrases generated: {analysis['total_phrases']}")

    print(f"\n📈 Length Distribution:")
    total = sum(analysis['length_distribution'].values())
    for length_type, count in analysis['length_distribution'].items():
        percentage = (count / total * 100) if total > 0 else 0
        bar = '█' * int(percentage / 5)
        print(f"  • {length_type:6} (<10/10-20/>20 words): {count:2}/{total} ({percentage:.0f}%) {bar}")

    print(f"\n🎼 Genre Diversity:")
    if analysis['genre_indicators']:
        print(f"  • Genres covered: {', '.join(sorted(analysis['genre_indicators']))}")
    else:
        print("  • No specific genres identified")

    print(f"\n😊 Mood Variety:")
    if analysis['mood_indicators']:
        print(f"  • Moods expressed: {', '.join(sorted(analysis['mood_indicators']))}")
    else:
        print("  • No specific moods identified")

    print(f"\n✨ Creative Elements:")
    if analysis['has_metaphors']:
        print(f"  • Phrases with metaphors: {len(analysis['has_metaphors'])} (phrases #{', '.join(map(str, analysis['has_metaphors'][:5]))}{'...' if len(analysis['has_metaphors']) > 5 else ''})")
    if analysis['has_scenarios']:
        print(f"  • Phrases with scenarios: {len(analysis['has_scenarios'])} (phrases #{', '.join(map(str, analysis['has_scenarios'][:5]))}{'...' if len(analysis['has_scenarios']) > 5 else ''})")
    if analysis['colloquialisms']:
        unique_colloquialisms = list(set(analysis['colloquialisms']))
        print(f"  • Colloquial terms used: {', '.join(unique_colloquialisms[:10])}{'...' if len(unique_colloquialisms) > 10 else ''}")

    # Quality assessment
    print(f"\n🏆 Overall Quality Assessment:")
    quality_score = 0
    quality_factors = []

    if analysis['total_phrases'] >= num_batches * 8:  # At least 8 phrases per batch
        quality_score += 25
        quality_factors.append("✅ Good quantity")

    if len(analysis['genre_indicators']) >= 3:
        quality_score += 25
        quality_factors.append("✅ Genre diversity")

    if len(analysis['mood_indicators']) >= 3:
        quality_score += 25
        quality_factors.append("✅ Mood variety")

    if len(analysis['has_metaphors']) >= 5 or len(analysis['has_scenarios']) >= 5:
        quality_score += 25
        quality_factors.append("✅ Creative language")

    print(f"  • Quality Score: {quality_score}/100")
    for factor in quality_factors:
        print(f"    {factor}")

    print("\n" + "="*80)
    print("PHRASE CREATION TEST COMPLETED")
    print("="*80)

    return all_phrases


if __name__ == "__main__":
    # Test with 2 batches (20 phrases total)
    test_phrase_creation(num_batches=2)