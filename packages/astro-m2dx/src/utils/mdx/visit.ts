export type Node = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & Record<string, any>;

export interface Parent extends Node {
  children: Node[];
}

export function isParent(node: unknown): node is Parent {
  return (
    Object.keys(node as Parent).includes('children') && Array.isArray((node as Parent).children)
  );
}

export const CONTINUE = Symbol();
export const EXIT = Symbol();
export const SKIP = Symbol();
export type Action = typeof CONTINUE | typeof EXIT | typeof SKIP | undefined;
export type Predicate<T = unknown> = (node: unknown) => node is T;
export type Visitor<T = Node> = (
  node: T,
  parent: Parent | undefined,
  index: number,
  ancestors: Parent[]
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
  parent: Parent | undefined,
  index: number,
  predicate: Predicate<T> | undefined,
  visitor: Visitor,
  ancestors: Parent[]
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
  if (isParent(current)) {
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
