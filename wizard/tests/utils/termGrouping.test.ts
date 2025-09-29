/**
 * Tests for term grouping utilities
 * Feature: 006-below-the-filter
 * Task: T003
 */

import { describe, it, expect } from 'vitest';
import {
  groupTermsByCategory,
  groupTermsByPopularity,
  sortTermsByFrequency,
  inferTermCategory,
} from '../../src/utils/termGrouping';

describe('termGrouping utilities', () => {
  describe('inferTermCategory', () => {
    it('should identify mood terms correctly', () => {
      expect(inferTermCategory('joyful')).toBe('Mood');
      expect(inferTermCategory('upbeat')).toBe('Mood');
      expect(inferTermCategory('melancholic')).toBe('Mood');
      expect(inferTermCategory('peaceful')).toBe('Mood');
    });

    it('should identify energy terms correctly', () => {
      expect(inferTermCategory('high-energy')).toBe('Energy');
      expect(inferTermCategory('driving')).toBe('Energy');
      expect(inferTermCategory('laid-back')).toBe('Energy');
      expect(inferTermCategory('flowing')).toBe('Energy');
    });

    it('should identify texture terms correctly', () => {
      expect(inferTermCategory('bright')).toBe('Texture');
      expect(inferTermCategory('warm')).toBe('Texture');
      expect(inferTermCategory('crisp')).toBe('Texture');
      expect(inferTermCategory('dark')).toBe('Texture');
    });

    it('should return null for unknown terms', () => {
      expect(inferTermCategory('unknown-term')).toBeNull();
      expect(inferTermCategory('not-a-real-term')).toBeNull();
    });
  });

  describe('groupTermsByCategory', () => {
    it('should return 3 groups in semantic order (Mood, Energy, Texture)', () => {
      const terms = ['joyful', 'high-energy', 'bright', 'peaceful', 'driving', 'warm'];
      const groups = groupTermsByCategory(terms);

      expect(groups).toHaveLength(3);
      expect(groups[0].label).toBe('Mood');
      expect(groups[1].label).toBe('Energy');
      expect(groups[2].label).toBe('Texture');
    });

    it('should group terms correctly by category', () => {
      const terms = ['joyful', 'high-energy', 'bright', 'peaceful'];
      const groups = groupTermsByCategory(terms);

      expect(groups[0].label).toBe('Mood');
      expect(groups[0].terms).toContain('joyful');
      expect(groups[0].terms).toContain('peaceful');

      expect(groups[1].label).toBe('Energy');
      expect(groups[1].terms).toContain('high-energy');

      expect(groups[2].label).toBe('Texture');
      expect(groups[2].terms).toContain('bright');
    });

    it('should filter out empty groups', () => {
      const terms = ['joyful', 'peaceful']; // Only mood terms
      const groups = groupTermsByCategory(terms);

      expect(groups).toHaveLength(1);
      expect(groups[0].label).toBe('Mood');
    });

    it('should sort terms by frequency within each group (most common first)', () => {
      const terms = ['euphoric', 'joyful', 'sparkly-mood']; // infrequent, ubiquitous, rare
      const groups = groupTermsByCategory(terms);

      expect(groups[0].terms[0]).toBe('joyful'); // ubiquitous comes first
      expect(groups[0].terms[1]).toBe('euphoric'); // infrequent
      expect(groups[0].terms[2]).toBe('sparkly-mood'); // rare last
    });

    it('should handle terms without metadata at the end', () => {
      const terms = ['joyful', 'unknown-term', 'high-energy'];
      const groups = groupTermsByCategory(terms);

      // Unknown term should be in ungrouped section (not in any category group)
      const allGroupedTerms = groups.flatMap(g => g.terms);
      expect(allGroupedTerms).not.toContain('unknown-term');
    });

    it('should return empty array for empty input', () => {
      const groups = groupTermsByCategory([]);
      expect(groups).toEqual([]);
    });
  });

  describe('groupTermsByPopularity', () => {
    it('should return groups in order (Ubiquitous, Frequent, Infrequent, Rare)', () => {
      const terms = ['joyful', 'happy', 'euphoric', 'sparkly-mood'];
      const groups = groupTermsByPopularity(terms);

      // Filter out empty groups
      const nonEmptyGroups = groups.filter(g => g.terms.length > 0);

      expect(nonEmptyGroups[0].label).toBe('Ubiquitous');
      expect(nonEmptyGroups[1].label).toBe('Frequent');
      expect(nonEmptyGroups[2].label).toBe('Infrequent');
      expect(nonEmptyGroups[3].label).toBe('Rare');
    });

    it('should group terms correctly by frequency', () => {
      const terms = ['joyful', 'happy', 'euphoric', 'sparkly-mood'];
      const groups = groupTermsByPopularity(terms);

      const ubiquitousGroup = groups.find(g => g.label === 'Ubiquitous');
      const frequentGroup = groups.find(g => g.label === 'Frequent');
      const infrequentGroup = groups.find(g => g.label === 'Infrequent');
      const rareGroup = groups.find(g => g.label === 'Rare');

      expect(ubiquitousGroup?.terms).toContain('joyful');
      expect(frequentGroup?.terms).toContain('happy');
      expect(infrequentGroup?.terms).toContain('euphoric');
      expect(rareGroup?.terms).toContain('sparkly-mood');
    });

    it('should filter out empty groups', () => {
      const terms = ['joyful', 'peaceful']; // Only ubiquitous terms
      const groups = groupTermsByPopularity(terms);

      expect(groups).toHaveLength(1);
      expect(groups[0].label).toBe('Ubiquitous');
    });

    it('should sort terms by frequency within each group', () => {
      const terms = ['happy', 'cheerful', 'uplifting']; // All frequent
      const groups = groupTermsByPopularity(terms);

      expect(groups[0].label).toBe('Frequent');
      expect(groups[0].terms.length).toBe(3);
    });

    it('should handle terms without metadata at the end', () => {
      const terms = ['joyful', 'unknown-term'];
      const groups = groupTermsByPopularity(terms);

      const allGroupedTerms = groups.flatMap(g => g.terms);
      expect(allGroupedTerms).not.toContain('unknown-term');
    });

    it('should return empty array for empty input', () => {
      const groups = groupTermsByPopularity([]);
      expect(groups).toEqual([]);
    });
  });

  describe('sortTermsByFrequency', () => {
    it('should sort terms from most common to least common', () => {
      const terms = ['sparkly-mood', 'joyful', 'happy', 'euphoric'];
      // rare, ubiquitous, frequent, infrequent
      const sorted = sortTermsByFrequency(terms);

      expect(sorted[0]).toBe('joyful'); // ubiquitous
      expect(sorted[1]).toBe('happy'); // frequent
      expect(sorted[2]).toBe('euphoric'); // infrequent
      expect(sorted[3]).toBe('sparkly-mood'); // rare
    });

    it('should handle terms without frequency metadata', () => {
      const terms = ['joyful', 'unknown-term', 'happy'];
      const sorted = sortTermsByFrequency(terms);

      // Known terms sorted by frequency, unknown at end
      expect(sorted[0]).toBe('joyful'); // ubiquitous
      expect(sorted[1]).toBe('happy'); // frequent
      expect(sorted[2]).toBe('unknown-term'); // no frequency
    });

    it('should return empty array for empty input', () => {
      const sorted = sortTermsByFrequency([]);
      expect(sorted).toEqual([]);
    });

    it('should preserve order for terms with same frequency', () => {
      const terms = ['happy', 'cheerful']; // Both frequent
      const sorted = sortTermsByFrequency(terms);

      // Order should be preserved (stable sort)
      expect(sorted).toEqual(['happy', 'cheerful']);
    });
  });
});
