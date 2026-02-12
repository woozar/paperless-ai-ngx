import { PaperlessClient } from '@repo/paperless-client';
import { randomUUID } from 'node:crypto';

export interface SessionData {
  paperlessUrl: string;
  paperlessToken: string;
  client: PaperlessClient;
  createdAt: Date;
  lastAccessedAt: Date;
}

export class SessionManager {
  private readonly sessions: Map<string, SessionData> = new Map();
  private readonly sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours

  createSession(paperlessUrl: string, paperlessToken: string): string {
    const sessionId = randomUUID();
    const client = new PaperlessClient({
      baseUrl: paperlessUrl,
      token: paperlessToken,
    });

    this.sessions.set(sessionId, {
      paperlessUrl,
      paperlessToken,
      client,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
    });

    return sessionId;
  }

  getSession(sessionId: string): SessionData | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return undefined;
    }

    // Check if session expired
    const now = new Date();
    const age = now.getTime() - session.lastAccessedAt.getTime();
    if (age > this.sessionTimeout) {
      this.sessions.delete(sessionId);
      return undefined;
    }

    // Update last accessed time
    session.lastAccessedAt = now;
    return session;
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  // Cleanup expired sessions periodically
  cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [sessionId, session] of this.sessions.entries()) {
      const age = now.getTime() - session.lastAccessedAt.getTime();
      if (age > this.sessionTimeout) {
        this.sessions.delete(sessionId);
      }
    }
  }
}
