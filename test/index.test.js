import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Writable, Readable } from 'node:stream';

vi.mock('../src/lib/os.js', () => ({
  assertWindows: vi.fn(),
  assertWingetAvailable: vi.fn(),
}));

vi.mock('../src/lib/wgu_i18n.js', () => ({
  getWindowsUserLang: vi.fn(() => 'en'),
  isLocaleSupported: vi.fn(() => true),
}));

vi.mock('../src/lib/winget.js', () => ({
  getUpdateCandidates: vi.fn(() => []),
  runUpdates: vi.fn(),
}));

vi.mock('../src/lib/menu.js', () => ({
  interactiveSelect: vi.fn(() => []),
}));

vi.mock('../src/lib/ignore.js', () => ({
  loadIgnoreList: vi.fn(() => ['Package.One', 'Package.Two']),
}));

vi.mock('node:os', () => ({
  homedir: vi.fn(() => 'C:\\Users\\TestUser'),
}));

import { main } from '../src/index.js';
import { getUpdateCandidates } from '../src/lib/winget.js';
import { loadIgnoreList } from '../src/lib/ignore.js';
import { homedir } from 'node:os';
import { join } from 'node:path';

describe('main', () => {
  let mockStdout;
  let mockStderr;
  let mockStdin;
  let mockLogger;

  beforeEach(() => {
    vi.clearAllMocks();

    mockStdout = new Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    });

    mockStderr = new Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    });

    mockStdin = new Readable({
      read() {},
    });
    mockStdin.isTTY = true;
    mockStdin.setRawMode = vi.fn();

    mockLogger = {
      log: vi.fn(),
      error: vi.fn(),
    };

    vi.spyOn(process, 'on').mockImplementation(() => {});
  });

  it('loads_ignore_list_from_wguignore_in_home_directory_and_passes_to_getUpdateCandidates', async () => {
    const expectedHomedir = 'C:\\Users\\TestUser';
    const expectedIgnoreFilePath = join(expectedHomedir, '.wguignore');
    const expectedIgnoreList = ['Package.One', 'Package.Two'];

    await main({ stdout: mockStdout, stderr: mockStderr, stdin: mockStdin, logger: mockLogger });

    expect(homedir).toHaveBeenCalled();
    expect(loadIgnoreList).toHaveBeenCalledWith(expectedIgnoreFilePath);
    expect(getUpdateCandidates).toHaveBeenCalledWith('en', expectedIgnoreList);
  });
});
