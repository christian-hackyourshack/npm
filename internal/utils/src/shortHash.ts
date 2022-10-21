import { createHash } from 'crypto';

export function shortHash(data: unknown, outputLength = 8) {
  const serialized = typeof data === 'string' ? data : JSON.stringify(data);
  return createHash('shake256', { outputLength }).update(serialized, 'utf8').digest('hex');
}

function fullHash(data: unknown) {
  const serialized = typeof data === 'string' ? data : JSON.stringify(data);
  return createHash('sha256').update(serialized, 'utf8').digest('hex');
}
