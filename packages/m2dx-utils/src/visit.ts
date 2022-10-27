import type { Node } from './mdast';

interface WithChildren extends Node {
  children: Node[];
}

function hasChildren(node: unknown): node is WithChildren {
  return (
    Object.keys(node as WithChildren).includes('children') &&
    Array.isArray((node as WithChildren).children)
  );
}

export const CONTINUE = Symbol();
export const EXIT = Symbol();
export const SKIP = Symbol();
export type Action = typeof CONTINUE | typeof EXIT | typeof SKIP | undefined;
export type Predicate<T = unknown> = (node: unknown) => node is T;
export type Visitor<T = Node> = (
  /**
   * Current node
   */
  node: T,
  /**
   * Immediate parent node
   */
  parent: WithChildren | undefined,
  /**
   * Index of this node in it's parent's children list
   */
  index: number,
  /**
   * List of ancestors, starting with parent, i.e. ancestors[0] === parent
   */
  ancestors: WithChildren[]
) => Action | void;

export function visit(current: Node, visitor: Visitor): Action | void;

export function visit<T>(
  current: Node,
  predicate: Predicate<T>,
  visitor: Visitor<T>
): Action | void;

export function visit(
  current: Node,
  predicate?: Predicate | Visitor,
  visitor?: Visitor
): Action | void {
  if (!predicate && !visitor) {
    return;
  }
  if (!visitor) {
    visitor = predicate as unknown as Visitor;
    predicate = undefined;
  }
  return visit_(current, undefined, -1, predicate as Predicate, visitor, []);
}

function visit_<T>(
  current: Node,
  parent: WithChildren | undefined,
  index: number,
  predicate: Predicate<T> | undefined,
  visitor: Visitor,
  ancestors: WithChildren[]
): Action | void {
  if (!predicate || predicate(current)) {
    const action = visitor(current, parent, index, ancestors);
    switch (action) {
      case EXIT:
        return EXIT;
      case SKIP:
        return;
    }
  }
  if (hasChildren(current)) {
    const children = [...current.children];
    for (const child of children) {
      const index = current.children.indexOf(child);
      if (index >= 0) {
        const action = visit_(child, current, index, predicate, visitor, [current, ...ancestors]);
        if (action === EXIT) return EXIT;
      }
    }
  }
}

type AsyncResult = Promise<Action | void>;

type AsyncVisitor<T = Node> = (
  node: T,
  parent: WithChildren | undefined,
  index: number
) => AsyncResult;

export async function visitAsync(current: Node, visitor: AsyncVisitor): AsyncResult;

export async function visitAsync<T>(
  current: Node,
  predicate: Predicate<T>,
  visitor: AsyncVisitor<T>
): AsyncResult;

export async function visitAsync(
  current: Node,
  predicate?: Predicate | AsyncVisitor,
  visitor?: AsyncVisitor
): AsyncResult {
  if (!predicate && !visitor) {
    return;
  }
  if (!visitor) {
    visitor = predicate as unknown as AsyncVisitor;
    predicate = undefined;
  }
  return _visitAsync(current, undefined, -1, predicate as Predicate, visitor);
}

async function _visitAsync<T>(
  current: Node,
  parent: WithChildren | undefined,
  index: number,
  predicate: Predicate<T> | undefined,
  visitor: AsyncVisitor
): AsyncResult {
  if (!predicate || predicate(current)) {
    const action = await visitor(current, parent, index);
    switch (action) {
      case EXIT:
        return EXIT;
      case SKIP:
        return;
    }
  }
  if (hasChildren(current)) {
    for (let index = 0; index < current.children.length; index++) {
      const child = current.children[index];
      if ((await _visitAsync(child, current, index, predicate, visitor)) === EXIT) {
        return EXIT;
      }
    }
  }
}
