import { loadConfig } from './config.js';
import { PaperlessMCPServer } from './server.js';

async function main() {
  try {
    const config = loadConfig();
    const server = new PaperlessMCPServer(config);
    await server.start();
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

await main();
