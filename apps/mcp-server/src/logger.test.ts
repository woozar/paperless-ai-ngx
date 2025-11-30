import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Logger } from './logger.js';

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('constructor', () => {
    it('should create logger with default level info', () => {
      const logger = new Logger();

      logger.error('error message');
      logger.info('info message');
      logger.debug('debug message');

      expect(consoleErrorSpy).toHaveBeenCalledWith('error message');
      expect(consoleLogSpy).toHaveBeenCalledWith('info message');
      expect(consoleLogSpy).not.toHaveBeenCalledWith('debug message');
    });

    it('should create logger with specified level', () => {
      const logger = new Logger('debug');

      logger.debug('debug message');

      expect(consoleLogSpy).toHaveBeenCalledWith('debug message');
    });
  });

  describe('setLevel', () => {
    it('should change log level', () => {
      const logger = new Logger('error');

      logger.info('should not log');
      expect(consoleLogSpy).not.toHaveBeenCalled();

      logger.setLevel('info');
      logger.info('should log');
      expect(consoleLogSpy).toHaveBeenCalledWith('should log');
    });
  });

  describe('none level', () => {
    it('should not log any messages', () => {
      const logger = new Logger('none');

      logger.error('error message');
      logger.info('info message');
      logger.debug('debug message');

      expect(consoleErrorSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('error level', () => {
    it('should only log error messages', () => {
      const logger = new Logger('error');

      logger.error('error message');
      logger.info('info message');
      logger.debug('debug message');

      expect(consoleErrorSpy).toHaveBeenCalledWith('error message');
      expect(consoleLogSpy).not.toHaveBeenCalledWith('info message');
      expect(consoleLogSpy).not.toHaveBeenCalledWith('debug message');
    });

    it('should log error with multiple arguments', () => {
      const logger = new Logger('error');

      logger.error('error:', { code: 500 }, 'details');

      expect(consoleErrorSpy).toHaveBeenCalledWith('error:', { code: 500 }, 'details');
    });
  });

  describe('info level', () => {
    it('should log error and info messages', () => {
      const logger = new Logger('info');

      logger.error('error message');
      logger.info('info message');
      logger.debug('debug message');

      expect(consoleErrorSpy).toHaveBeenCalledWith('error message');
      expect(consoleLogSpy).toHaveBeenCalledWith('info message');
      expect(consoleLogSpy).not.toHaveBeenCalledWith('debug message');
    });

    it('should log info with multiple arguments', () => {
      const logger = new Logger('info');

      logger.info('Server started on', 'localhost', 3001);

      expect(consoleLogSpy).toHaveBeenCalledWith('Server started on', 'localhost', 3001);
    });
  });

  describe('debug level', () => {
    it('should log all messages', () => {
      const logger = new Logger('debug');

      logger.error('error message');
      logger.info('info message');
      logger.debug('debug message');

      expect(consoleErrorSpy).toHaveBeenCalledWith('error message');
      expect(consoleLogSpy).toHaveBeenCalledWith('info message');
      expect(consoleLogSpy).toHaveBeenCalledWith('debug message');
    });

    it('should log debug with multiple arguments', () => {
      const logger = new Logger('debug');

      logger.debug('Request:', { method: 'GET', path: '/api' });

      expect(consoleLogSpy).toHaveBeenCalledWith('Request:', {
        method: 'GET',
        path: '/api',
      });
    });
  });

  describe('log level hierarchy', () => {
    it('should respect none < error < info < debug hierarchy', () => {
      const noneLogger = new Logger('none');
      const errorLogger = new Logger('error');
      const infoLogger = new Logger('info');
      const debugLogger = new Logger('debug');

      // none level: nothing
      noneLogger.error('e0');
      noneLogger.info('i0');
      noneLogger.debug('d0');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);

      consoleErrorSpy.mockClear();
      consoleLogSpy.mockClear();

      // error level: only errors
      errorLogger.error('e1');
      errorLogger.info('i1');
      errorLogger.debug('d1');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);

      consoleErrorSpy.mockClear();
      consoleLogSpy.mockClear();

      // info level: errors + info
      infoLogger.error('e2');
      infoLogger.info('i2');
      infoLogger.debug('d2');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);

      consoleErrorSpy.mockClear();
      consoleLogSpy.mockClear();

      // debug level: all
      debugLogger.error('e3');
      debugLogger.info('i3');
      debugLogger.debug('d3');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('should handle undefined and null arguments', () => {
      const logger = new Logger('debug');

      logger.info(undefined, null);

      expect(consoleLogSpy).toHaveBeenCalledWith(undefined, null);
    });

    it('should handle objects and arrays', () => {
      const logger = new Logger('debug');

      const obj = { key: 'value' };
      const arr = [1, 2, 3];

      logger.debug(obj, arr);

      expect(consoleLogSpy).toHaveBeenCalledWith(obj, arr);
    });

    it('should handle empty arguments', () => {
      const logger = new Logger('debug');

      logger.info();

      expect(consoleLogSpy).toHaveBeenCalledWith();
    });
  });

  describe('multiple loggers', () => {
    it('should allow different log levels for different instances', () => {
      const errorLogger = new Logger('error');
      const debugLogger = new Logger('debug');

      errorLogger.info('should not log');
      debugLogger.info('should log');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith('should log');
    });
  });
});
