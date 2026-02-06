import { readFileSync } from 'node:fs';

export function loadIgnoreList(ignoreFilePath) {
  const content = readFileSync(ignoreFilePath, 'utf8');
  return content
    .split('\n')
    .filter((line) => !line.trim().startsWith('#'));
}
