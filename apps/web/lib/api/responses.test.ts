import { describe, it, expect } from 'vitest';
import { ApiResponses } from './responses';

describe('ApiResponses', () => {
  describe('notFound', () => {
    it('returns default message when no message provided', async () => {
      const response = ApiResponses.notFound();
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('notFound');
    });

    it('returns custom message when provided', async () => {
      const response = ApiResponses.notFound('customNotFound');
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('customNotFound');
    });
  });

  describe('badRequest', () => {
    it('returns default message when no message provided', async () => {
      const response = ApiResponses.badRequest();
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('invalidRequest');
    });

    it('returns custom message when provided', async () => {
      const response = ApiResponses.badRequest('customBadRequest');
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('customBadRequest');
    });
  });

  describe('conflict', () => {
    it('returns default message when no message provided', async () => {
      const response = ApiResponses.conflict();
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.message).toBe('conflict');
    });

    it('returns custom message when provided', async () => {
      const response = ApiResponses.conflict('customConflict');
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.message).toBe('customConflict');
    });
  });

  describe('serverError', () => {
    it('returns default message when no message provided', async () => {
      const response = ApiResponses.serverError();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('serverError');
    });

    it('returns custom message when provided', async () => {
      const response = ApiResponses.serverError('customServerError');
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe('customServerError');
    });
  });

  describe('usernameExists', () => {
    it('returns response without params when not provided', async () => {
      const response = ApiResponses.usernameExists();
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.message).toBe('usernameExists');
      expect(data.params).toBeUndefined();
    });

    it('returns response with params when provided', async () => {
      const response = ApiResponses.usernameExists({ username: 'testuser' });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.message).toBe('usernameExists');
      expect(data.params).toEqual({ username: 'testuser' });
    });
  });

  describe('webauthnNotSupported', () => {
    it('returns 400 with webauthnNotSupported message', async () => {
      const response = ApiResponses.webauthnNotSupported();
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('webauthnNotSupported');
      expect(data.error).toBe('WebAuthn error');
    });
  });
});
