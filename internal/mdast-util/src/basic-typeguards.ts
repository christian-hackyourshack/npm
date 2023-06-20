import type { Blockquote, Break, Code, Definition, Delete, Emphasis, Footnote, FootnoteDefinition, FootnoteReference, HTML, Heading, Image, ImageReference, InlineCode, Link, LinkReference, List, ListItem, Paragraph, Root, Strong, Table, TableCell, TableRow, Text, ThematicBreak, YAML } from 'mdast';
import type { Node } from ".";

export function isBlockquote(node: unknown): node is Blockquote {
  return !!node && (node as Node).type === 'blockquote';
}

export function isBreak(node: unknown): node is Break {
  return !!node && (node as Node).type === 'break';
}

export function isCode(node: unknown): node is Code {
  return !!node && (node as Node).type === 'code';
}

export function isDefinition(node: unknown): node is Definition {
  return !!node && (node as Node).type === 'definition';
}

export function isDelete(node: unknown): node is Delete {
  return !!node && (node as Node).type === 'delete';
}

export function isEmphasis(node: unknown): node is Emphasis {
  return !!node && (node as Node).type === 'emphasis';
}

export function isFootnote(node: unknown): node is Footnote {
  return !!node && (node as Node).type === 'footnote';
}

export function isFootnoteDefinition(node: unknown): node is FootnoteDefinition {
  return !!node && (node as Node).type === 'footnoteDefinition';
}

export function isFootnoteReference(node: unknown): node is FootnoteReference {
  return !!node && (node as Node).type === 'footnoteReference';
}

export function isHeading(node: unknown): node is Heading {
  return !!node && (node as Node).type === 'heading';
}

export function isHTML(node: unknown): node is HTML {
  return !!node && (node as Node).type === 'html';
}

export function isImage(node: unknown): node is Image {
  return !!node && (node as Node).type === 'image';
}

export function isImageReference(node: unknown): node is ImageReference {
  return !!node && (node as Node).type === 'imageReference';
}

export function isInlineCode(node: unknown): node is InlineCode {
  return !!node && (node as Node).type === 'inlineCode';
}

export function isLink(node: unknown): node is Link {
  return !!node && (node as Node).type === 'link';
}

export function isLinkReference(node: unknown): node is LinkReference {
  return !!node && (node as Node).type === 'linkReference';
}

export function isList(node: unknown): node is List {
  return !!node && (node as Node).type === 'list';
}

export function isListItem(node: unknown): node is ListItem {
  return !!node && (node as Node).type === 'listItem';
}

export function isParagraph(node: unknown): node is Paragraph {
  return !!node && (node as Node).type === 'paragraph';
}

export function isRoot(node: unknown): node is Root {
  return !!node && (node as Node).type === 'root';
}

export function isStrong(node: unknown): node is Strong {
  return !!node && (node as Node).type === 'strong';
}

export function isTable(node: unknown): node is Table {
  return !!node && (node as Node).type === 'table';
}

export function isTableCell(node: unknown): node is TableCell {
  return !!node && (node as Node).type === 'tableCell';
}

export function isTableRow(node: unknown): node is TableRow {
  return !!node && (node as Node).type === 'tableRow';
}

export function isText(node: unknown): node is Text {
  return !!node && (node as Node).type === 'text';
}

export function isThematicBreak(node: unknown): node is ThematicBreak {
  return !!node && (node as Node).type === 'thematicBreak';
}

export function isYAML(node: unknown): node is YAML {
  return !!node && (node as Node).type === 'yaml';
}
