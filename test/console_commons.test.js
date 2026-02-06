import { describe, it, expect } from 'vitest';
import { Readable, Writable } from 'node:stream';
import { askPermissionToContinue } from '../src/lib/console_commons.js';

describe('askPermissionToContinue', () => {
  it('uses_provided_input_and_output_streams', async () => {
    let outputData = '';
    const mockOutput = new Writable({
      write(chunk, encoding, callback) {
        outputData += chunk.toString();
        callback();
      },
    });

    const mockInput = new Readable({
      read() {},
    });

    const resultPromise = askPermissionToContinue({ input: mockInput, output: mockOutput });

    // Simulate user input
    mockInput.push('y\n');
    mockInput.push(null); // End the stream

    const result = await resultPromise;

    expect(result).toBe(true);
    expect(outputData).toContain('Do you want to continue? (y/n): ');
  });
});
