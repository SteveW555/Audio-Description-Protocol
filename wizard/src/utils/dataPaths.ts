import { AudioProtocolData } from '../types/protocol';

export const getValueAtPath = (data: AudioProtocolData, path: string): any => {
    return path.split('.').reduce((current: any, key) => (current ? current[key] : undefined), data);
};

export const setValueAtPath = (
    data: AudioProtocolData,
    path: string,
    value: unknown
): AudioProtocolData => {
    const pathParts = path.split('.');
    const clone: AudioProtocolData = structuredClone(data);
    let cursor: any = clone;

    for (let i = 0; i < pathParts.length - 1; i += 1) {
        cursor = cursor[pathParts[i]];
    }

    cursor[pathParts[pathParts.length - 1]] = value;
    return clone;
};
