import { createHash } from 'crypto';

export function fullHash(data: unknown) {
  const serialized = typeof data === 'string' ? data : JSON.stringify(data);
  return createHash('sha256').update(serialized, 'utf8').digest('hex');
}
