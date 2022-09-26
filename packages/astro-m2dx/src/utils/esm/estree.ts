import type {
  ExportDefaultDeclaration,
  Identifier,
  ImportDeclaration,
  ObjectExpression,
  Property,
  VariableDeclarator,
} from 'estree';

export function isImportDeclaration(node: unknown): node is ImportDeclaration {
  return !!node && (node as ImportDeclaration).type === 'ImportDeclaration';
}

export function isExportDefaultDeclaration(node: unknown): node is ExportDefaultDeclaration {
  return !!node && (node as ExportDefaultDeclaration).type === 'ExportDefaultDeclaration';
}

export function isObjectExpression(node: unknown): node is ObjectExpression {
  return !!node && (node as ObjectExpression).type === 'ObjectExpression';
}

export function isVariableDeclarator(node: unknown): node is VariableDeclarator {
  return !!node && (node as VariableDeclarator).type === 'VariableDeclarator';
}

export function isProperty(node: unknown): node is Property {
  return !!node && (node as Property).type === 'Property';
}
export function isIdentifier(node: unknown): node is Identifier {
  return !!node && (node as Identifier).type === 'Identifier';
}
