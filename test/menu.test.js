import { describe, it, expect, vi } from 'vitest';
import { Readable, Writable } from 'node:stream';
import { interactiveSelect } from '../src/lib/menu.js';

describe('interactiveSelect', () => {
  it('handles Ctrl+C without calling process.exit', async () => {
    const stdinMock = new Readable({
      read() {},
    });
    stdinMock.isTTY = true;
    stdinMock.setRawMode = vi.fn();

    const stdoutMock = new Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    });

    const loggerMock = {
      log: vi.fn(),
    };

    const items = [{ id: 'pkg1', currentVersion: '1.0.0', availableVersion: '1.1.0' }];

    const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {});

    const selectPromise = interactiveSelect(items, {
      stdout: stdoutMock,
      stdin: stdinMock,
      logger: loggerMock,
    });

    // Simulate Ctrl+C keypress after a short delay
    await vi.waitFor(() => {
      stdinMock.emit('keypress', null, { ctrl: true, name: 'c' });
    }, { timeout: 300 });

    const selectedItems = await selectPromise;

    // Assert - process.exit should NOT be called
    expect(mockExit).not.toHaveBeenCalled();
    expect(selectedItems).toBe(null);

    mockExit.mockRestore();
  }, 1000);

  it('quits when user presses n', async () => {
    const stdinMock = new Readable({
      read() {},
    });
    stdinMock.isTTY = true;
    stdinMock.setRawMode = vi.fn();

    const stdoutMock = new Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    });

    const loggerMock = {
      log: vi.fn(),
    };

    const items = [{ id: 'pkg1', currentVersion: '1.0.0', availableVersion: '1.1.0' }];

    const selectPromise = interactiveSelect(items, {
      stdout: stdoutMock,
      stdin: stdinMock,
      logger: loggerMock,
    });

    // Simulate 'n' keypress
    await vi.waitFor(() => {
      stdinMock.emit('keypress', 'n', { name: 'n' });
    }, { timeout: 300 });

    const selectedItems = await selectPromise;

    // Assert - should return empty array
    expect(selectedItems).toEqual([]);
  }, 1000);
});
