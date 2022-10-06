import { createHash } from 'crypto';

export function hash(data: string, length = 0) {
  if (length > 0) {
    return createHash('shake256', { outputLength: length }).update(data, 'utf8').digest('hex');
  } else {
    return createHash('sha256').update(data, 'utf8').digest('hex');
  }
}
