import { readFileSync } from 'node:fs';

export function loadIgnoreList(ignoreFilePath) {
  const content = readFileSync(ignoreFilePath, 'utf8');
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'));
}
