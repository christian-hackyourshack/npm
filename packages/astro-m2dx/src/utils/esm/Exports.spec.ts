import { assert, describe } from 'mintest-green';
import { parseExports } from './Exports';

const noFilter = () => true;

await describe('parseExports', function (test) {
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
    const actual = parseExports(input, noFilter);
    const expected = [
      {
        name: 'imports',
        identifiers: ['Card', 'foo'],
        isDefault: true,
      },
      {
        name: 'extras',
        identifiers: ['Wrap', 'Claim'],
        isDefault: false,
      },
    ];
    assert.deepStrictEqual(actual, expected);
  });

  test('parseExports with default export', function () {
    const input = `
const imports = {
  Card, Claim,
  Code, Wrap
};

export default imports;
`;
    const actual = parseExports(input, noFilter);
    const expected = [
      {
        name: 'imports',
        identifiers: ['Card', 'Claim', 'Code', 'Wrap'],
        isDefault: true,
      },
    ];
    assert.deepStrictEqual(actual, expected);
  });

  test('parseExports with named export', function () {
    const input = `
export const imports = {
  Card,
};
`;
    const actual = parseExports(input, noFilter);
    const expected = [
      {
        name: 'imports',
        identifiers: ['Card'],
        isDefault: false,
      },
    ];
    assert.deepStrictEqual(actual, expected);
  });
});
