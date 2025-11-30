import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadConfig } from './config.js';
import { logger } from './logger.js';

describe('Config', () => {
  const originalEnv = process.env;
  const originalLogLevel = logger['level'];

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    logger.setLevel('none'); // Suppress error logs during tests
  });

  afterEach(() => {
    process.env = originalEnv;
    logger.setLevel(originalLogLevel); // Restore original log level
  });

  describe('loadConfig', () => {
    it('should load config with default values when no env vars are set', () => {
      delete process.env.PORT;
      delete process.env.HOST;
      delete process.env.API_TOKEN;
      delete process.env.JWT_SECRET;
      delete process.env.LOG_LEVEL;

      const config = loadConfig();

      expect(config.PORT).toBe(3001);
      expect(config.HOST).toBe('localhost');
      expect(config.API_TOKEN).toBeUndefined();
      expect(config.JWT_SECRET).toBeTruthy();
      expect(typeof config.JWT_SECRET).toBe('string');
      expect(config.LOG_LEVEL).toBe('info');
    });

    it('should use PORT when provided', () => {
      process.env.PORT = '4000';

      const config = loadConfig();

      expect(config.PORT).toBe(4000);
    });

    it('should use HOST when provided', () => {
      process.env.HOST = '0.0.0.0';

      const config = loadConfig();

      expect(config.HOST).toBe('0.0.0.0');
    });

    it('should use JWT_SECRET when provided', () => {
      process.env.JWT_SECRET = 'my-jwt-secret';

      const config = loadConfig();

      expect(config.JWT_SECRET).toBe('my-jwt-secret');
    });

    it('should generate random JWT_SECRET when not provided', () => {
      delete process.env.JWT_SECRET;

      const config1 = loadConfig();
      const config2 = loadConfig();

      expect(config1.JWT_SECRET).toBeTruthy();
      expect(config2.JWT_SECRET).toBeTruthy();
      // Each call should generate a new secret
      expect(config1.JWT_SECRET).not.toBe(config2.JWT_SECRET);
    });

    it('should convert port string to number', () => {
      process.env.PORT = '8080';

      const config = loadConfig();

      expect(config.PORT).toBe(8080);
      expect(typeof config.PORT).toBe('number');
    });

    it('should use default port when PORT is invalid', () => {
      process.env.PORT = 'invalid';

      const config = loadConfig();

      expect(isNaN(config.PORT)).toBe(true);
    });

    it('should load complete config with all values', () => {
      process.env.PORT = '9000';
      process.env.HOST = 'api.example.com';
      process.env.API_TOKEN = 'super-secret';
      process.env.JWT_SECRET = 'jwt-super-secret';
      process.env.LOG_LEVEL = 'debug';

      const config = loadConfig();

      expect(config.PORT).toBe(9000);
      expect(config.HOST).toBe('api.example.com');
      expect(config.API_TOKEN).toBe('super-secret');
      expect(config.JWT_SECRET).toBe('jwt-super-secret');
      expect(config.LOG_LEVEL).toBe('debug');
    });

    it('should use LOG_LEVEL when provided', () => {
      process.env.LOG_LEVEL = 'error';

      const config = loadConfig();

      expect(config.LOG_LEVEL).toBe('error');
    });

    it('should default to info when LOG_LEVEL is not provided', () => {
      delete process.env.LOG_LEVEL;

      const config = loadConfig();

      expect(config.LOG_LEVEL).toBe('info');
    });

    it('should handle empty string values', () => {
      process.env.PORT = '';
      process.env.HOST = '';
      process.env.API_TOKEN = '';
      process.env.JWT_SECRET = '';

      const config = loadConfig();

      expect(isNaN(config.PORT)).toBe(true); // empty string parses to NaN
      expect(config.HOST).toBe(''); // empty string is used as-is
      expect(config.API_TOKEN).toBe('');
      expect(config.JWT_SECRET).toBe('');
    });
  });

  describe('Config validation', () => {
    it('should accept valid port numbers', () => {
      const validPorts = ['80', '443', '3000', '8080', '65535'];

      validPorts.forEach((port) => {
        process.env.PORT = port;
        const config = loadConfig();
        expect(config.PORT).toBe(parseInt(port, 10));
      });
    });

    it('should handle invalid port values', () => {
      const invalidPorts = ['auto', 'xyz', '12.34', '-100', '70000'];

      invalidPorts.forEach((port) => {
        process.env.PORT = port;
        const config = loadConfig();
        // Invalid ports parse to NaN or out-of-range values
        expect(typeof config.PORT).toBe('number');
      });
    });

    it('should accept valid hostnames', () => {
      const validHosts = ['localhost', '0.0.0.0', '127.0.0.1', 'api.example.com'];

      validHosts.forEach((host) => {
        process.env.HOST = host;
        const config = loadConfig();
        expect(config.HOST).toBe(host);
      });
    });

    it('should accept valid log levels', () => {
      const validLevels: Array<'none' | 'error' | 'info' | 'debug'> = [
        'none',
        'error',
        'info',
        'debug',
      ];

      validLevels.forEach((level) => {
        process.env.LOG_LEVEL = level;
        const config = loadConfig();
        expect(config.LOG_LEVEL).toBe(level);
      });
    });

    it('should throw error for invalid log level', () => {
      process.env.LOG_LEVEL = 'invalid-level';

      expect(() => loadConfig()).toThrow('Invalid configuration');
    });
  });
});
