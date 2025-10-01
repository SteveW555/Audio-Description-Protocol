import { VOCABULARY } from '../constants/vocabulary';
import { AudioProtocolData } from '../types/protocol';

export const getSecondaryGenresFor = (genre: string | undefined | null): string[] => {
    if (!genre || genre === 'tbc' || genre === '') return [];

    // Convert primary genre display name to key (e.g., "Hip-Hop" -> "hip_hop")
    const genreKey = genre
        .toLowerCase()
        .replace(/r&b/g, 'rnb')
        .replace(/\s+/g, '_')
        .replace(/&/g, '')
        .replace(/\//g, '')
        .replace(/__+/g, '_')
        .replace(/^_+|_+$/g, '')
        .trim();

    // Map some special cases
    const keyMap: Record<string, string> = {
        'hip-hop': 'hip_hop',
        'spoken_word': 'spoken_word',
        'sound_effect': 'sound_effect'
    };

    const mappedKey = keyMap[genreKey] || genreKey;
    const secondaryGenres = VOCABULARY.secondary_genres[mappedKey as keyof typeof VOCABULARY.secondary_genres];

    return secondaryGenres ? [...secondaryGenres] : [];
};

export const shouldShowVocalDetails = (data: AudioProtocolData): boolean => {
    const presence = data.semantic_description.vocals.presence;
    return Boolean(presence && presence !== 'none');
};
