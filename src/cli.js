#!/usr/bin/env node

import { main } from './index.js';
import WGU_VERSION from './lib/version.js';

const HELP_TEXT = `
wgu - Winget update on steroids

USAGE:
  wgu [options]

OPTIONS:
  --help, -h              Show this help message
  --version, -v           Show version
  --ignore-file <path>    Use custom ignore file instead of ~/.wguignore

DESCRIPTION:
  Interactive CLI for managing Windows package updates via winget.
  Provides a menu-driven interface to select and update packages.

EXAMPLES:
  wgu                              Run the interactive updater
  wgu --help                       Display help
  wgu --version                    Show version
  wgu --ignore-file myignore.txt   Use custom ignore file
`;

/**
 * Parse command line arguments
 * @param {string[]} args - Command line arguments
 * @returns {{ help: boolean, version: boolean, ignoreFilePath: string | null, error: string | null }}
 */
export function parseArgs(args) {
  const result = { help: false, version: false, ignoreFilePath: null, error: null };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--version' || arg === '-v') {
      result.version = true;
    } else if (arg === '--ignore-file') {
      const nextArg = args[i + 1];
      if (!nextArg || nextArg.startsWith('-')) {
        result.error = '--ignore-file requires a path argument';
        return result;
      }
      result.ignoreFilePath = nextArg;
      i++; // Skip the next argument since we consumed it
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

  const options = {};
  if (parsed.ignoreFilePath) {
    options.ignoreFilePath = parsed.ignoreFilePath;
  }

  const exitCode = await main(options);
  process.exit(exitCode);
}

cli().catch((err) => {
  console.error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
