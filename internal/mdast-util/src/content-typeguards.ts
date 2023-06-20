import type { BlockContent, Content, DefinitionContent, FrontmatterContent, ListContent, PhrasingContent, RowContent, StaticPhrasingContent, TableContent, TopLevelContent } from ".";
import { isBlockquote, isBreak, isCode, isDefinition, isDelete, isEmphasis, isFootnote, isFootnoteDefinition, isFootnoteReference, isHTML, isHeading, isImage, isImageReference, isInlineCode, isLink, isLinkReference, isList, isListItem, isParagraph, isStrong, isTable, isTableCell, isTableRow, isText, isThematicBreak, isYAML } from ".";

export function isContent(node: unknown): node is Content {
  if (!node) return false;
  return isTopLevelContent(node) || isListContent(node) || isTableContent(node) || isRowContent(node) || isPhrasingContent(node);
}

export function isTopLevelContent(node: unknown): node is TopLevelContent {
  if (!node) return false;
  return isBlockContent(node) || isFrontmatterContent(node) || isDefinitionContent(node);
}

export function isBlockContent(node: unknown): node is BlockContent {
  if (!node) return false;
  return isParagraph(node) || isHeading(node) || isThematicBreak(node) || isBlockquote(node) || isList(node) || isTable(node) || isHTML(node) || isCode(node);
}

export function isFrontmatterContent(node: unknown): node is FrontmatterContent {
  return isYAML(node);
}

export function isDefinitionContent(node: unknown): node is DefinitionContent {
  if (!node) return false;
  return isDefinition(node) || isFootnoteDefinition(node);
}

export function isListContent(node: unknown): node is ListContent {
  return isListItem(node);
}

export function isTableContent(node: unknown): node is TableContent {
  return isTableRow(node);
}

export function isRowContent(node: unknown): node is RowContent {
  return isTableCell(node);
}

export function isPhrasingContent(node: unknown): node is PhrasingContent {
  if (!node) return false;
  return isHTML(node) || isLink(node) || isLinkReference(node) || isText(node) || isEmphasis(node) || isStrong(node) || isDelete(node) || isInlineCode(node) || isBreak(node) || isImage(node) || isImageReference(node) || isFootnote(node) || isFootnoteReference(node);
}

export function isStaticPhrasingContent(node: unknown): node is StaticPhrasingContent {
  if (!node) return false;
  return isHTML(node) || isEmphasis(node) || isStrong(node) || isDelete(node) || isInlineCode(node) || isBreak(node) || isImage(node) || isImageReference(node) || isFootnote(node) || isText(node) || isFootnoteReference(node);
}


