import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../openapi';
import { CommonErrorResponses, SuccessResponseSchema } from './common';
import { LoginResponseSchema } from './auth';

extendZodWithOpenApi(z);

// WebAuthn Credential (returned from API)
export const WebAuthnCredentialSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable(),
    deviceType: z.string(),
    backedUp: z.boolean(),
    createdAt: z.string(),
    lastUsedAt: z.string().nullable(),
  })
  .openapi('WebAuthnCredential');

// Registration Options Request
export const WebAuthnRegisterOptionsRequestSchema = z
  .object({
    authenticatorType: z.enum(['platform', 'cross-platform']).optional(),
  })
  .openapi('WebAuthnRegisterOptionsRequest');

// Registration Options Response
export const WebAuthnRegisterOptionsResponseSchema = z
  .object({
    options: z.any().openapi({ description: 'PublicKeyCredentialCreationOptionsJSON' }),
    challengeId: z.string(),
  })
  .openapi('WebAuthnRegisterOptionsResponse');

// Registration Verify Request
export const WebAuthnRegisterVerifyRequestSchema = z
  .object({
    response: z.any().openapi({ description: 'RegistrationResponseJSON' }),
    challengeId: z.string(),
    name: z.string().max(100).optional(),
  })
  .openapi('WebAuthnRegisterVerifyRequest');

// Registration Verify Response
export const WebAuthnRegisterVerifyResponseSchema = z
  .object({
    success: z.literal(true),
    credential: WebAuthnCredentialSchema,
  })
  .openapi('WebAuthnRegisterVerifyResponse');

// Authentication Options Request
export const WebAuthnAuthenticateOptionsRequestSchema = z
  .object({
    username: z.string().optional(),
  })
  .openapi('WebAuthnAuthenticateOptionsRequest');

// Authentication Options Response
export const WebAuthnAuthenticateOptionsResponseSchema = z
  .object({
    options: z.any().openapi({ description: 'PublicKeyCredentialRequestOptionsJSON' }),
    challengeId: z.string(),
  })
  .openapi('WebAuthnAuthenticateOptionsResponse');

// Authentication Verify Request
export const WebAuthnAuthenticateVerifyRequestSchema = z
  .object({
    response: z.any().openapi({ description: 'AuthenticationResponseJSON' }),
    challengeId: z.string(),
  })
  .openapi('WebAuthnAuthenticateVerifyRequest');

// Credential List Response
export const WebAuthnCredentialListResponseSchema = z
  .object({
    credentials: z.array(WebAuthnCredentialSchema),
  })
  .openapi('WebAuthnCredentialListResponse');

// Credential Rename Request
export const WebAuthnCredentialRenameRequestSchema = z
  .object({
    name: z.string().min(1).max(100),
  })
  .openapi('WebAuthnCredentialRenameRequest');

// Register schemas with OpenAPI
registry.register('WebAuthnCredential', WebAuthnCredentialSchema);
registry.register('WebAuthnRegisterOptionsRequest', WebAuthnRegisterOptionsRequestSchema);
registry.register('WebAuthnRegisterOptionsResponse', WebAuthnRegisterOptionsResponseSchema);
registry.register('WebAuthnRegisterVerifyRequest', WebAuthnRegisterVerifyRequestSchema);
registry.register('WebAuthnRegisterVerifyResponse', WebAuthnRegisterVerifyResponseSchema);
registry.register('WebAuthnAuthenticateOptionsRequest', WebAuthnAuthenticateOptionsRequestSchema);
registry.register('WebAuthnAuthenticateOptionsResponse', WebAuthnAuthenticateOptionsResponseSchema);
registry.register('WebAuthnAuthenticateVerifyRequest', WebAuthnAuthenticateVerifyRequestSchema);
registry.register('WebAuthnCredentialListResponse', WebAuthnCredentialListResponseSchema);
registry.register('WebAuthnCredentialRenameRequest', WebAuthnCredentialRenameRequestSchema);

// Register WebAuthn paths
registry.registerPath({
  method: 'post',
  path: '/auth/webauthn/register/options',
  summary: 'Generate WebAuthn registration options',
  tags: ['WebAuthn'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: WebAuthnRegisterOptionsRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Registration options generated',
      content: {
        'application/json': {
          schema: WebAuthnRegisterOptionsResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/webauthn/register/verify',
  summary: 'Verify WebAuthn registration and store credential',
  tags: ['WebAuthn'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: WebAuthnRegisterVerifyRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Registration successful',
      content: {
        'application/json': {
          schema: WebAuthnRegisterVerifyResponseSchema,
        },
      },
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/webauthn/authenticate/options',
  summary: 'Generate WebAuthn authentication options',
  tags: ['WebAuthn'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: WebAuthnAuthenticateOptionsRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Authentication options generated',
      content: {
        'application/json': {
          schema: WebAuthnAuthenticateOptionsResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/webauthn/authenticate/verify',
  summary: 'Verify WebAuthn authentication and issue JWT',
  tags: ['WebAuthn'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: WebAuthnAuthenticateVerifyRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Authentication successful',
      content: {
        'application/json': {
          schema: LoginResponseSchema,
        },
      },
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
  },
});

registry.registerPath({
  method: 'get',
  path: '/auth/webauthn/credentials',
  summary: 'List registered passkeys for current user',
  tags: ['WebAuthn'],
  responses: {
    200: {
      description: 'List of credentials',
      content: {
        'application/json': {
          schema: WebAuthnCredentialListResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
  },
});

registry.registerPath({
  method: 'delete',
  path: '/auth/webauthn/credentials/{id}',
  summary: 'Delete a passkey',
  tags: ['WebAuthn'],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: 'Credential deleted',
      content: {
        'application/json': {
          schema: SuccessResponseSchema,
        },
      },
    },
    401: CommonErrorResponses[401],
    404: CommonErrorResponses[404],
  },
});

registry.registerPath({
  method: 'patch',
  path: '/auth/webauthn/credentials/{id}',
  summary: 'Rename a passkey',
  tags: ['WebAuthn'],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: WebAuthnCredentialRenameRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Credential renamed',
      content: {
        'application/json': {
          schema: WebAuthnCredentialSchema,
        },
      },
    },
    400: CommonErrorResponses[400],
    401: CommonErrorResponses[401],
    404: CommonErrorResponses[404],
  },
});
