import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateOpenAPIDocument } from '../lib/api/openapi';
import '../lib/api/schemas';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '../../../packages/api-client/openapi.json');

mkdirSync(dirname(outputPath), { recursive: true });

const spec = generateOpenAPIDocument();
writeFileSync(outputPath, JSON.stringify(spec, null, 2));

console.log(`OpenAPI spec generated at: ${outputPath}`);
