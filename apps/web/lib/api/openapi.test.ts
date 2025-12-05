import { describe, it, expect } from 'vitest';
import { registry, generateOpenAPIDocument } from './openapi';
import { version } from '@/lib/version';

describe('OpenAPI', () => {
  describe('registry', () => {
    it('is an OpenAPIRegistry instance', () => {
      expect(registry).toBeDefined();
      expect(registry.definitions).toBeDefined();
    });
  });

  describe('generateOpenAPIDocument', () => {
    it('generates a valid OpenAPI 3.1.0 document', () => {
      const doc = generateOpenAPIDocument();

      expect(doc.openapi).toBe('3.1.0');
      expect(doc.info).toBeDefined();
      expect(doc.info.title).toBe('Paperless AI API');
      expect(doc.info.version).toBe(version);
      expect(doc.info.description).toBe('API for Paperless AI document processing');
    });

    it('includes server configuration', () => {
      const doc = generateOpenAPIDocument();

      expect(doc.servers).toBeDefined();
      expect(doc.servers).toHaveLength(1);
      expect(doc.servers?.[0]?.url).toBe('/api');
      expect(doc.servers?.[0]?.description).toBe('API Server');
    });

    it('includes paths from registry definitions', () => {
      const doc = generateOpenAPIDocument();

      // The document should have paths (could be empty if no routes registered yet)
      expect(doc).toHaveProperty('paths');
    });

    it('includes components from registry definitions', () => {
      const doc = generateOpenAPIDocument();

      // The document should have components (could be empty if no schemas registered yet)
      expect(doc).toHaveProperty('components');
    });

    it('returns consistent output on multiple calls', () => {
      const doc1 = generateOpenAPIDocument();
      const doc2 = generateOpenAPIDocument();

      expect(doc1.openapi).toBe(doc2.openapi);
      expect(doc1.info.title).toBe(doc2.info.title);
      expect(doc1.info.version).toBe(doc2.info.version);
    });
  });
});
