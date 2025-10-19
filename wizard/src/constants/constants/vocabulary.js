"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEXTURE_TERMS_BY_FREQUENCY = exports.ENERGY_TERMS_BY_FREQUENCY = exports.MOOD_TERMS_BY_FREQUENCY = exports.DEFAULT_INSTRUMENT = exports.VOCABULARY = exports.TERM_FREQUENCY_GROUPS = void 0;
exports.getTermsByFrequency = getTermsByFrequency;
exports.getAllTermsForCategory = getAllTermsForCategory;
var taxonomy_1 = require("./taxonomy");
// Frequency-based term groups for UI organization..
exports.TERM_FREQUENCY_GROUPS = {
    ubiquitous: ['ubiquitous'], // Very common terms
    frequent: ['frequent'], // Common terms
    infrequent: ['infrequent'], // Unusual terms
    rare: ['rare'] // Very rare terms
};
// MET vocabulary imported from single source of truth (taxonomy.ts)
// This replaces the previous  hard-coded arrays
exports.VOCABULARY = {
    mood: taxonomy_1.VOCABULARY_MET.mood,
    energy: taxonomy_1.VOCABULARY_MET.energy,
    texture: taxonomy_1.VOCABULARY_MET.texture,
    primary_genres: ['Electronic', 'Dance', 'Rock', 'Pop', 'Hip-Hop', 'R&B / Soul', 'Jazz', 'Blues', 'Country', 'Classical', 'Folk', 'Latin', 'Reggae', 'World', 'Soundtrack', 'Ambient', 'Spoken Word', 'Sound Effect'],
    secondary_genres: {
        electronic: ['disco', 'downtempo', 'drum_and_bass', 'edm', 'glitch', 'house', 'idm', 'synthwave', 'techno', 'trance', 'chiptune'],
        dance: ['house', 'techno', 'trance', 'edm', 'disco', 'electro', 'dubstep', 'garage', 'hardstyle', 'progressive_house', 'deep_house', 'minimal_techno'],
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
    instrument: ['electric_guitar', 'acoustic_guitar', 'bass_guitar', 'double_bass', 'synthesizer', 'bass_synthesizer', 'piano', 'electric_piano', 'organ', 'drums', 'kick_drum', 'snare_drum', 'hi-hat', 'cymbals', 'drum_machine', 'sampler', 'strings', 'violin', 'cello', 'brass', 'trumpet', 'saxophone', 'flute', 'vocals'],
    key: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    scale: ['major', 'minor', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian', 'chromatic', 'pentatonic_major', 'pentatonic_minor'],
    vocals_presence: ['none', 'lead', 'backing', 'choir', 'sampled', 'spoken_word', 'ad-libs'],
    vocals_gender: ['male', 'female', 'mixed', 'androgynous'],
    vocals_style: ['singing', 'rapping', 'screaming', 'growling', 'falsetto', 'whispering', 'operatic'],
    general_roles: ['lead', 'rhythm', 'melody', 'harmony', 'bass', 'percussion', 'pad', 'atmospheric', 'fx', 'counter-melody', 'ostinato', 'fill', 'arpeggio', 'chordal'],
    instrument_roles: {
        electric_guitar: ['lead', 'rhythm', 'fill', 'melody', 'solo', 'riffs'],
        acoustic_guitar: ['rhythm', 'melody', 'fingerpicked', 'chordal'],
        bass_guitar: ['bass', 'rhythm', 'melody', 'ostinato'],
        double_bass: ['bass', 'walking_bassline', 'melody', 'solo'],
        synthesizer: ['lead', 'pad', 'arpeggio', 'melody', 'atmosphere', 'fx', 'bass'],
        bass_synthesizer: ['bass', 'sub-bass', 'arpeggio', 'ostinato'],
        piano: ['melody', 'harmony', 'chordal', 'rhythm', 'lead'],
        electric_piano: ['harmony', 'chordal', 'melody'],
        organ: ['pad', 'harmony', 'lead', 'chordal'],
        drums: ['percussion', 'rhythm', 'fill', 'beat'],
        kick_drum: ['percussion', 'rhythm'],
        snare_drum: ['percussion', 'rhythm', 'backbeat'],
        strings: ['pad', 'harmony', 'melody', 'orchestral_bed', 'ostinato'],
        brass: ['melody', 'harmony', 'fanfare', 'stab'],
        vocals: ['lead', 'backing', 'harmony', 'ad-libs'],
    },
    general_descriptors: ['reverberant', 'dry', 'processed', 'present', 'distant', 'warm', 'bright', 'dark', 'lofi'],
    instrument_descriptors: {
        electric_guitar: ['distorted', 'clean', 'crunchy', 'wailing', 'overdriven', 'fuzzy', 'chugging', 'riff'],
        acoustic_guitar: ['strummed', 'fingerpicked', 'bright', 'warm', 'nylon', 'steel-string'],
        bass_guitar: ['deep', 'funky', 'slapped', 'fretless', 'driving', 'growling', 'sub-bass'],
        double_bass: ['bowed', 'plucked', 'warm', 'deep', 'jazzy'],
        synthesizer: ['soaring', 'arpeggiated', 'bubbly', 'harsh', 'evolving', 'digital', 'analog', 'plucked'],
        bass_synthesizer: ['deep', 'wobbling', 'sub-bass', 'acidic', 'driving'],
        piano: ['percussive', 'gentle', 'honky-tonk', 'grand', 'bright'],
        electric_piano: ['warm', 'bell-like', 'rhodes', 'wurlitzer'],
        organ: ['church', 'hammond', 'rock', 'drawbar'],
        drums: ['heavy', 'light', 'tight', 'loose', 'shuffling', 'tribal', 'acoustic'],
        kick_drum: ['punchy', 'booming', 'tight', 'deep', 'four-on-the-floor', 'lofi'],
        snare_drum: ['sharp', 'fat', 'crisp', 'reverberant', 'rimshot'],
        drum_machine: ['electronic', '808', '909', 'processed', 'glitchy'],
        strings: ['lush', 'sweeping', 'pizzicato', 'staccato', 'orchestral'],
        brass: ['blaring', 'muted', 'majestic', 'jazzy'],
        vocals: ['breathy', 'powerful', 'operatic', 'raspy', 'autotuned', 'harmonized'],
    },
};
exports.DEFAULT_INSTRUMENT = {
    instrument: '',
    role: '',
    descriptors: [],
};
// Taxonomy-based term organization by frequency (imported from taxonomy.ts)
exports.MOOD_TERMS_BY_FREQUENCY = taxonomy_1.TERMS_BY_FREQUENCY.Mood;
exports.ENERGY_TERMS_BY_FREQUENCY = taxonomy_1.TERMS_BY_FREQUENCY.Energy;
exports.TEXTURE_TERMS_BY_FREQUENCY = taxonomy_1.TERMS_BY_FREQUENCY.Texture;
// Helper functions for taxonomy-based UI
function getTermsByFrequency(category, frequency) {
    var _a;
    var categoryMap = {
        mood: taxonomy_1.TERMS_BY_FREQUENCY.Mood,
        energy: taxonomy_1.TERMS_BY_FREQUENCY.Energy,
        texture: taxonomy_1.TERMS_BY_FREQUENCY.Texture
    };
    return ((_a = categoryMap[category]) === null || _a === void 0 ? void 0 : _a[frequency]) || [];
}
function getAllTermsForCategory(category) {
    var allFrequencies = ['ubiquitous', 'frequent', 'infrequent', 'rare'];
    return allFrequencies.flatMap(function (freq) { return getTermsByFrequency(category, freq); });
}
