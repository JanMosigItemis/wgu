#!/usr/bin/env node

import { main } from './index.js';
import WGU_VERSION from './version.js';

const HELP_TEXT = `
wgu - Winget update on steroids

USAGE:
  wgu [options]

OPTIONS:
  --help, -h     Show this help message
  --version, -v  Show version

DESCRIPTION:
  Interactive CLI for managing Windows package updates via winget.
  Provides a menu-driven interface to select and update packages.

EXAMPLES:
  wgu              Run the interactive updater
  wgu --help       Display help
  wgu --version    Show version
`;

/**
 * Parse command line arguments
 * @param {string[]} args - Command line arguments
 * @returns {{ help: boolean, version: boolean, error: string | null }}
 */
function parseArgs(args) {
  const result = { help: false, version: false, error: null };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--version' || arg === '-v') {
      result.version = true;
    } else {
      result.error = `Unknown option: ${arg}`;
      return result;
    }
  }

  return result;
}

/**
 * CLI entry point
 */
async function cli() {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  if (parsed.error) {
    console.error(`Error: ${parsed.error}`);
    console.error('Use --help for usage information');
    process.exit(2);
  }

  if (parsed.help) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  if (parsed.version) {
    console.log(`wgu v${WGU_VERSION}`);
    process.exit(0);
  }

  const exitCode = await main();
  process.exit(exitCode);
}

cli().catch((err) => {
  console.error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
