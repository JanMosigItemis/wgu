import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Readable, Writable } from 'node:stream';
import { interactiveSelect } from '../src/lib/menu.js';

describe('interactiveSelect', () => {
  let mockExit;

  beforeEach(() => {
    mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    mockExit.mockRestore();
  });

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

    const items = [{ id: 'pkg1', currentVersion: '1.0.0', availableVersion: '1.1.0' }];

    const selectPromise = interactiveSelect(items, {
      stdout: stdoutMock,
      stdin: stdinMock,
    });

    // Simulate Ctrl+C keypress after a short delay
    setTimeout(() => {
      stdinMock.emit('keypress', null, { ctrl: true, name: 'c' });
    }, 300);

    const selectedItems = await selectPromise;

    // Assert - process.exit should NOT be called
    expect(mockExit).not.toHaveBeenCalled();
    expect(selectedItems).toBe(null);
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

    const items = [{ id: 'pkg1', currentVersion: '1.0.0', availableVersion: '1.1.0' }];

    const selectPromise = interactiveSelect(items, {
      stdout: stdoutMock,
      stdin: stdinMock,
    });

    // Simulate 'n' keypress
    setTimeout(() => {
      stdinMock.emit('keypress', 'n', { name: 'n' });
    }, 10);

    const selectedItems = await selectPromise;

    // Assert - should return empty array
    expect(selectedItems).toEqual([]);
  }, 1000);

  it('selects all packages by default when user presses y', async () => {
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

    const items = [
      { id: 'pkg1', currentVersion: '1.0.0', availableVersion: '1.1.0' },
      { id: 'pkg2', currentVersion: '2.0.0', availableVersion: '2.2.0' },
      { id: 'pkg3', currentVersion: '3.0.0', availableVersion: '3.3.0' },
    ];

    const selectPromise = interactiveSelect(items, {
      stdout: stdoutMock,
      stdin: stdinMock,
    });

    // Simulate 'y' keypress to accept defaults
    setTimeout(() => {
      stdinMock.emit('keypress', 'y', { name: 'y' });
    }, 300);

    const selectedItems = await selectPromise;

    const expectedSelection = items.map(item => item.id);
    expect(selectedItems).toEqual(expectedSelection);
  }, 1000);

  it('confirms selection when user presses enter', async () => {
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

    const items = [
      { id: 'pkg1', currentVersion: '1.0.0', availableVersion: '1.1.0' },
      { id: 'pkg2', currentVersion: '2.0.0', availableVersion: '2.2.0' },
      { id: 'pkg3', currentVersion: '3.0.0', availableVersion: '3.3.0' },
    ];

    const selectPromise = interactiveSelect(items, {
      stdout: stdoutMock,
      stdin: stdinMock,
    });

    // Simulate 'enter' keypress to confirm selection
    setTimeout(() => {
      stdinMock.emit('keypress', null, { name: 'return' });
    }, 10);

    const selectedItems = await selectPromise;

    const expectedSelection = items.map(item => item.id);
    expect(selectedItems).toEqual(expectedSelection);
  }, 1000);
});
