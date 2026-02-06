import { describe, it, expect } from 'vitest';
import { parseArgs } from '../src/lib/arg_parser.js';

describe('parseArgs', () => {
  it('returns_default_values_when_no_arguments_are_provided', () => {
    const result = parseArgs([]);

    expect(result).toEqual({ help: false, version: false, ignoreFilePath: null, error: null });
  });

  it('sets_help_to_true_when_help_flag_is_provided', () => {
    const result = parseArgs(['--help']);

    expect(result.help).toBe(true);
    expect(result.version).toBe(false);
    expect(result.error).toBe(null);
  });

  it('sets_help_to_true_when_short_help_flag_is_provided', () => {
    const result = parseArgs(['-h']);

    expect(result.help).toBe(true);
    expect(result.version).toBe(false);
    expect(result.error).toBe(null);
  });

  it('sets_version_to_true_when_version_flag_is_provided', () => {
    const result = parseArgs(['--version']);

    expect(result.help).toBe(false);
    expect(result.version).toBe(true);
    expect(result.error).toBe(null);
  });

  it('sets_version_to_true_when_short_version_flag_is_provided', () => {
    const result = parseArgs(['-v']);

    expect(result.help).toBe(false);
    expect(result.version).toBe(true);
    expect(result.error).toBe(null);
  });

  it('returns_error_when_unknown_option_is_provided', () => {
    const result = parseArgs(['--unknown']);

    expect(result.error).toBe('Unknown option: --unknown');
    expect(result.help).toBe(false);
    expect(result.version).toBe(false);
  });

  it('returns_error_immediately_when_unknown_option_is_encountered', () => {
    const result = parseArgs(['--help', '--unknown']);

    expect(result.error).toBe('Unknown option: --unknown');
  });

  it('accepts_multiple_valid_flags', () => {
    const result = parseArgs(['--help', '--version']);

    expect(result.help).toBe(true);
    expect(result.version).toBe(true);
    expect(result.error).toBe(null);
  });

  it('sets_ignoreFilePath_when_ignore_file_flag_is_provided_with_path', () => {
    const result = parseArgs(['--ignore-file', 'C:\\custom\\ignore.txt']);

    expect(result.ignoreFilePath).toBe('C:\\custom\\ignore.txt');
    expect(result.error).toBe(null);
  });

  it('returns_error_when_ignore_file_flag_is_provided_without_path', () => {
    const result = parseArgs(['--ignore-file']);

    expect(result.error).toBe('--ignore-file requires a path argument');
  });

  it('returns_error_when_ignore_file_path_starts_with_dash', () => {
    const result = parseArgs(['--ignore-file', '--help']);

    expect(result.error).toBe('--ignore-file requires a path argument');
  });

  it('accepts_ignore_file_with_other_flags', () => {
    // prettier-ignore
    const result = parseArgs([
      '--help',
      '--ignore-file',
      'myfile.txt'
    ]);

    expect(result.help).toBe(true);
    expect(result.ignoreFilePath).toBe('myfile.txt');
    expect(result.error).toBe(null);
  });
});
