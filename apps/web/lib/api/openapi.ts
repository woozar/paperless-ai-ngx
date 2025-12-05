import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { version } from '@/lib/version';

export const registry = new OpenAPIRegistry();

export function generateOpenAPIDocument(): OpenAPIObject {
  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Paperless AI API',
      version,
      description: 'API for Paperless AI document processing',
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
  });
}
