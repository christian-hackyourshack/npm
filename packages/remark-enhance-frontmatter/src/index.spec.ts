import { loadVFile } from '@internal/utils-mdast';
import { assert, describe } from 'mintest-green';
import { fileURLToPath } from 'url';
import plugin, { Transform } from '.';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const parser = unified()
  .use(remarkParse);

const enhanceFrontmatter = plugin();

const fixtures = fileURLToPath(new URL('../fixtures', import.meta.url));

export const result = await describe('remark-enhance-frontmatter', function (test) {
  test('not found', async function () {
    const vfile = await loadVFile(fixtures, 'd2', 'test.md');
    await enhanceFrontmatter(undefined, vfile);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = (vfile as any).data?.astro?.frontmatter;
    const expected = undefined;
    assert.equal(actual, expected);
  });

  test('top-level', async function () {
    const vfile = await loadVFile(fixtures, 'd1', 'test.md');
    await enhanceFrontmatter(undefined, vfile);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = (vfile as any).data?.astro?.frontmatter;
    const expected = {
      template: 'd1',
      site: {
        author: 'Christian',
        url: 'astro-m2dx.netlify.app',
      },
    };
    assert.deepStrictEqual(actual, expected);
  });

  test('three merged', async function () {
    const vfile = await loadVFile(fixtures, 'd1', 'd11', 'd111', 'test.md');
    await enhanceFrontmatter(undefined, vfile);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = (vfile as any).data?.astro?.frontmatter;
    const expected = {
      template: 'd111',
      site: {
        author: 'Christian',
        override: 'no',
        url: 'astro-m2dx.netlify.app',
        published: new Date('2022-09-19'),
      },
      category: 'docs',
    };
    assert.deepStrictEqual(actual, expected);
  });

  test('relative paths resolved', async function () {
    const vfile = await loadVFile(fixtures, 'relativePaths', 'sub', 'test.md');
    const enhanceFrontmatter = plugin({ resolvePaths: true });
    await enhanceFrontmatter(undefined, vfile);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = (vfile as any).data?.astro?.frontmatter;
    const expected = {
      site: {
        logo: '../logo.png',
      },
      url: './astro-m2dx.netlify.app',
    };
    assert.deepStrictEqual(actual, expected);
  });

  test('scan title', async function () {
    const vfile = await loadVFile(fixtures, 'd1', 'test.md');
    const root = parser.parse(vfile);
    const enhanceFrontmatter = plugin({ title: true });
    await enhanceFrontmatter(root, vfile);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = (vfile as any).data?.astro?.frontmatter?.title;
    const expected = 'Title D1';
    assert.equal(actual, expected);
  });

  test('transform', async function () {
    const vfile = await loadVFile(fixtures, 'd1', 'test.md');
    const root = parser.parse(vfile);
    const raw: Transform = (frontmatter, vfile) => {
      frontmatter.raw = vfile.value;
    }

    const enhanceFrontmatter = plugin({ transform: [raw] });
    await enhanceFrontmatter(root, vfile);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = (vfile as any).data?.astro?.frontmatter?.raw;
    const expected = `# Title D1
`;
    assert.equal(actual, expected);
  });
});
