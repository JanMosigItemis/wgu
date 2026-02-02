import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Readable, Writable } from 'node:stream';
import { interactiveSelect } from '../src/lib/menu.js';

describe('interactiveSelect', () => {
  let originalExit;

  beforeEach(() => {
    originalExit = process.exit;
  });

  afterEach(() => {
    process.exit = originalExit;
  });

  it('handles Ctrl+C without calling process.exit', async () => {
    // Arrange
    const mockStdin = new Readable({
      read() {},
    });
    mockStdin.isTTY = true;
    mockStdin.setRawMode = vi.fn();

    const mockStdout = new Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    });

    const mockConsole = {
      log: vi.fn(),
    };

    const items = [{ id: 'pkg1', currentVersion: '1.0.0', availableVersion: '1.1.0' }, { id: 'pkg2', currentVersion: '2.0.0', availableVersion: '2.1.0' }];

    const mockExit = vi.fn();
    process.exit = mockExit;

    // Act - start the interactive select
    const selectPromise = interactiveSelect(items, {
      stdout: mockStdout,
      stdin: mockStdin,
      console: mockConsole,
    });

    // Simulate Ctrl+C keypress after a short delay
    await vi.waitFor(() => {
      mockStdin.emit('keypress', null, { ctrl: true, name: 'c' });
    }, { timeout: 100 });

    const result = await selectPromise;

    // Assert - process.exit should NOT be called
    expect(mockExit).not.toHaveBeenCalled();
    expect(result).toBe(null);
  }, 1000);
});
