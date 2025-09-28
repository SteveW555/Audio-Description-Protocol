import { VOCABULARY } from '../constants/vocabulary';
import { AudioProtocolData } from '../types/protocol';

export const getSubgenresFor = (genre: string | string[] | undefined | null): string[] => {
    if (!genre || genre === 'tbc') return [];
    const genres = Array.isArray(genre) ? genre : [genre];
    const allSubgenres = genres.flatMap((entry) => VOCABULARY.subgenres[entry as keyof typeof VOCABULARY.subgenres] ?? []);
    return Array.from(new Set(allSubgenres));
};

export const shouldShowVocalDetails = (data: AudioProtocolData): boolean => {
    const presence = data.semantic_description.vocals.presence;
    return Boolean(presence && presence !== 'none');
};
