import type { Fn } from './Fn';

export type Suite = {
  (name: string, fn: Fn): void;
  only(name: string, fn: Fn): void;
  skip(name: string, fn: Fn): void;
  beforeAll(fn: Fn): void;
  beforeEach(fn: Fn): void;
  afterEach(fn: Fn): void;
  afterAll(fn: Fn): void;
};
