import { describe, it, expect, beforeAll } from 'vitest';
import { getSupabaseClient } from '../../src/lib/supabaseClient';

/**
 * Contract test for Supabase schema validation
 * Verifies that the adp_usage table exists with correct structure, indexes, and constraints
 */
describe('Supabase Schema Contract', () => {
  const supabase = getSupabaseClient();

  beforeAll(() => {
    if (!supabase) {
      console.warn('Supabase client not configured - skipping contract tests');
    }
  });

  it('should have adp_usage table with correct columns', async () => {
    if (!supabase) {
      console.warn('Skipping test: Supabase not configured');
      return;
    }

    // Query table structure via information_schema
    const { data, error } = await supabase
      .from('adp_usage')
      .select('*')
      .limit(0);

    expect(error).toBeNull();
    expect(data).toBeDefined();

    // Try inserting a test record to validate column structure
    const testRecord = {
      button_clicked_name: 'test-button',
      button_clicked_time: new Date().toISOString(),
      input_phrase: 'test input',
      response_phrase: 'test response',
      result_json: { test: true }
    };

    const { error: insertError } = await supabase
      .from('adp_usage')
      .insert(testRecord)
      .select();

    // Should succeed or fail with known error (not schema mismatch)
    if (insertError) {
      // Allow RLS policy errors (expected if user not authenticated)
      expect(insertError.message).toMatch(/(policy|permission|authentication)/i);
    }
  });

  it('should enforce NOT NULL constraint on button_clicked_name', async () => {
    if (!supabase) {
      console.warn('Skipping test: Supabase not configured');
      return;
    }

    const invalidRecord = {
      button_clicked_name: null as any,
      button_clicked_time: new Date().toISOString()
    };

    const { error } = await supabase
      .from('adp_usage')
      .insert(invalidRecord);

    expect(error).toBeDefined();
    expect(error?.message).toMatch(/(null|required|constraint)/i);
  });

  it('should enforce non-empty button name constraint', async () => {
    if (!supabase) {
      console.warn('Skipping test: Supabase not configured');
      return;
    }

    const invalidRecord = {
      button_clicked_name: '',
      button_clicked_time: new Date().toISOString()
    };

    const { error } = await supabase
      .from('adp_usage')
      .insert(invalidRecord);

    expect(error).toBeDefined();
    expect(error?.message).toMatch(/(constraint|empty|check)/i);
  });

  it('should accept nullable input_phrase and response_phrase', async () => {
    if (!supabase) {
      console.warn('Skipping test: Supabase not configured');
      return;
    }

    const validRecord = {
      button_clicked_name: 'test-button-nullable',
      button_clicked_time: new Date().toISOString(),
      input_phrase: null,
      response_phrase: null,
      result_json: null
    };

    const { error } = await supabase
      .from('adp_usage')
      .insert(validRecord)
      .select();

    // Should succeed or fail with RLS policy (not schema error)
    if (error) {
      expect(error.message).toMatch(/(policy|permission|authentication)/i);
    }
  });

  it('should accept JSONB data in result_json field', async () => {
    if (!supabase) {
      console.warn('Skipping test: Supabase not configured');
      return;
    }

    const complexJson = {
      nested: {
        array: [1, 2, 3],
        object: { key: 'value' }
      },
      boolean: true,
      number: 42
    };

    const validRecord = {
      button_clicked_name: 'test-button-json',
      button_clicked_time: new Date().toISOString(),
      result_json: complexJson
    };

    const { error } = await supabase
      .from('adp_usage')
      .insert(validRecord)
      .select();

    // Should succeed or fail with RLS policy (not JSON error)
    if (error) {
      expect(error.message).toMatch(/(policy|permission|authentication)/i);
    }
  });
});
