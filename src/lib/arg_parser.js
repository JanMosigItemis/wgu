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
