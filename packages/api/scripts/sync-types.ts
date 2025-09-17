#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const workerConfigPath = join(__dirname, '..', 'worker-configuration.d.ts');
const apiTypesPath = join(__dirname, '..', 'src', 'types', 'cloudflare.ts');

// Read the generated worker configuration
const workerConfig = readFileSync(workerConfigPath, 'utf-8');

// Extract the Cloudflare.Env interface
const bindingsMatch = workerConfig.match(/namespace Cloudflare \{\s*interface Env \{(.*?)\}\s*\}/s);

if (!bindingsMatch) {
	console.error('Could not find Cloudflare.Env interface in worker-configuration.d.ts');
	process.exit(1);
}

const bindingsContent = bindingsMatch[1].trim();

// Generate the API types file
const sharedTypesContent = `// Cloudflare types for the API package
// Auto-generated from worker-configuration.d.ts
// Run 'bun run cf-typegen:export' to update

export interface CloudflareBindings {
${bindingsContent}
}`;

writeFileSync(apiTypesPath, sharedTypesContent);
console.log('✅ CloudflareBindings types synced to API package!');
