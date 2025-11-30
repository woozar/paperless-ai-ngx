export type LogLevel = 'none' | 'error' | 'info' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
  none: -1,
  error: 0,
  info: 1,
  debug: 2,
};

export class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = 'info') {
    this.level = level;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(messageLevel: LogLevel): boolean {
    return LOG_LEVELS[messageLevel] <= LOG_LEVELS[this.level];
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.log(...args);
    }
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.log(...args);
    }
  }
}

// Default logger instance
export const logger = new Logger();
