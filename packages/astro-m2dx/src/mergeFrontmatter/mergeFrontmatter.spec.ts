import { join } from 'path';
import { describe, expect, test } from 'vitest';
import { mergeFrontmatter } from './mergeFrontmatter';

const fixtures = join(process.cwd(), 'fixtures');

const dir_d1 = join(fixtures, 'd1');
const dir_d11 = join(dir_d1, 'd11');
const dir_d111 = join(dir_d11, 'd111');
const dir_d2 = join(fixtures, 'd2');

const name = '_frontmatter.yaml';

describe('mergeFrontmatter', function () {
  test('not found', async function () {
    const actual = await mergeFrontmatter(name, dir_d2, dir_d2);
    const expected = undefined;
    expect(actual).toBe(expected);
  });

  test('top-level', async function () {
    const actual = await mergeFrontmatter(name, dir_d1, dir_d1);
    const expected = {
      template: 'd1',
      site: {
        author: 'Christian',
        url: 'astro-m2dx.netlify.app',
      },
    };
    expect(actual).toStrictEqual(expected);
  });

  test('two merged', async function () {
    const actual = await mergeFrontmatter(name, dir_d11, dir_d1);
    const expected = {
      template: 'd11',
      site: {
        author: 'Christian',
        url: 'astro-m2dx.netlify.app',
        published: new Date('2022-09-19'),
      },
    };
    expect(actual).toStrictEqual(expected);
  });

  test('three merged', async function () {
    const actual = await mergeFrontmatter(name, dir_d111, dir_d1);
    const expected = {
      template: 'd111',
      site: {
        author: 'Christian',
        url: 'astro-m2dx.netlify.app',
        published: new Date('2022-09-19'),
      },
      category: 'docs',
    };
    expect(actual).toStrictEqual(expected);
  });
});
