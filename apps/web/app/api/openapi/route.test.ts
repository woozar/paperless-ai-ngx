import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

vi.mock('@/lib/api/openapi', () => ({
  generateOpenAPIDocument: vi.fn(),
}));

vi.mock('@/lib/api/schemas', () => ({}));

import { generateOpenAPIDocument } from '@/lib/api/openapi';

describe('GET /api/openapi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns OpenAPI specification as JSON', async () => {
    const mockSpec = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
      },
      paths: {},
    };

    vi.mocked(generateOpenAPIDocument).mockReturnValueOnce(mockSpec);

    const response = await GET();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockSpec);
    expect(generateOpenAPIDocument).toHaveBeenCalled();
  });

  it('calls generateOpenAPIDocument exactly once', async () => {
    vi.mocked(generateOpenAPIDocument).mockReturnValueOnce({
      openapi: '3.0.0',
      info: { title: 'API', version: '1.0.0' },
      paths: {},
    });

    await GET();

    expect(generateOpenAPIDocument).toHaveBeenCalledTimes(1);
  });
});
