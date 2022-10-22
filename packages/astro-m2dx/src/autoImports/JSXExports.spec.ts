import { assert, describe } from 'mintest-green';
import { parseJsxExports } from './JsxExports';

export const result = await describe('parseJsxExports', function (test) {
  test('multiple', function () {
    const input = `
const imports = {
  Card,
  foo
};

export const extras = {
  Wrap,
  Claim: Foo
}

export const draft = false;

export default imports;
`;
    const actual = parseJsxExports(input);
    const expected = [
      {
        name: 'imports',
        components: ['Card'],
        isDefault: true,
      },
      {
        name: 'extras',
        components: ['Wrap', 'Claim'],
        isDefault: false,
      },
    ];
    assert.deepStrictEqual(actual, expected);
  });

  test('parseJsxExports with default export', function () {
    const input = `
const imports = {
  Card, Claim,
  Code, Wrap
};

export default imports;
`;
    const actual = parseJsxExports(input);
    const expected = [
      {
        name: 'imports',
        components: ['Card', 'Claim', 'Code', 'Wrap'],
        isDefault: true,
      },
    ];
    assert.deepStrictEqual(actual, expected);
  });

  test('parseJsxExports with named export', function () {
    const input = `
export const imports = {
  Card,
};
`;
    const actual = parseJsxExports(input);
    const expected = [
      {
        name: 'imports',
        components: ['Card'],
        isDefault: false,
      },
    ];
    assert.deepStrictEqual(actual, expected);
  });
});
