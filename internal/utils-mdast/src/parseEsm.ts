import { Parser } from 'acorn';
import type { Program } from 'estree';

export function parseEsm(src: string): Program {
  return Parser.parse(src, {
    sourceType: 'module',
    ecmaVersion: 'latest',
  }) as unknown as Program;
}
