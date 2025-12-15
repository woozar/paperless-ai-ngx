import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PATCH, DELETE } from './route';

vi.mock('@repo/database', () => ({
  prisma: {
    paperlessInstance: {
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth/jwt', () => ({
  getAuthUser: vi.fn(),
}));

vi.mock('@/lib/crypto/encryption', () => ({
  encrypt: vi.fn(),
}));

vi.mock('@/lib/scheduler', () => ({
  calculateNextScanTime: vi.fn(),
  scheduler: {
    scheduleInstance: vi.fn(),
    unscheduleInstance: vi.fn(),
  },
}));

import { prisma } from '@repo/database';
import { calculateNextScanTime, scheduler } from '@/lib/scheduler';
import { getAuthUser } from '@/lib/auth/jwt';
import { encrypt } from '@/lib/crypto/encryption';
import { mockPrisma } from '@/test-utils/prisma-mock';

const mockedPrisma = mockPrisma<{
  paperlessInstance: {
    findFirst: typeof prisma.paperlessInstance.findFirst;
    update: typeof prisma.paperlessInstance.update;
    delete: typeof prisma.paperlessInstance.delete;
  };
}>(prisma);

const mockContext = (id: string) => ({
  params: Promise.resolve({ id }),
});

function mockAdmin() {
  vi.mocked(getAuthUser).mockResolvedValueOnce({
    userId: 'admin-1',
    username: 'admin',
    role: 'ADMIN',
  });
}

describe('GET /api/paperless-instances/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1');
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns instance details', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1');
    const response = await GET(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('My Paperless');
    expect(data.apiToken).toBe('***');
  });
});

describe('PATCH /api/paperless-instances/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid request body', async () => {
    mockAdmin();

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: '', apiUrl: 'not-a-url' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('returns 409 when new name already exists', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst
      .mockResolvedValueOnce({
        id: 'instance-1',
        name: 'Old Name',
      })
      .mockResolvedValueOnce({
        id: 'other-instance',
        name: 'New Name',
      });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.message).toBe('paperlessInstanceNameExists');
  });

  it('successfully updates instance', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst
      .mockResolvedValueOnce({
        id: 'instance-1',
        name: 'Old Name',
      })
      .mockResolvedValueOnce(null);
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'New Name',
      apiUrl: 'https://paperless.example.com',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('New Name');
    expect(data.apiToken).toBe('***');
  });

  it('updates apiToken when provided', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
    });
    vi.mocked(encrypt).mockReturnValueOnce('new-encrypted-token');
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
      apiUrl: 'https://paperless.example.com',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ apiToken: 'new-secret-token' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));

    expect(response.status).toBe(200);
    expect(vi.mocked(encrypt)).toHaveBeenCalledWith('new-secret-token');
  });

  it('does not update apiToken when not provided', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst
      .mockResolvedValueOnce({
        id: 'instance-1',
        name: 'Old Name',
      })
      .mockResolvedValueOnce(null);
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'New Name',
      apiUrl: 'https://paperless.example.com',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'New Name' }),
    });
    await PATCH(request, mockContext('instance-1'));

    expect(vi.mocked(encrypt)).not.toHaveBeenCalled();
  });

  it('updates apiUrl', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
    });
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
      apiUrl: 'https://new-url.example.com',
      isActive: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ apiUrl: 'https://new-url.example.com' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.apiUrl).toBe('https://new-url.example.com');
  });

  it('updates importFilterTags when provided', async () => {
    const mockDate = new Date();
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      ownerId: 'admin-1',
    });
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://example.com',
      importFilterTags: [1, 2, 3],
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ importFilterTags: [1, 2, 3] }),
    });
    const response = await PATCH(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.importFilterTags).toEqual([1, 2, 3]);
  });

  it('schedules instance when enabling autoProcessEnabled', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    const nextScanTime = new Date('2024-01-15T10:30:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      autoProcessEnabled: false,
      scanCronExpression: '*/30 * * * *',
    });
    vi.mocked(calculateNextScanTime).mockReturnValueOnce(nextScanTime);
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://example.com',
      autoProcessEnabled: true,
      scanCronExpression: '*/30 * * * *',
      nextScanAt: nextScanTime,
      lastScanAt: null,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ autoProcessEnabled: true }),
    });
    const response = await PATCH(request, mockContext('instance-1'));

    expect(response.status).toBe(200);
    expect(calculateNextScanTime).toHaveBeenCalledWith('*/30 * * * *');
    expect(scheduler.scheduleInstance).toHaveBeenCalledWith(
      'instance-1',
      'Test Instance',
      '*/30 * * * *',
      nextScanTime
    );
  });

  it('unschedules instance and clears nextScanAt when disabling autoProcessEnabled', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      autoProcessEnabled: true,
      scanCronExpression: '*/30 * * * *',
    });
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://example.com',
      autoProcessEnabled: false,
      scanCronExpression: '*/30 * * * *',
      nextScanAt: null,
      lastScanAt: null,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ autoProcessEnabled: false }),
    });
    const response = await PATCH(request, mockContext('instance-1'));

    expect(response.status).toBe(200);
    expect(scheduler.unscheduleInstance).toHaveBeenCalledWith('instance-1');
    // Verify nextScanAt was set to null in the update
    expect(mockedPrisma.paperlessInstance.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          nextScanAt: null,
        }),
      })
    );
  });

  it('reschedules instance when updating scanCronExpression while autoProcessEnabled', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    const nextScanTime = new Date('2024-01-15T11:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      autoProcessEnabled: true,
      scanCronExpression: '*/30 * * * *',
    });
    vi.mocked(calculateNextScanTime).mockReturnValueOnce(nextScanTime);
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://example.com',
      autoProcessEnabled: true,
      scanCronExpression: '0 * * * *',
      nextScanAt: nextScanTime,
      lastScanAt: null,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ scanCronExpression: '0 * * * *' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));

    expect(response.status).toBe(200);
    expect(scheduler.scheduleInstance).toHaveBeenCalledWith(
      'instance-1',
      'Test Instance',
      '0 * * * *',
      nextScanTime
    );
  });

  it('recalculates nextScanAt when updating scanCronExpression with existing autoProcessEnabled', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    const nextScanTime = new Date('2024-01-15T11:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      autoProcessEnabled: true, // Already enabled
      scanCronExpression: '*/30 * * * *',
    });
    vi.mocked(calculateNextScanTime).mockReturnValueOnce(nextScanTime);
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://example.com',
      autoProcessEnabled: true,
      scanCronExpression: '0 * * * *',
      nextScanAt: nextScanTime,
      lastScanAt: null,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ scanCronExpression: '0 * * * *' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));

    expect(response.status).toBe(200);
    expect(calculateNextScanTime).toHaveBeenCalledWith('0 * * * *');
  });

  it('does not recalculate nextScanAt when updating scanCronExpression with autoProcessEnabled disabled', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      autoProcessEnabled: false, // Disabled
      scanCronExpression: '*/30 * * * *',
    });
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://example.com',
      autoProcessEnabled: false,
      scanCronExpression: '0 * * * *',
      nextScanAt: null,
      lastScanAt: null,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ scanCronExpression: '0 * * * *' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));

    expect(response.status).toBe(200);
    // nextScanAt should not be recalculated when autoProcessEnabled is false
    expect(calculateNextScanTime).not.toHaveBeenCalled();
  });

  it('updates auto-apply settings', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
    });
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://example.com',
      autoApplyTitle: true,
      autoApplyCorrespondent: true,
      autoApplyDocumentType: true,
      autoApplyTags: true,
      autoApplyDate: true,
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({
        autoApplyTitle: true,
        autoApplyCorrespondent: true,
        autoApplyDocumentType: true,
        autoApplyTags: true,
        autoApplyDate: true,
      }),
    });
    const response = await PATCH(request, mockContext('instance-1'));

    expect(response.status).toBe(200);
    expect(mockedPrisma.paperlessInstance.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          autoApplyTitle: true,
          autoApplyCorrespondent: true,
          autoApplyDocumentType: true,
          autoApplyTags: true,
          autoApplyDate: true,
        }),
      })
    );
  });

  it('updates defaultAiBotId', async () => {
    const mockDate = new Date('2024-01-15T10:00:00Z');
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
    });
    mockedPrisma.paperlessInstance.update.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'Test Instance',
      apiUrl: 'https://example.com',
      defaultAiBotId: 'bot-123',
      createdAt: mockDate,
      updatedAt: mockDate,
    });

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'PATCH',
      body: JSON.stringify({ defaultAiBotId: 'bot-123' }),
    });
    const response = await PATCH(request, mockContext('instance-1'));

    expect(response.status).toBe(200);
    expect(mockedPrisma.paperlessInstance.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          defaultAiBotId: 'bot-123',
        }),
      })
    );
  });
});

describe('DELETE /api/paperless-instances/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when instance not found', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('instance-1'));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe('paperlessInstanceNotFound');
  });

  it('successfully deletes instance', async () => {
    mockAdmin();
    mockedPrisma.paperlessInstance.findFirst.mockResolvedValueOnce({
      id: 'instance-1',
      name: 'My Paperless',
    });
    mockedPrisma.paperlessInstance.delete.mockResolvedValueOnce({} as any);

    const request = new NextRequest('http://localhost/api/paperless-instances/instance-1', {
      method: 'DELETE',
    });
    const response = await DELETE(request, mockContext('instance-1'));

    expect(response.status).toBe(204);
    expect(mockedPrisma.paperlessInstance.delete).toHaveBeenCalledWith({
      where: { id: 'instance-1' },
    });
  });
});
