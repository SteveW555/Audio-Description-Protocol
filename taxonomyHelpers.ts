/**
 * quality.helpers.ts
 *
 * Helper functions for working with Terms and QualityHierarchyRef.
 * Requires Terms (Record<string, TermDef>) and QualityHierarchyRef
 * to be imported from your main taxonomy file.
 */

import { Terms, QualityHierarchyRef, TermDef, Frequency, QualityCategory } from './quality';

/**
 * Print full details of a term (path + description, frequency, etc.).
 */
export function printTermDef(termId: string) {
    const term = Terms[termId];
    if (!term) {
        console.log(`❌ Term '${termId}' not found`);
        return;
    }
    const path = findHierarchyPath(termId, QualityHierarchyRef);
    if (path) console.log(`📂 ${path.join(' -> ')}`);

    console.log(`🎵 ${term.term}`);
    console.log(`   Description: ${term.desc}`);
    console.log(`   Frequency:   ${term.freq}`);
    if (term.aliases) console.log(`   Aliases:     ${term.aliases.join(', ')}`);
    if (term.examples) console.log(`   Examples:    ${term.examples.join('; ')}`);
    if (term.sources) console.log(`   Sources:     ${term.sources.join('; ')}`);
    if (term.figurative) console.log(`   Figurative:  yes`);
}

/**
 * Find hierarchy path for a term.
 * Returns ['Mood','Positive / Uplifting','upbeat'] if found.
 */
export function findHierarchyPath(
    termId: string,
    hierarchy: typeof QualityHierarchyRef
): string[] | null {
    for (const [category, clusters] of Object.entries(hierarchy)) {
        for (const [clusterName, ids] of Object.entries(clusters)) {
            if (ids.includes(termId)) {
                return [category, clusterName, termId];
            }
        }
    }
    return null;
}

/**
 * Get the cluster path and siblings of a term.
 * By default includes the term itself; set includeSelf=false to exclude.
 */
export function getClusterAndSiblings(
    termId: string,
    includeSelf: boolean = true
): { path: string[]; siblings: TermDef[] } | null {
    for (const [category, clusters] of Object.entries(QualityHierarchyRef)) {
        for (const [cluster, ids] of Object.entries(clusters)) {
            if (ids.includes(termId)) {
                const path = [category, cluster, termId];
                const filteredIds = includeSelf ? ids : ids.filter(id => id !== termId);
                const siblings = filteredIds
                    .map(id => Terms[id])
                    .filter((t): t is TermDef => Boolean(t));
                return { path, siblings };
            }
        }
    }
    return null;
}

/**
 * Pretty-print a cluster: path + all terms (with or without details).
 */
export function printCluster(
    termId: string,
    includeSelf: boolean = true,
    withDetails: boolean = true
) {
    const hit = getClusterAndSiblings(termId, includeSelf);
    if (!hit) {
        console.log(`❌ Term '${termId}' not found in hierarchy`);
        return;
    }
    console.log(`📂 ${hit.path.join(' -> ')}`);

    if (hit.siblings.length === 0) {
        console.log('   (no siblings)');
        return;
    }

    console.log('── Terms in cluster:');
    if (withDetails) {
        for (const t of hit.siblings) {
            console.log(`• ${t.term} — ${t.desc} [${t.freq}]`);
        }
    } else {
        console.log('• ' + hit.siblings.map(t => t.term).join(', '));
    }
}

/**
 * Get all terms of a given frequency.
 * Optionally filter by a root category (Mood, Energy, Texture).
 */
export function getByFrequency(
    freq: Frequency,
    category?: QualityCategory
): TermDef[] {
    const all = Object.values(Terms).filter(t => t.freq === freq);

    if (!category) return all;

    const categoryClusters = QualityHierarchyRef[category];
    const categoryIds = Object.values(categoryClusters).flat();

    return all.filter(t => categoryIds.includes(t.term));
}

/**
 * Shortcut: get all ubiquitous terms (optionally within one category).
 */
export function getUbiquitous(category?: QualityCategory): TermDef[] {
    return getByFrequency('ubiquitous', category);
}

/**
 * Get all terms of a given frequency, grouped by root category.
 * Returns { Mood: TermDef[], Energy: TermDef[], Texture: TermDef[] }.
 */
export function getByFrequencyGrouped(
    freq: Frequency
): Record<QualityCategory, TermDef[]> {
    const out: Record<QualityCategory, TermDef[]> = {
        Mood: [], Energy: [], Texture: []
    };

    (Object.keys(QualityHierarchyRef) as QualityCategory[]).forEach(category => {
        const ids = Array.from(
            new Set(Object.values(QualityHierarchyRef[category]).flat())
        );

        out[category] = ids
            .map(id => Terms[id])
            .filter((t): t is TermDef => Boolean(t) && t.freq === freq);
    });

    return out;
}