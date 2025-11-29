import { describe, it, expect } from 'vitest';
import { ApiResponses } from './responses';

describe('ApiResponses', () => {
  describe('notFound', () => {
    it('returns default message when no message provided', async () => {
      const response = ApiResponses.notFound();
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('error.notFound');
    });

    it('returns custom message when provided', async () => {
      const response = ApiResponses.notFound('error.customNotFound');
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('error.customNotFound');
    });
  });

  describe('badRequest', () => {
    it('returns default message when no message provided', async () => {
      const response = ApiResponses.badRequest();
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('error.invalidRequest');
    });

    it('returns custom message when provided', async () => {
      const response = ApiResponses.badRequest('error.customBadRequest');
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('error.customBadRequest');
    });
  });

  describe('conflict', () => {
    it('returns default message when no message provided', async () => {
      const response = ApiResponses.conflict();
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.message).toBe('error.conflict');
    });

    it('returns custom message when provided', async () => {
      const response = ApiResponses.conflict('error.customConflict');
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.message).toBe('error.customConflict');
    });
  });

  describe('serverError', () => {
    it('returns default message when no message provided', async () => {
      const response = ApiResponses.serverError();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('error.serverError');
    });

    it('returns custom message when provided', async () => {
      const response = ApiResponses.serverError('error.customServerError');
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('error.customServerError');
    });
  });

  describe('usernameExists', () => {
    it('returns response without params when not provided', async () => {
      const response = ApiResponses.usernameExists();
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.message).toBe('error.usernameExists');
      expect(data.params).toBeUndefined();
    });

    it('returns response with params when provided', async () => {
      const response = ApiResponses.usernameExists({ username: 'testuser' });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.message).toBe('error.usernameExists');
      expect(data.params).toEqual({ username: 'testuser' });
    });
  });
});
