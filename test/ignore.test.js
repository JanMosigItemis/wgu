import { describe, it, expect, vi, beforeEach } from 'vitest';

const expectedIds = [
  'Package.One',
  'Package.Two',
  'Package.Three'
];
const fileContent = expectedIds.join('\n');

vi.mock('node:fs', () => ({
  readFileSync: vi.fn(() => fileContent)
}));

import { loadIgnoreList } from '../src/lib/ignore.js';
import { readFileSync } from 'node:fs';

describe('loadIgnoreList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns_package_ids_from_wguignore_file_in_home_directory', () => {
    const ignoreFilePath = 'C:\\Users\\testuser\\.wguignore';

    const result = loadIgnoreList(ignoreFilePath);

    expect(readFileSync).toHaveBeenCalledWith(ignoreFilePath, 'utf8');
    expect(result).toEqual(expectedIds);
  });
});
