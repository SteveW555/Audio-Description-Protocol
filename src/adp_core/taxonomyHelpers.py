"""
Taxonomy helper functions for working with Terms and taxonomy hierarchy.

This module provides utility functions for searching, displaying, and analyzing
the audio taxonomy system, mirroring the functionality of taxonomyHelpers.ts.
"""

from typing import Optional, List, Dict, Tuple
from .taxonomy import (
    TAXONOMY_TERMS, 
    TAXONOMY_HIERARCHY, 
    TermDefinition, 
    Frequency, 
    QualityCategory,
    TaxonomyValidator
)


def print_term_def(term_id: str) -> None:
    """Print full details of a term (path + description, frequency, etc.)."""
    term = TAXONOMY_TERMS.get(term_id)
    if not term:
        print(f"❌ Term '{term_id}' not found")
        return
    
    path = find_hierarchy_path(term_id)
    if path:
        print(f"📂 {' -> '.join(path)}")
    
    print(f"🎵 {term.term}")
    print(f"   Description: {term.desc}")
    print(f"   Frequency:   {term.freq.value}")
    
    if term.aliases:
        print(f"   Aliases:     {', '.join(term.aliases)}")
    if term.examples:
        print(f"   Examples:    {'; '.join(term.examples)}")
    if term.sources:
        print(f"   Sources:     {'; '.join(term.sources)}")
    if term.figurative:
        print(f"   Figurative:  yes")


def find_hierarchy_path(term_id: str) -> Optional[List[str]]:
    """
    Find hierarchy path for a term.
    Returns ['Mood', 'Positive / Uplifting', 'upbeat'] if found.
    """
    for category, clusters in TAXONOMY_HIERARCHY.items():
        for cluster_name, ids in clusters.items():
            if term_id in ids:
                return [category.value, cluster_name, term_id]
    return None


def get_cluster_and_siblings(
    term_id: str, 
    include_self: bool = True
) -> Optional[Dict[str, any]]:
    """
    Get the cluster path and siblings of a term.
    By default includes the term itself; set include_self=False to exclude.
    
    Returns:
        Dict with 'path' (list of strings) and 'siblings' (list of TermDefinition)
    """
    for category, clusters in TAXONOMY_HIERARCHY.items():
        for cluster_name, ids in clusters.items():
            if term_id in ids:
                path = [category.value, cluster_name, term_id]
                filtered_ids = ids if include_self else [id for id in ids if id != term_id]
                siblings = [
                    TAXONOMY_TERMS[id] for id in filtered_ids 
                    if id in TAXONOMY_TERMS
                ]
                return {"path": path, "siblings": siblings}
    return None


def print_cluster(
    term_id: str, 
    include_self: bool = True, 
    with_details: bool = True
) -> None:
    """Pretty-print a cluster: path + all terms (with or without details)."""
    hit = get_cluster_and_siblings(term_id, include_self)
    if not hit:
        print(f"❌ Term '{term_id}' not found in hierarchy")
        return
    
    print(f"📂 {' -> '.join(hit['path'])}")
    
    if not hit['siblings']:
        print("   (no siblings)")
        return
    
    print("── Terms in cluster:")
    if with_details:
        for term in hit['siblings']:
            print(f"• {term.term} — {term.desc} [{term.freq.value}]")
    else:
        terms_list = ', '.join(term.term for term in hit['siblings'])
        print(f"• {terms_list}")


def get_by_frequency(
    freq: Frequency, 
    category: Optional[QualityCategory] = None
) -> List[TermDefinition]:
    """
    Get all terms of a given frequency.
    Optionally filter by a root category (Mood, Energy, Texture).
    """
    all_terms = [term for term in TAXONOMY_TERMS.values() if term.freq == freq]
    
    if not category:
        return all_terms
    
    # Get all term IDs for this category
    if category not in TAXONOMY_HIERARCHY:
        return []
    
    category_ids = set()
    for cluster_terms in TAXONOMY_HIERARCHY[category].values():
        category_ids.update(cluster_terms)
    
    return [term for term in all_terms if term.id in category_ids]


def get_ubiquitous(category: Optional[QualityCategory] = None) -> List[TermDefinition]:
    """Shortcut: get all ubiquitous terms (optionally within one category)."""
    return get_by_frequency(Frequency.UBIQUITOUS, category)


def get_by_frequency_grouped(freq: Frequency) -> Dict[QualityCategory, List[TermDefinition]]:
    """
    Get all terms of a given frequency, grouped by root category.
    Returns { Mood: TermDef[], Energy: TermDef[], Texture: TermDef[] }.
    """
    result = {}
    
    for category in QualityCategory:
        if category not in TAXONOMY_HIERARCHY:
            result[category] = []
            continue
        
        # Get unique IDs for this category
        category_ids = set()
        for cluster_terms in TAXONOMY_HIERARCHY[category].values():
            category_ids.update(cluster_terms)
        
        # Filter terms by frequency and category membership
        result[category] = [
            TAXONOMY_TERMS[term_id] for term_id in category_ids
            if term_id in TAXONOMY_TERMS and TAXONOMY_TERMS[term_id].freq == freq
        ]
    
    return result


def search_terms(query: str, search_in: str = "all") -> List[TermDefinition]:
    """
    Search for terms by query string in term names, descriptions, or aliases.
    
    Args:
        query: Search string (case-insensitive)
        search_in: Where to search - "term", "desc", "aliases", or "all"
    
    Returns:
        List of matching TermDefinition objects
    """
    query_lower = query.lower()
    matches = []
    
    for term in TAXONOMY_TERMS.values():
        if search_in in ["term", "all"]:
            if query_lower in term.term.lower():
                matches.append(term)
                continue
        
        if search_in in ["desc", "all"]:
            if query_lower in term.desc.lower():
                matches.append(term)
                continue
        
        if search_in in ["aliases", "all"] and term.aliases:
            if any(query_lower in alias.lower() for alias in term.aliases):
                matches.append(term)
                continue
    
    return matches


def get_terms_by_category(category: QualityCategory) -> List[TermDefinition]:
    """Get all terms for a specific category."""
    return TaxonomyValidator.get_terms_by_category(category)


def get_cluster_names(category: QualityCategory) -> List[str]:
    """Get all cluster names for a given category."""
    if category not in TAXONOMY_HIERARCHY:
        return []
    return list(TAXONOMY_HIERARCHY[category].keys())


def get_terms_in_cluster(category: QualityCategory, cluster_name: str) -> List[TermDefinition]:
    """Get all terms in a specific cluster."""
    if category not in TAXONOMY_HIERARCHY:
        return []
    
    cluster_terms = TAXONOMY_HIERARCHY[category].get(cluster_name, [])
    return [TAXONOMY_TERMS[term_id] for term_id in cluster_terms if term_id in TAXONOMY_TERMS]


def print_category_overview(category: QualityCategory) -> None:
    """Print an overview of all clusters in a category."""
    if category not in TAXONOMY_HIERARCHY:
        print(f"❌ Category '{category.value}' not found")
        return
    
    print(f"📂 {category.value} Category Overview")
    print("=" * 50)
    
    for cluster_name, term_ids in TAXONOMY_HIERARCHY[category].items():
        terms = [TAXONOMY_TERMS[id] for id in term_ids if id in TAXONOMY_TERMS]
        print(f"\n🎯 {cluster_name} ({len(terms)} terms)")
        
        # Group by frequency
        freq_groups = {}
        for term in terms:
            if term.freq not in freq_groups:
                freq_groups[term.freq] = []
            freq_groups[term.freq].append(term)
        
        for freq in [Frequency.UBIQUITOUS, Frequency.FREQUENT, Frequency.INFREQUENT, Frequency.RARE]:
            if freq in freq_groups:
                terms_str = ', '.join(t.term for t in freq_groups[freq])
                print(f"   {freq.value}: {terms_str}")


def validate_term_list(term_ids: List[str]) -> Dict[str, List[str]]:
    """
    Validate a list of term IDs and return validation results.
    
    Returns:
        Dict with 'valid' and 'invalid' keys containing respective term ID lists
    """
    valid_terms = []
    invalid_terms = []
    
    for term_id in term_ids:
        if TaxonomyValidator.is_valid_term(term_id):
            valid_terms.append(term_id)
        else:
            invalid_terms.append(term_id)
    
    return {"valid": valid_terms, "invalid": invalid_terms}


def suggest_similar_terms(term_id: str, max_suggestions: int = 5) -> List[TermDefinition]:
    """
    Suggest similar terms based on the cluster of the given term.
    Returns sibling terms from the same cluster.
    """
    cluster_info = get_cluster_and_siblings(term_id, include_self=False)
    if not cluster_info:
        return []
    
    # Sort by frequency (ubiquitous first) and return top suggestions
    siblings = sorted(
        cluster_info['siblings'], 
        key=lambda t: ['ubiquitous', 'frequent', 'infrequent', 'rare'].index(t.freq.value)
    )
    
    return siblings[:max_suggestions]


# Convenience functions for quick access
def mood_terms() -> List[TermDefinition]:
    """Get all mood terms."""
    return get_terms_by_category(QualityCategory.MOOD)


def energy_terms() -> List[TermDefinition]:
    """Get all energy terms.""" 
    return get_terms_by_category(QualityCategory.ENERGY)


def texture_terms() -> List[TermDefinition]:
    """Get all texture terms."""
    return get_terms_by_category(QualityCategory.TEXTURE)