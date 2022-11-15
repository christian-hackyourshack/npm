import { assert, describe } from 'mintest-green';
import { addHClasses } from './embeddedHast';
import type { Node } from './mdast';

export const result = await describe('embeddedHast', function (test) {
  test('addHClasses - none', function () {
    const node: Node = { type: 'Element' };
    addHClasses(node);
    assert.equal(node.data?.hProperties, undefined);
  });
  test('addHClasses - empty', function () {
    const node: Node = { type: 'Element' };
    addHClasses(node, ' ');
    assert.equal(node.data?.hProperties, undefined);
  });
  test.only('addHClasses - rubbish', function () {
    const node: Node = { type: 'Element' };
    addHClasses(node, ' ', [], null, undefined, 'foo       bar');
    assert.deepStrictEqual(node.data?.hProperties, { class: 'foo bar' });
  });
  test('addHClasses - single', function () {
    const node: Node = { type: 'Element' };
    addHClasses(node, 'foo');
    assert.deepStrictEqual(node.data?.hProperties, { class: 'foo' });
  });
  test('addHClasses - duplicate', function () {
    const node: Node = { type: 'Element', data: { hProperties: { class: 'foo' } } };
    addHClasses(node, 'foo');
    assert.deepStrictEqual(node.data?.hProperties, { class: 'foo' });
  });
  test('addHClasses - merged', function () {
    const node: Node = { type: 'Element', data: { hProperties: { class: 'bar zoe' } } };
    addHClasses(node, 'foo', 'jack');
    assert.deepStrictEqual(node.data?.hProperties, { class: 'bar zoe foo jack' });
  });
  test('addHClasses - merged with duplicates', function () {
    const node: Node = { type: 'Element', data: { hProperties: { class: 'bar jack zoe' } } };
    addHClasses(node, 'foo', 'jack');
    assert.deepStrictEqual(node.data?.hProperties, { class: 'bar jack zoe foo' });
  });
});
