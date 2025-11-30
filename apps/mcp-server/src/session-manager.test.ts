import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SessionManager } from './session-manager.js';

describe('SessionManager', () => {
  let sessionManager: SessionManager;

  beforeEach(() => {
    sessionManager = new SessionManager();
    vi.useFakeTimers();
  });

  describe('createSession', () => {
    it('should create a new session with valid credentials', () => {
      const sessionId = sessionManager.createSession('https://paperless.example.com', 'test-token');

      expect(sessionId).toBeTruthy();
      expect(typeof sessionId).toBe('string');
    });

    it('should create unique session IDs', () => {
      const sessionId1 = sessionManager.createSession('https://paperless.example.com', 'token1');
      const sessionId2 = sessionManager.createSession('https://paperless.example.com', 'token2');

      expect(sessionId1).not.toBe(sessionId2);
    });

    it('should store session data correctly', () => {
      const url = 'https://paperless.example.com';
      const token = 'test-token';
      const sessionId = sessionManager.createSession(url, token);

      const session = sessionManager.getSession(sessionId);

      expect(session).toBeDefined();
      expect(session?.paperlessUrl).toBe(url);
      expect(session?.paperlessToken).toBe(token);
      expect(session?.client).toBeDefined();
      expect(session?.createdAt).toBeInstanceOf(Date);
      expect(session?.lastAccessedAt).toBeInstanceOf(Date);
    });
  });

  describe('getSession', () => {
    it('should return session data for valid session ID', () => {
      const sessionId = sessionManager.createSession('https://paperless.example.com', 'test-token');

      const session = sessionManager.getSession(sessionId);

      expect(session).toBeDefined();
      expect(session?.paperlessUrl).toBe('https://paperless.example.com');
    });

    it('should return undefined for non-existent session ID', () => {
      const session = sessionManager.getSession('non-existent-id');

      expect(session).toBeUndefined();
    });

    it('should update lastAccessedAt when accessing session', () => {
      const sessionId = sessionManager.createSession('https://paperless.example.com', 'test-token');

      const initialSession = sessionManager.getSession(sessionId);
      const initialAccessTime = initialSession?.lastAccessedAt;

      vi.advanceTimersByTime(5000); // 5 seconds

      const updatedSession = sessionManager.getSession(sessionId);
      const updatedAccessTime = updatedSession?.lastAccessedAt;

      expect(updatedAccessTime?.getTime()).toBeGreaterThan(initialAccessTime?.getTime() || 0);
    });

    it('should return undefined for expired session', () => {
      const sessionId = sessionManager.createSession('https://paperless.example.com', 'test-token');

      // Advance time by more than 24 hours
      vi.advanceTimersByTime(25 * 60 * 60 * 1000);

      const session = sessionManager.getSession(sessionId);

      expect(session).toBeUndefined();
    });

    it('should automatically delete expired session when accessed', () => {
      const sessionId = sessionManager.createSession('https://paperless.example.com', 'test-token');

      // Advance time by more than 24 hours
      vi.advanceTimersByTime(25 * 60 * 60 * 1000);

      sessionManager.getSession(sessionId);

      // Try to get it again - should still be undefined
      const session = sessionManager.getSession(sessionId);
      expect(session).toBeUndefined();
    });
  });

  describe('deleteSession', () => {
    it('should delete an existing session', () => {
      const sessionId = sessionManager.createSession('https://paperless.example.com', 'test-token');

      const deleted = sessionManager.deleteSession(sessionId);

      expect(deleted).toBe(true);
      expect(sessionManager.getSession(sessionId)).toBeUndefined();
    });

    it('should return false when deleting non-existent session', () => {
      const deleted = sessionManager.deleteSession('non-existent-id');

      expect(deleted).toBe(false);
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should remove all expired sessions', () => {
      const sessionId1 = sessionManager.createSession('https://paperless.example.com', 'token1');
      const sessionId2 = sessionManager.createSession('https://paperless.example.com', 'token2');

      // Advance time by more than 24 hours
      vi.advanceTimersByTime(25 * 60 * 60 * 1000);

      const sessionId3 = sessionManager.createSession('https://paperless.example.com', 'token3');

      sessionManager.cleanupExpiredSessions();

      // Old sessions should be gone
      expect(sessionManager.getSession(sessionId1)).toBeUndefined();
      expect(sessionManager.getSession(sessionId2)).toBeUndefined();

      // New session should still exist
      expect(sessionManager.getSession(sessionId3)).toBeDefined();
    });

    it('should not remove active sessions', () => {
      const sessionId1 = sessionManager.createSession('https://paperless.example.com', 'token1');
      const sessionId2 = sessionManager.createSession('https://paperless.example.com', 'token2');

      // Advance time by 1 hour
      vi.advanceTimersByTime(60 * 60 * 1000);

      sessionManager.cleanupExpiredSessions();

      // Both sessions should still exist
      expect(sessionManager.getSession(sessionId1)).toBeDefined();
      expect(sessionManager.getSession(sessionId2)).toBeDefined();
    });

    it('should handle cleanup with no sessions', () => {
      expect(() => {
        sessionManager.cleanupExpiredSessions();
      }).not.toThrow();
    });

    it('should handle cleanup with mix of expired and active sessions', () => {
      // Create old session
      const oldSessionId = sessionManager.createSession(
        'https://paperless.example.com',
        'old-token'
      );

      // Advance time by 25 hours
      vi.advanceTimersByTime(25 * 60 * 60 * 1000);

      // Create new session
      const newSessionId = sessionManager.createSession(
        'https://paperless.example.com',
        'new-token'
      );

      sessionManager.cleanupExpiredSessions();

      expect(sessionManager.getSession(oldSessionId)).toBeUndefined();
      expect(sessionManager.getSession(newSessionId)).toBeDefined();
    });
  });

  describe('session timeout', () => {
    it('should keep session alive if accessed within timeout', () => {
      const sessionId = sessionManager.createSession('https://paperless.example.com', 'test-token');

      // Access every 12 hours for 3 days
      for (let i = 0; i < 6; i++) {
        vi.advanceTimersByTime(12 * 60 * 60 * 1000);
        const session = sessionManager.getSession(sessionId);
        expect(session).toBeDefined();
      }
    });

    it('should expire session after 24 hours of inactivity', () => {
      const sessionId = sessionManager.createSession('https://paperless.example.com', 'test-token');

      // Don't access for 24 hours + 1 second
      vi.advanceTimersByTime(24 * 60 * 60 * 1000 + 1000);

      const session = sessionManager.getSession(sessionId);
      expect(session).toBeUndefined();
    });
  });
});
