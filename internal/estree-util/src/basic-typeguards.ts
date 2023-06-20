import type { Literal, Node } from "@internal/mdast-util";
import type { ArrayExpression, ArrayPattern, ArrowFunctionExpression, AssignmentExpression, AssignmentPattern, AwaitExpression, BinaryExpression, BlockStatement, BreakStatement, CallExpression, CatchClause, ChainExpression, ClassBody, ClassDeclaration, ClassExpression, Comment, ConditionalExpression, ContinueStatement, DebuggerStatement, DoWhileStatement, EmptyStatement, ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration, ExportSpecifier, ExpressionStatement, ForInStatement, ForOfStatement, ForStatement, FunctionDeclaration, FunctionExpression, Identifier, IfStatement, ImportDeclaration, ImportDefaultSpecifier, ImportExpression, ImportNamespaceSpecifier, ImportSpecifier, LabeledStatement, LogicalExpression, MemberExpression, MetaProperty, MethodDefinition, NewExpression, ObjectExpression, ObjectPattern, PrivateIdentifier, Program, Property, PropertyDefinition, RestElement, ReturnStatement, SequenceExpression, SpreadElement, StaticBlock, Super, SwitchCase, SwitchStatement, TaggedTemplateExpression, TemplateElement, TemplateLiteral, ThisExpression, ThrowStatement, TryStatement, UnaryExpression, UpdateExpression, VariableDeclaration, VariableDeclarator, WhileStatement, WithStatement, YieldExpression } from ".";

export function isArrayExpression(node: unknown): node is ArrayExpression {
  return !!node && (node as Node).type === 'ArrayExpression';
}

export function isArrayPattern(node: unknown): node is ArrayPattern {
  return !!node && (node as Node).type === 'ArrayPattern';
}

export function isArrowFunctionExpression(node: unknown): node is ArrowFunctionExpression {
  return !!node && (node as Node).type === 'ArrowFunctionExpression';
}

export function isAssignmentExpression(node: unknown): node is AssignmentExpression {
  return !!node && (node as Node).type === 'AssignmentExpression';
}

export function isAssignmentPattern(node: unknown): node is AssignmentPattern {
  return !!node && (node as Node).type === 'AssignmentPattern';
}

export function isAwaitExpression(node: unknown): node is AwaitExpression {
  return !!node && (node as Node).type === 'AwaitExpression';
}

export function isBinaryExpression(node: unknown): node is BinaryExpression {
  return !!node && (node as Node).type === 'BinaryExpression';
}

export function isBlockStatement(node: unknown): node is BlockStatement {
  return !!node && (node as Node).type === 'BlockStatement';
}

export function isBreakStatement(node: unknown): node is BreakStatement {
  return !!node && (node as Node).type === 'BreakStatement';
}

export function isCallExpression(node: unknown): node is CallExpression {
  return !!node && (node as Node).type === 'CallExpression';
}

export function isCatchClause(node: unknown): node is CatchClause {
  return !!node && (node as Node).type === 'CatchClause';
}

export function isChainExpression(node: unknown): node is ChainExpression {
  return !!node && (node as Node).type === 'ChainExpression';
}

export function isClassBody(node: unknown): node is ClassBody {
  return !!node && (node as Node).type === 'ClassBody';
}

export function isClassDeclaration(node: unknown): node is ClassDeclaration {
  return !!node && (node as Node).type === 'ClassDeclaration';
}

export function isClassExpression(node: unknown): node is ClassExpression {
  return !!node && (node as Node).type === 'ClassExpression';
}

export function isComment(node: unknown): node is Comment {
  return !!node && ((node as Node).type === 'Line' || (node as Node).type === 'Block');
}

export function isConditionalExpression(node: unknown): node is ConditionalExpression {
  return !!node && (node as Node).type === 'ConditionalExpression';
}

export function isContinueStatement(node: unknown): node is ContinueStatement {
  return !!node && (node as Node).type === 'ContinueStatement';
}

export function isDebuggerStatement(node: unknown): node is DebuggerStatement {
  return !!node && (node as Node).type === 'DebuggerStatement';
}

export function isDoWhileStatement(node: unknown): node is DoWhileStatement {
  return !!node && (node as Node).type === 'DoWhileStatement';
}

export function isEmptyStatement(node: unknown): node is EmptyStatement {
  return !!node && (node as Node).type === 'EmptyStatement';
}

export function isExportAllDeclaration(node: unknown): node is ExportAllDeclaration {
  return !!node && (node as Node).type === 'ExportAllDeclaration';
}

export function isExportDefaultDeclaration(node: unknown): node is ExportDefaultDeclaration {
  return !!node && (node as Node).type === 'ExportDefaultDeclaration';
}

export function isExportNamedDeclaration(node: unknown): node is ExportNamedDeclaration {
  return !!node && (node as Node).type === 'ExportNamedDeclaration';
}

export function isExportSpecifier(node: unknown): node is ExportSpecifier {
  return !!node && (node as Node).type === 'ExportSpecifier';
}

export function isExpressionStatement(node: unknown): node is ExpressionStatement {
  return !!node && (node as Node).type === 'ExpressionStatement';
}

export function isForInStatement(node: unknown): node is ForInStatement {
  return !!node && (node as Node).type === 'ForInStatement';
}

export function isForOfStatement(node: unknown): node is ForOfStatement {
  return !!node && (node as Node).type === 'ForOfStatement';
}

export function isForStatement(node: unknown): node is ForStatement {
  return !!node && (node as Node).type === 'ForStatement';
}

export function isFunctionDeclaration(node: unknown): node is FunctionDeclaration {
  return !!node && (node as Node).type === 'FunctionDeclaration';
}

export function isFunctionExpression(node: unknown): node is FunctionExpression {
  return !!node && (node as Node).type === 'FunctionExpression';
}

export function isIdentifier(node: unknown): node is Identifier {
  return !!node && (node as Node).type === 'Identifier';
}

export function isIfStatement(node: unknown): node is IfStatement {
  return !!node && (node as Node).type === 'IfStatement';
}

export function isImportDeclaration(node: unknown): node is ImportDeclaration {
  return !!node && (node as Node).type === 'ImportDeclaration';
}

export function isImportDefaultSpecifier(node: unknown): node is ImportDefaultSpecifier {
  return !!node && (node as Node).type === 'ImportDefaultSpecifier';
}

export function isImportExpression(node: unknown): node is ImportExpression {
  return !!node && (node as Node).type === 'ImportExpression';
}

export function isImportNamespaceSpecifier(node: unknown): node is ImportNamespaceSpecifier {
  return !!node && (node as Node).type === 'ImportNamespaceSpecifier';
}

export function isImportSpecifier(node: unknown): node is ImportSpecifier {
  return !!node && (node as Node).type === 'ImportSpecifier';
}

export function isLabeledStatement(node: unknown): node is LabeledStatement {
  return !!node && (node as Node).type === 'LabeledStatement';
}

export function isLiteral(node: unknown): node is Literal {
  return !!node && (node as Node).type === 'Literal';
}

export function isLogicalExpression(node: unknown): node is LogicalExpression {
  return !!node && (node as Node).type === 'LogicalExpression';
}

export function isMemberExpression(node: unknown): node is MemberExpression {
  return !!node && (node as Node).type === 'MemberExpression';
}

export function isMetaProperty(node: unknown): node is MetaProperty {
  return !!node && (node as Node).type === 'MetaProperty';
}

export function isMethodDefinition(node: unknown): node is MethodDefinition {
  return !!node && (node as Node).type === 'MethodDefinition';
}

export function isNewExpression(node: unknown): node is NewExpression {
  return !!node && (node as Node).type === 'NewExpression';
}

export function isObjectExpression(node: unknown): node is ObjectExpression {
  return !!node && (node as Node).type === 'ObjectExpression';
}

export function isObjectPattern(node: unknown): node is ObjectPattern {
  return !!node && (node as Node).type === 'ObjectPattern';
}

export function isPrivateIdentifier(node: unknown): node is PrivateIdentifier {
  return !!node && (node as Node).type === 'PrivateIdentifier';
}

export function isProgram(node: unknown): node is Program {
  return !!node && (node as Node).type === 'Program';
}

export function isProperty(node: unknown): node is Property {
  return !!node && (node as Node).type === 'Property';
}

export function isPropertyDefinition(node: unknown): node is PropertyDefinition {
  return !!node && (node as Node).type === 'PropertyDefinition';
}

export function isRestElement(node: unknown): node is RestElement {
  return !!node && (node as Node).type === 'RestElement';
}

export function isReturnStatement(node: unknown): node is ReturnStatement {
  return !!node && (node as Node).type === 'ReturnStatement';
}

export function isSequenceExpression(node: unknown): node is SequenceExpression {
  return !!node && (node as Node).type === 'SequenceExpression';
}

export function isSpreadElement(node: unknown): node is SpreadElement {
  return !!node && (node as Node).type === 'SpreadElement';
}

export function isStaticBlock(node: unknown): node is StaticBlock {
  return !!node && (node as Node).type === 'StaticBlock';
}

export function isSuper(node: unknown): node is Super {
  return !!node && (node as Node).type === 'Super';
}

export function isSwitchCase(node: unknown): node is SwitchCase {
  return !!node && (node as Node).type === 'SwitchCase';
}

export function isSwitchStatement(node: unknown): node is SwitchStatement {
  return !!node && (node as Node).type === 'SwitchStatement';
}

export function isTaggedTemplateExpression(node: unknown): node is TaggedTemplateExpression {
  return !!node && (node as Node).type === 'TaggedTemplateExpression';
}

export function isTemplateElement(node: unknown): node is TemplateElement {
  return !!node && (node as Node).type === 'TemplateElement';
}

export function isTemplateLiteral(node: unknown): node is TemplateLiteral {
  return !!node && (node as Node).type === 'TemplateLiteral';
}

export function isThisExpression(node: unknown): node is ThisExpression {
  return !!node && (node as Node).type === 'ThisExpression';
}

export function isThrowStatement(node: unknown): node is ThrowStatement {
  return !!node && (node as Node).type === 'ThrowStatement';
}

export function isTryStatement(node: unknown): node is TryStatement {
  return !!node && (node as Node).type === 'TryStatement';
}

export function isUnaryExpression(node: unknown): node is UnaryExpression {
  return !!node && (node as Node).type === 'UnaryExpression';
}

export function isUpdateExpression(node: unknown): node is UpdateExpression {
  return !!node && (node as Node).type === 'UpdateExpression';
}

export function isVariableDeclaration(node: unknown): node is VariableDeclaration {
  return !!node && (node as Node).type === 'VariableDeclaration';
}

export function isVariableDeclarator(node: unknown): node is VariableDeclarator {
  return !!node && (node as Node).type === 'VariableDeclarator';
}

export function isWhileStatement(node: unknown): node is WhileStatement {
  return !!node && (node as Node).type === 'WhileStatement';
}

export function isWithStatement(node: unknown): node is WithStatement {
  return !!node && (node as Node).type === 'WithStatement';
}

export function isYieldExpression(node: unknown): node is YieldExpression {
  return !!node && (node as Node).type === 'YieldExpression';
}
