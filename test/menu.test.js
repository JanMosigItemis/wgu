import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Readable, Writable } from 'node:stream';
import { setImmediate } from 'node:timers';
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

    // Simulate Ctrl+C keypress
    setImmediate(() => {
      stdinMock.emit('keypress', null, { ctrl: true, name: 'c' });
    });

    const selectedItems = await selectPromise;

    // Assert - process.exit should NOT be called
    expect(mockExit).not.toHaveBeenCalled();
    expect(selectedItems).toBe(null);
  });

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
    setImmediate(() => {
      stdinMock.emit('keypress', 'n', { name: 'n' });
    });

    const selectedItems = await selectPromise;

    // Assert - should return empty array
    expect(selectedItems).toEqual([]);
  });

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
    setImmediate(() => {
      stdinMock.emit('keypress', 'y', { name: 'y' });
    });

    const selectedItems = await selectPromise;

    const expectedSelection = items.map((item) => item.id);
    expect(selectedItems).toEqual(expectedSelection);
  });

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
    setImmediate(() => {
      stdinMock.emit('keypress', null, { name: 'return' });
    });

    const selectedItems = await selectPromise;

    const expectedSelection = items.map((item) => item.id);
    expect(selectedItems).toEqual(expectedSelection);
  });

  it('deselects all items when user presses a with all selected', async () => {
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

    // Simulate 'a' keypress to toggle all, then 'y' to confirm
    setImmediate(() => {
      stdinMock.emit('keypress', 'a', { name: 'a' });
      setImmediate(() => {
        stdinMock.emit('keypress', 'y', { name: 'y' });
      });
    });

    const selectedItems = await selectPromise;

    expect(selectedItems).toEqual([]);
  });

  it('selects all items when user presses a with some selected', async () => {
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

    // Simulate deselecting one item, then 'a' to select all, then 'y' to confirm
    setImmediate(() => {
      // Press space to deselect the first item
      stdinMock.emit('keypress', ' ', { name: 'space' });
      setImmediate(() => {
        // Press 'a' to select all
        stdinMock.emit('keypress', 'a', { name: 'a' });
        setImmediate(() => {
          // Press 'y' to confirm
          stdinMock.emit('keypress', 'y', { name: 'y' });
        });
      });
    });

    const selectedItems = await selectPromise;

    const expectedSelection = items.map((item) => item.id);
    expect(selectedItems).toEqual(expectedSelection);
  });

  it('selects all items when user presses a with none selected', async () => {
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

    // Simulate deselecting all items with 'a', then 'a' again to select all, then 'y' to confirm
    setImmediate(() => {
      // Press 'a' to deselect all (they start all selected)
      stdinMock.emit('keypress', 'a', { name: 'a' });
      setImmediate(() => {
        // Press 'a' again to select all
        stdinMock.emit('keypress', 'a', { name: 'a' });
        setImmediate(() => {
          // Press 'y' to confirm
          stdinMock.emit('keypress', 'y', { name: 'y' });
        });
      });
    });

    const selectedItems = await selectPromise;

    const expectedSelection = items.map((item) => item.id);
    expect(selectedItems).toEqual(expectedSelection);
  });
});
