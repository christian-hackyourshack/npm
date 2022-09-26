import type {
  Alternative,
  Association,
  Blockquote,
  Break,
  Code,
  Definition,
  Delete,
  Emphasis,
  Footnote,
  FootnoteDefinition,
  FootnoteReference,
  Heading,
  HTML,
  Image,
  ImageReference,
  InlineCode,
  Link,
  LinkReference,
  List,
  ListItem,
  Literal,
  Paragraph,
  Reference,
  Resource,
  Root,
  Strong,
  Table,
  TableCell,
  TableRow,
  Text,
  ThematicBreak,
  YAML,
} from 'mdast';
import type { MdxjsEsm } from 'mdast-util-mdx';
import type { Node, Parent } from 'unist';

export function isRoot(node: unknown): node is Root {
  return !!node && (node as Root).type === 'root';
}

export function isParagraph(node: unknown): node is Paragraph {
  return !!node && (node as Paragraph).type === 'paragraph';
}

export function isHeading(node: unknown): node is Heading {
  return !!node && (node as Heading).type === 'heading';
}

export function isThematicBreak(node: unknown): node is ThematicBreak {
  return !!node && (node as ThematicBreak).type === 'thematicBreak';
}

export function isBlockquote(node: unknown): node is Blockquote {
  return !!node && (node as Blockquote).type === 'blockquote';
}

export function isList(node: unknown): node is List {
  return !!node && (node as List).type === 'list';
}

export function isListItem(node: unknown): node is ListItem {
  return !!node && (node as ListItem).type === 'listItem';
}

export function isTable(node: unknown): node is Table {
  return !!node && (node as Table).type === 'table';
}

export function isTableRow(node: unknown): node is TableRow {
  return !!node && (node as TableRow).type === 'tableRow';
}

export function isTableCell(node: unknown): node is TableCell {
  return !!node && (node as TableCell).type === 'tableCell';
}

export function isParent(node: unknown): node is Parent {
  if (!node) return false;
  const type = (node as Node).type;
  switch (type) {
    case 'html':
    case 'code':
    case 'yaml':
    case 'text':
    case 'inlineCode':
    case 'break':
    case 'image':
    case 'imageReference':
    case 'footnoteReference':
      return false;
    default:
      return true;
  }
}

export function isLiteral(node: unknown): node is Literal {
  if (!node) return false;
  const type = (node as Literal).type;
  switch (type) {
    case 'html':
    case 'code':
    case 'yaml':
    case 'text':
    case 'inlineCode':
    case 'definition':
      return true;
    default:
      return false;
  }
}

export function isHTML(node: unknown): node is HTML {
  return !!node && (node as HTML).type === 'html';
}

export function isCode(node: unknown): node is Code {
  return !!node && (node as Code).type === 'code';
}

export function isYAML(node: unknown): node is YAML {
  return !!node && (node as YAML).type === 'yaml';
}

export function isAssociation(node: unknown): node is Association {
  if (!node) return false;
  const type = (node as Node).type;
  switch (type) {
    case 'definition':
    case 'footnoteDefinition':
    case 'footnoteReference':
      return true;
    default:
      return false;
  }
}

export function isResource(node: unknown): node is Resource {
  if (!node) return false;
  const type = (node as Node).type;
  switch (type) {
    case 'definition':
    case 'link':
    case 'image':
      return true;
    default:
      return false;
  }
}

export function isDefinition(node: unknown): node is Definition {
  return !!node && (node as Definition).type === 'definition';
}

export function isFootnoteDefinition(node: unknown): node is FootnoteDefinition {
  return !!node && (node as FootnoteDefinition).type === 'footnoteDefinition';
}

export function isText(node: unknown): node is Text {
  return !!node && (node as Text).type === 'text';
}

export function isEmphasis(node: unknown): node is Emphasis {
  return !!node && (node as Emphasis).type === 'emphasis';
}

export function isStrong(node: unknown): node is Strong {
  return !!node && (node as Strong).type === 'strong';
}

export function isDelete(node: unknown): node is Delete {
  return !!node && (node as Delete).type === 'delete';
}

export function isInlineCode(node: unknown): node is InlineCode {
  return !!node && (node as InlineCode).type === 'inlineCode';
}

export function isBreak(node: unknown): node is Break {
  return !!node && (node as Break).type === 'break';
}

export function isLink(node: unknown): node is Link {
  return !!node && (node as Link).type === 'link';
}

export function isAlternative(node: unknown): node is Alternative {
  if (!node) return false;
  const type = (node as Node).type;
  switch (type) {
    case 'image':
    case 'imageReference':
      return true;
    default:
      return false;
  }
}

export function isImage(node: unknown): node is Image {
  return !!node && (node as Image).type === 'image';
}

export function isReference(node: unknown): node is Reference {
  if (!node) return false;
  const type = (node as Node).type;
  switch (type) {
    case 'linkReference':
    case 'imageReference':
      return true;
    default:
      return false;
  }
}

export function isLinkReference(node: unknown): node is LinkReference {
  return !!node && (node as LinkReference).type === 'linkReference';
}

export function isImageReference(node: unknown): node is ImageReference {
  return !!node && (node as ImageReference).type === 'imageReference';
}

export function isFootnote(node: unknown): node is Footnote {
  return !!node && (node as Footnote).type === 'footnote';
}

export function isFootnoteReference(node: unknown): node is FootnoteReference {
  return !!node && (node as FootnoteReference).type === 'footnoteReference';
}

export function isMdxjsEsm(node: unknown): node is MdxjsEsm {
  return !!node && (node as MdxjsEsm).type === 'mdxjsEsm';
}
