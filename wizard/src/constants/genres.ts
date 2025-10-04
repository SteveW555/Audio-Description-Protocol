export const GENRES = {
    primary_genres: ['Electronic', 'Rock', 'Pop', 'Hip-Hop', 'R&B / Soul', 'Jazz', 'Blues', 'Country', 'Classical', 'Folk', 'Latin', 'Reggae', 'World', 'Soundtrack', 'Ambient', 'Spoken Word', 'Sound Effect'],
    secondary_genres: {
        electronic: ['dance', 'disco', 'downtempo', 'drum_and_bass', 'edm', 'glitch', 'house', 'idm', 'synthwave', 'techno', 'trance', 'chiptune'],
        rock: ['alternative_rock', 'goth_rock', 'indie_rock', 'metal', 'post-rock', 'progressive_rock', 'psychedelic_rock', 'punk_rock', 'surf_rock'],
        pop: ['art_pop', 'bubblegum_pop', 'dance-pop', 'dream_pop', 'euro_pop', 'hyperpop', 'indie_pop', 'jangle_pop', 'synth-pop'],
        hip_hop: ['abstract_hip_hop', 'boom-bap', 'cloud_rap', 'conscious_hip_hop', 'drill', 'g_funk', 'gangsta_rap', 'lo-fi_hip_hop', 'trap'],
        rnb_soul: ['contemporary_rnb', 'funk', 'motown', 'neo-soul', 'philly_soul', 'psychedelic_soul', 'quiet_storm'],
        jazz: ['acid_jazz', 'bebop', 'cool_jazz', 'free_jazz', 'jazz_fusion', 'latin_jazz', 'modal_jazz', 'swing'],
        blues: ['acoustic_blues', 'chicago_blues', 'delta_blues', 'electric_blues'],
        country: ['americana', 'bakersfield_sound', 'bluegrass', 'honky_tonk', 'outlaw_country'],
        classical: ['baroque', 'classical_period', 'contemporary_classical', 'minimalism', 'orchestral', 'romantic_era'],
        folk: ['americana', 'anti-folk', 'bluegrass', 'folk-rock', 'freak_folk', 'neofolk', 'singer-songwriter', 'traditional_folk'],
        latin: ['bachata', 'bossa_nova', 'cumbia', 'reggaeton', 'salsa'],
        reggae: ['dancehall', 'dub', 'rocksteady', 'ska'],
        world: ['afrobeat', 'celtic', 'flamenco'],
        soundtrack: ['cinematic', 'epic_score', 'film_score', 'video_game_music'],
        ambient: ['dark_ambient', 'drone', 'soundscape', 'space_music'],
        spoken_word: ['audiobook', 'comedy', 'podcast', 'poetry'],
        sound_effect: ['abstract_sound', 'creature_sound', 'field_recording', 'foley', 'weather'],
    },
};

/**
 * OPTION A: Subgenre → Primary Genre Mapping
 * LLM picks subgenre, you trivially map to primary genre
 */
export const SUBGENRE_TO_GENRE: Record<string, string> = {
    // Electronic
    'dance': 'Electronic',
    'disco': 'Electronic',
    'downtempo': 'Electronic',
    'drum_and_bass': 'Electronic',
    'edm': 'Electronic',
    'glitch': 'Electronic',
    'house': 'Electronic',
    'idm': 'Electronic',
    'synthwave': 'Electronic',
    'techno': 'Electronic',
    'trance': 'Electronic',
    'chiptune': 'Electronic',

    // Rock
    'alternative_rock': 'Rock',
    'goth_rock': 'Rock',
    'indie_rock': 'Rock',
    'metal': 'Rock',
    'post-rock': 'Rock',
    'progressive_rock': 'Rock',
    'psychedelic_rock': 'Rock',
    'punk_rock': 'Rock',
    'surf_rock': 'Rock',

    // Pop
    'art_pop': 'Pop',
    'bubblegum_pop': 'Pop',
    'dance-pop': 'Pop',
    'dream_pop': 'Pop',
    'euro_pop': 'Pop',
    'hyperpop': 'Pop',
    'indie_pop': 'Pop',
    'jangle_pop': 'Pop',
    'synth-pop': 'Pop',

    // Hip-Hop
    'abstract_hip_hop': 'Hip-Hop',
    'boom-bap': 'Hip-Hop',
    'cloud_rap': 'Hip-Hop',
    'conscious_hip_hop': 'Hip-Hop',
    'drill': 'Hip-Hop',
    'g_funk': 'Hip-Hop',
    'gangsta_rap': 'Hip-Hop',
    'lo-fi_hip_hop': 'Hip-Hop',
    'trap': 'Hip-Hop',

    // R&B / Soul
    'contemporary_rnb': 'R&B / Soul',
    'funk': 'R&B / Soul',
    'motown': 'R&B / Soul',
    'neo-soul': 'R&B / Soul',
    'philly_soul': 'R&B / Soul',
    'psychedelic_soul': 'R&B / Soul',
    'quiet_storm': 'R&B / Soul',

    // Jazz
    'acid_jazz': 'Jazz',
    'bebop': 'Jazz',
    'cool_jazz': 'Jazz',
    'free_jazz': 'Jazz',
    'jazz_fusion': 'Jazz',
    'latin_jazz': 'Jazz',
    'modal_jazz': 'Jazz',
    'swing': 'Jazz',

    // Blues
    'acoustic_blues': 'Blues',
    'chicago_blues': 'Blues',
    'delta_blues': 'Blues',
    'electric_blues': 'Blues',

    // Country
    'americana': 'Country', // Note: also appears in Folk
    'bakersfield_sound': 'Country',
    'bluegrass': 'Country', // Note: also appears in Folk
    'honky_tonk': 'Country',
    'outlaw_country': 'Country',

    // Classical
    'baroque': 'Classical',
    'classical_period': 'Classical',
    'contemporary_classical': 'Classical',
    'minimalism': 'Classical',
    'orchestral': 'Classical',
    'romantic_era': 'Classical',

    // Folk
    'anti-folk': 'Folk',
    'folk-rock': 'Folk',
    'freak_folk': 'Folk',
    'neofolk': 'Folk',
    'singer-songwriter': 'Folk',
    'traditional_folk': 'Folk',

    // Latin
    'bachata': 'Latin',
    'bossa_nova': 'Latin',
    'cumbia': 'Latin',
    'reggaeton': 'Latin',
    'salsa': 'Latin',

    // Reggae
    'dancehall': 'Reggae',
    'dub': 'Reggae',
    'rocksteady': 'Reggae',
    'ska': 'Reggae',

    // World
    'afrobeat': 'World',
    'celtic': 'World',
    'flamenco': 'World',

    // Soundtrack
    'cinematic': 'Soundtrack',
    'epic_score': 'Soundtrack',
    'film_score': 'Soundtrack',
    'video_game_music': 'Soundtrack',

    // Ambient
    'dark_ambient': 'Ambient',
    'drone': 'Ambient',
    'soundscape': 'Ambient',
    'space_music': 'Ambient',

    // Spoken Word
    'audiobook': 'Spoken Word',
    'comedy': 'Spoken Word',
    'podcast': 'Spoken Word',
    'poetry': 'Spoken Word',

    // Sound Effect
    'abstract_sound': 'Sound Effect',
    'creature_sound': 'Sound Effect',
    'field_recording': 'Sound Effect',
    'foley': 'Sound Effect',
    'weather': 'Sound Effect',
};

/**
 * OPTION B: Algorithmic Subgenre Inference from M/E/T terms
 * Flat array structure with 6-8 discriminating terms per subgenre
 * Best terms merged from both mappings for maximum accuracy
 */
export const SUBGENRE_CHARACTERISTICS: Record<string, string[]> = {
    // Electronic
    'dance': ['rhythmic', 'pumping', 'driving', 'bouncy', 'upbeat', 'celebratory', 'bright'],
    'disco': ['joyful', 'groovy', 'bouncy', 'shimmering', 'orchestrated', 'celebratory', 'warm'],
    'downtempo': ['calm', 'peaceful', 'relaxed', 'dreamy', 'atmospheric', 'laid-back', 'warm', 'soft'],
    'drum_and_bass': ['intense', 'aggressive', 'driving', 'powerful', 'dark', 'energetic', 'frenetic', 'heavy'],
    'edm': ['upbeat', 'positive', 'exciting', 'euphoric', 'energetic', 'explosive', 'bright', 'electronic'],
    'glitch': ['strange', 'mysterious', 'edgy', 'erratic', 'jarring', 'digital', 'glitchy', 'fragmented'],
    'house': ['upbeat', 'positive', 'happy', 'joyful', 'energetic', 'groovy', 'warm', 'electronic'],
    'idm': ['mysterious', 'enigmatic', 'complex', 'cerebral', 'erratic', 'electronic', 'layered', 'intricate'],
    'synthwave': ['nostalgic', 'dreamy', 'cinematic', 'epic', 'driving', 'warm', 'synthetic', 'retro'],
    'techno': ['dark', 'intense', 'driving', 'hypnotic', 'relentless', 'electronic', 'mechanical', 'deep'],
    'trance': ['uplifting', 'euphoric', 'transcendent', 'hypnotic', 'energetic', 'soaring', 'electronic', 'atmospheric'],
    'chiptune': ['playful', 'nostalgic', 'pixelated', 'quirky', 'energetic', 'bouncy', 'electronic', 'retro'],

    // Rock
    'alternative_rock': ['edgy', 'raw', 'intense', 'moody', 'defiant', 'driving', 'gritty', 'distorted'],
    'goth_rock': ['dark', 'melancholic', 'brooding', 'mysterious', 'somber', 'atmospheric', 'reverberant', 'heavy'],
    'indie_rock': ['introspective', 'nostalgic', 'raw', 'authentic', 'jangly', 'organic', 'bittersweet', 'lo-fi'],
    'metal': ['aggressive', 'intense', 'powerful', 'dark', 'fierce', 'explosive', 'heavy', 'distorted'],
    'post-rock': ['atmospheric', 'introspective', 'epic', 'transcendent', 'building', 'layered', 'reverberant', 'cinematic'],
    'progressive_rock': ['complex', 'ambitious', 'epic', 'dynamic', 'technical', 'intricate', 'orchestrated', 'detailed'],
    'psychedelic_rock': ['dreamy', 'trippy', 'mysterious', 'surreal', 'entrancing', 'otherworldly', 'reverberant', 'distorted'],
    'punk_rock': ['aggressive', 'defiant', 'raw', 'rebellious', 'angry', 'fast', 'urgent', 'harsh'],
    'surf_rock': ['upbeat', 'playful', 'carefree', 'sunny', 'energetic', 'bright', 'reverberant', 'twangy'],

    // Pop
    'art_pop': ['experimental', 'avant-garde', 'sophisticated', 'edgy', 'layered', 'complex', 'polished', 'innovative'],
    'bubblegum_pop': ['happy', 'cheerful', 'playful', 'upbeat', 'carefree', 'bouncy', 'bright', 'sweet'],
    'dance-pop': ['upbeat', 'happy', 'celebratory', 'fun', 'energetic', 'driving', 'bright', 'electronic'],
    'dream_pop': ['dreamy', 'ethereal', 'atmospheric', 'nostalgic', 'gentle', 'reverberant', 'soft', 'hazy'],
    'euro_pop': ['upbeat', 'catchy', 'joyful', 'energetic', 'driving', 'bright', 'electronic', 'synthetic'],
    'hyperpop': ['euphoric', 'chaotic', 'intense', 'ecstatic', 'explosive', 'frenetic', 'distorted', 'glitchy'],
    'indie_pop': ['quirky', 'nostalgic', 'introspective', 'playful', 'charming', 'organic', 'warm', 'intimate'],
    'jangle_pop': ['bright', 'cheerful', 'nostalgic', 'upbeat', 'bouncy', 'jangly', 'clean', 'shimmering'],
    'synth-pop': ['nostalgic', 'upbeat', 'dreamy', 'sentimental', 'electronic', 'synthetic', 'polished', 'lush'],

    // Hip-Hop
    'abstract_hip_hop': ['experimental', 'cerebral', 'mysterious', 'moody', 'complex', 'layered', 'abstract', 'unconventional'],
    'boom-bap': ['raw', 'authentic', 'gritty', 'punchy', 'steady', 'warm', 'organic', 'crisp'],
    'cloud_rap': ['dreamy', 'hazy', 'atmospheric', 'chill', 'laid-back', 'ethereal', 'reverberant', 'spacious'],
    'conscious_hip_hop': ['thoughtful', 'introspective', 'socially-aware', 'reflective', 'storytelling', 'clear', 'articulate', 'organic'],
    'drill': ['dark', 'menacing', 'ominous', 'aggressive', 'grim', 'driving', 'heavy', 'sparse'],
    'g_funk': ['laid-back', 'smooth', 'funky', 'cool', 'groovy', 'warm', 'synthesized', 'layered'],
    'gangsta_rap': ['aggressive', 'defiant', 'raw', 'intense', 'powerful', 'storytelling', 'heavy', 'bass-heavy'],
    'lo-fi_hip_hop': ['calm', 'peaceful', 'nostalgic', 'relaxed', 'contemplative', 'chill', 'warm', 'grainy'],
    'trap': ['dark', 'aggressive', 'intense', 'menacing', 'energetic', 'driving', 'heavy', 'bass-heavy'],

    // R&B / Soul
    'contemporary_rnb': ['sensual', 'romantic', 'smooth', 'intimate', 'mellow', 'polished', 'silky', 'warm'],
    'funk': ['upbeat', 'groovy', 'playful', 'funky', 'energetic', 'bouncy', 'punchy', 'tight'],
    'motown': ['upbeat', 'joyful', 'soulful', 'romantic', 'energetic', 'warm', 'orchestrated', 'polished'],
    'neo-soul': ['smooth', 'introspective', 'soulful', 'intimate', 'jazzy', 'warm', 'organic', 'rich'],
    'philly_soul': ['romantic', 'lush', 'sophisticated', 'smooth', 'orchestrated', 'warm', 'rich', 'full'],
    'psychedelic_soul': ['dreamy', 'mystical', 'groovy', 'experimental', 'entrancing', 'reverberant', 'warm', 'fuzzy'],
    'quiet_storm': ['romantic', 'sensual', 'intimate', 'smooth', 'gentle', 'slow', 'soft', 'silky'],

    // Jazz
    'acid_jazz': ['groovy', 'funky', 'sophisticated', 'mellow', 'warm', 'electronic', 'layered', 'textured'],
    'bebop': ['energetic', 'complex', 'sophisticated', 'fast', 'frenetic', 'brisk', 'bright', 'intricate'],
    'cool_jazz': ['relaxed', 'sophisticated', 'mellow', 'cool', 'laid-back', 'smooth', 'soft', 'elegant'],
    'free_jazz': ['experimental', 'chaotic', 'intense', 'avant-garde', 'unpredictable', 'dissonant', 'raw', 'abstract'],
    'jazz_fusion': ['exploratory', 'dynamic', 'energetic', 'driving', 'electric', 'layered', 'complex', 'fusion'],
    'latin_jazz': ['upbeat', 'passionate', 'vibrant', 'energetic', 'rhythmic', 'warm', 'percussion-heavy', 'lively'],
    'modal_jazz': ['hypnotic', 'meditative', 'atmospheric', 'contemplative', 'brooding', 'spacious', 'open', 'warm'],
    'swing': ['upbeat', 'joyful', 'playful', 'energetic', 'swinging', 'bouncy', 'warm', 'orchestral'],

    // Blues
    'acoustic_blues': ['raw', 'authentic', 'melancholic', 'soulful', 'plaintive', 'acoustic', 'organic', 'intimate'],
    'chicago_blues': ['gritty', 'powerful', 'soulful', 'driving', 'electric', 'distorted', 'raw', 'energetic'],
    'delta_blues': ['raw', 'haunting', 'melancholic', 'lonely', 'plaintive', 'acoustic', 'sparse', 'unpolished'],
    'electric_blues': ['powerful', 'soulful', 'expressive', 'driving', 'energetic', 'electric', 'distorted', 'gritty'],

    // Country
    'americana': ['nostalgic', 'authentic', 'heartfelt', 'earthy', 'bittersweet', 'acoustic', 'organic', 'reflective'],
    'bakersfield_sound': ['raw', 'honky-tonk', 'rebellious', 'driving', 'twangy', 'electric', 'bright', 'punchy'],
    'bluegrass': ['upbeat', 'energetic', 'traditional', 'fast', 'brisk', 'acoustic', 'bright', 'intricate'],
    'honky_tonk': ['rowdy', 'plaintive', 'upbeat', 'traditional', 'energetic', 'bouncy', 'twangy', 'lonely'],
    'outlaw_country': ['rebellious', 'raw', 'defiant', 'gritty', 'driving', 'edgy', 'electric', 'rough'],

    // Classical
    'baroque': ['ornate', 'elaborate', 'formal', 'intricate', 'polyphonic', 'harpsichord', 'contrapuntal', 'refined'],
    'classical_period': ['balanced', 'elegant', 'formal', 'graceful', 'clear', 'orchestral', 'refined', 'structured'],
    'contemporary_classical': ['experimental', 'modern', 'challenging', 'edgy', 'dissonant', 'complex', 'avant-garde', 'unpredictable'],
    'minimalism': ['meditative', 'hypnotic', 'repetitive', 'gradual', 'steady', 'sparse', 'minimalistic', 'clean'],
    'orchestral': ['epic', 'majestic', 'dramatic', 'dynamic', 'powerful', 'full', 'rich', 'grand'],
    'romantic_era': ['passionate', 'emotional', 'expressive', 'dynamic', 'dramatic', 'lush', 'rich', 'orchestral'],

    // Folk
    'anti-folk': ['ironic', 'raw', 'rebellious', 'sarcastic', 'lo-fi', 'acoustic', 'DIY', 'unconventional'],
    'folk-rock': ['authentic', 'storytelling', 'heartfelt', 'rhythmic', 'driving', 'acoustic', 'electric', 'warm'],
    'freak_folk': ['weird', 'psychedelic', 'experimental', 'strange', 'unconventional', 'acoustic', 'layered', 'ethereal'],
    'neofolk': ['dark', 'atmospheric', 'mystical', 'somber', 'introspective', 'acoustic', 'traditional', 'reverent'],
    'singer-songwriter': ['introspective', 'personal', 'intimate', 'confessional', 'poignant', 'acoustic', 'warm', 'simple'],
    'traditional_folk': ['authentic', 'timeless', 'storytelling', 'organic', 'minimalistic', 'acoustic', 'traditional', 'natural'],

    // Latin
    'bachata': ['romantic', 'sensual', 'passionate', 'yearning', 'tender', 'warm', 'guitar-driven', 'intimate'],
    'bossa_nova': ['relaxed', 'romantic', 'sophisticated', 'smooth', 'gentle', 'soft', 'warm', 'refined'],
    'cumbia': ['upbeat', 'festive', 'joyful', 'rhythmic', 'driving', 'percussion-heavy', 'warm', 'traditional'],
    'reggaeton': ['sensual', 'aggressive', 'party', 'driving', 'rhythmic', 'electronic', 'bass-heavy', 'synthetic'],
    'salsa': ['upbeat', 'passionate', 'energetic', 'festive', 'fast', 'bright', 'brass', 'percussion-heavy'],

    // Reggae
    'dancehall': ['upbeat', 'party', 'aggressive', 'energetic', 'driving', 'electronic', 'digital', 'bass-heavy'],
    'dub': ['hypnotic', 'atmospheric', 'psychedelic', 'steady', 'bass-heavy', 'reverberant', 'echo-heavy', 'spacious'],
    'rocksteady': ['smooth', 'soulful', 'romantic', 'moderate', 'swaying', 'warm', 'bass-heavy', 'organic'],
    'ska': ['upbeat', 'joyful', 'energetic', 'bouncy', 'driving', 'bright', 'brass', 'punchy'],

    // World
    'afrobeat': ['upbeat', 'vibrant', 'celebratory', 'energetic', 'rhythmic', 'polyrhythmic', 'percussion-heavy', 'brass'],
    'celtic': ['traditional', 'storytelling', 'mystical', 'poignant', 'flowing', 'acoustic', 'fiddle', 'organic'],
    'flamenco': ['passionate', 'intense', 'dramatic', 'dynamic', 'rhythmic', 'acoustic', 'guitar-driven', 'percussive'],

    // Soundtrack
    'cinematic': ['epic', 'dramatic', 'emotional', 'atmospheric', 'dynamic', 'sweeping', 'orchestral', 'layered'],
    'epic_score': ['heroic', 'triumphant', 'epic', 'majestic', 'powerful', 'soaring', 'orchestral', 'massive'],
    'film_score': ['emotive', 'narrative', 'atmospheric', 'dynamic', 'orchestral', 'cinematic', 'layered', 'detailed'],
    'video_game_music': ['adventurous', 'epic', 'nostalgic', 'melodic', 'dynamic', 'electronic', 'orchestral', 'looping'],

    // Ambient
    'dark_ambient': ['dark', 'ominous', 'mysterious', 'unsettling', 'minimal', 'atmospheric', 'drone', 'haunting'],
    'drone': ['meditative', 'hypnotic', 'atmospheric', 'minimal', 'sustained', 'enveloping', 'textured', 'spacious'],
    'soundscape': ['atmospheric', 'environmental', 'immersive', 'ambient', 'flowing', 'spacious', 'layered', 'textured'],
    'space_music': ['cosmic', 'ethereal', 'expansive', 'transcendent', 'floating', 'spacious', 'synthesized', 'vast'],

    // Spoken Word
    'audiobook': ['narrative', 'human', 'conversational', 'calm', 'clear', 'intimate', 'spoken', 'articulate'],
    'comedy': ['funny', 'upbeat', 'playful', 'live', 'dynamic', 'clear', 'spoken', 'expressive'],
    'podcast': ['conversational', 'human', 'calm', 'clear', 'spoken', 'intimate', 'engaging'],
    'poetry': ['expressive', 'emotional', 'artistic', 'emotive', 'rhythmic', 'spoken', 'articulate'],

    // Sound Effect
    'abstract_sound': ['experimental', 'abstract', 'edgy', 'synthetic', 'processed', 'unconventional'],
    'creature_sound': ['aggressive', 'snarling', 'raspy', 'powerful', 'raw', 'natural', 'organic'],
    'field_recording': ['natural', 'environmental', 'realistic', 'authentic', 'unprocessed', 'detailed', 'ambient'],
    'foley': ['realistic', 'cinematic', 'dry', 'detailed', 'natural', 'articulate', 'subtle'],
    'weather': ['atmospheric', 'natural', 'thunderous', 'environmental', 'realistic', 'calm', 'powerful'],
};

/**
 * OPTION B Helper: Infer subgenre from M/E/T terms
 * @param moodTerms - Array of mood term IDs from user's description
 * @param energyTerms - Array of energy term IDs from user's description
 * @param textureTerms - Array of texture term IDs from user's description
 * @param primaryGenre - The primary genre to search within
 * @returns Best matching subgenre with confidence score
 */
export function inferSubgenre(
    moodTerms: string[],
    energyTerms: string[],
    textureTerms: string[],
    primaryGenre: string
): { subgenre: string; confidence: number } {
    const subgenresForGenre = GENRES.secondary_genres[primaryGenre.toLowerCase().replace(/\s+/g, '_').replace(/\//g, '').replace('&', '')];

    if (!subgenresForGenre) {
        return { subgenre: '', confidence: 0 };
    }

    let bestMatch = { subgenre: '', confidence: 0 };

    // Combine all user terms
    const allUserTerms = [...moodTerms, ...energyTerms, ...textureTerms];

    for (const subgenre of subgenresForGenre) {
        const characteristics = SUBGENRE_CHARACTERISTICS[subgenre];
        if (!characteristics) continue;

        // Count how many user terms match this subgenre's characteristics
        let matchCount = 0;
        for (const term of allUserTerms) {
            if (characteristics.includes(term)) {
                matchCount += 1;
            }
        }

        // Calculate confidence as percentage of user terms that matched
        const confidence = allUserTerms.length > 0 ? matchCount / allUserTerms.length : 0;

        if (confidence > bestMatch.confidence) {
            bestMatch = { subgenre, confidence };
        }
    }

    return bestMatch;
}

/**
 * OPTION A Helper: Get primary genre from subgenre
 * @param subgenre - The subgenre to look up
 * @returns Primary genre or empty string if not found
 */
export function getPrimaryGenre(subgenre: string): string {
    return SUBGENRE_TO_GENRE[subgenre] || '';
}
