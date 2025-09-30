import Ajv from 'ajv';
import * as fs from 'fs';
import * as path from 'path';

describe('NL Phrase Schema Validation', () => {
  let ajv: Ajv;
  let schema: any;

  beforeAll(() => {
    ajv = new Ajv();
    const schemaPath = path.join(__dirname, '../../schemas/musical_annotation.schema.json');
    schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  });

  test('should validate a valid nl_phrase', () => {
    const data = {
      musical_analysis: {
        protocol_version: '1.0',
        semantic_description: {
          nl_phrase: 'An energetic rock track with driving drums and upbeat guitar'
        }
      }
    };

    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBe(true);
  });

  test('should allow missing nl_phrase (optional field)', () => {
    const data = {
      musical_analysis: {
        protocol_version: '1.0',
        semantic_description: {
          genre: { primary: 'rock' }
        }
      }
    };

    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBe(true);
  });

  test('should allow null nl_phrase', () => {
    const data = {
      musical_analysis: {
        protocol_version: '1.0',
        semantic_description: {
          nl_phrase: null
        }
      }
    };

    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBe(true);
  });

  test('should reject nl_phrase that is too short', () => {
    const data = {
      musical_analysis: {
        protocol_version: '1.0',
        semantic_description: {
          nl_phrase: 'Too short'
        }
      }
    };

    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBe(false);
    expect(validate.errors).toBeDefined();
  });

  test('should reject nl_phrase that is too long', () => {
    const longPhrase = 'A'.repeat(201);
    const data = {
      musical_analysis: {
        protocol_version: '1.0',
        semantic_description: {
          nl_phrase: longPhrase
        }
      }
    };

    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBe(false);
    expect(validate.errors).toBeDefined();
  });

  test('should reject nl_phrase of wrong type', () => {
    const data = {
      musical_analysis: {
        protocol_version: '1.0',
        semantic_description: {
          nl_phrase: 12345
        }
      }
    };

    const validate = ajv.compile(schema);
    const valid = validate(data);
    expect(valid).toBe(false);
    expect(validate.errors).toBeDefined();
  });
});
