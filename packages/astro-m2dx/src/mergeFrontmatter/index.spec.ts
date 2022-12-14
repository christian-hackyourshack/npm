import { assert, describe } from 'mintest-green';
import { join } from 'path';
import { mergeFrontmatter } from '.';

const fixtures = join(process.cwd(), 'fixtures', 'mergeFrontmatter');

const dir_d1 = join(fixtures, 'd1');
const dir_d11 = join(dir_d1, 'd11');
const dir_d111 = join(dir_d11, 'd111');
const dir_d2 = join(fixtures, 'd2');
const dir_rp = join(fixtures, 'relativePaths');
const dir_rp_sub = join(dir_rp, 'sub');

const name = '_frontmatter.yaml';

export const result = await describe('mergeFrontmatter', function (test) {
  test('not found', async function () {
    const actual = await mergeFrontmatter(name, dir_d2, dir_d2, false);
    const expected = undefined;
    assert.equal(actual, expected);
  });

  test('top-level', async function () {
    const actual = await mergeFrontmatter(name, dir_d1, dir_d1, false);
    const expected = {
      template: 'd1',
      site: {
        author: 'Christian',
        url: 'astro-m2dx.netlify.app',
      },
    };
    assert.deepStrictEqual(actual, expected);
  });

  test('two merged', async function () {
    const actual = await mergeFrontmatter(name, dir_d11, dir_d1, false);
    const expected = {
      template: 'd11',
      site: {
        author: 'Christian',
        url: 'astro-m2dx.netlify.app',
        published: new Date('2022-09-19'),
      },
    };
    assert.deepStrictEqual(actual, expected);
  });

  test('three merged', async function () {
    const actual = await mergeFrontmatter(name, dir_d111, dir_d1, false);
    const expected = {
      template: 'd111',
      site: {
        author: 'Christian',
        url: 'astro-m2dx.netlify.app',
        published: new Date('2022-09-19'),
      },
      category: 'docs',
    };
    assert.deepStrictEqual(actual, expected);
  });

  test('relative paths resolved', async function () {
    const actual = await mergeFrontmatter(name, dir_rp_sub, dir_rp, true);
    const expected = {
      site: {
        logo: '../logo.png',
      },
      url: './astro-m2dx.netlify.app',
    };
    assert.deepStrictEqual(actual, expected);
  });
});
