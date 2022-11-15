import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

/**
 *
 * @param {import("mdast").Root} root
 */
export function noteDirective(root) {
  visit(root, (node) => {
    if (
      node.type === 'textDirective' ||
      node.type === 'leafDirective' ||
      node.type === 'containerDirective'
    ) {
      if (node.name !== 'note') return;
      const tagName = node.type === 'textDirective' ? 'span' : 'div';

      const data = node.data || (node.data = {});
      data.hName = tagName;
      data.hProperties = h(tagName, node.attributes).properties;
    }
  });
}
