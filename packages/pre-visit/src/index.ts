interface Parent<T> {
  children: T[];
}

function isParent<T>(node: unknown): node is Parent<T> {
  return (
    Object.keys(node as Parent<T>).includes('children') &&
    Array.isArray((node as Parent<T>).children) &&
    (node as Parent<T>).children.length > 0
  );
}

export const CONTINUE = Symbol();
export const EXIT = Symbol();
export const SKIP = Symbol();
export type Action = typeof CONTINUE | typeof EXIT | typeof SKIP | undefined;
export type Predicate<P> = (node: unknown) => node is P;
export type Visitor<P extends T, T> = (
  /**
   * Current node
   */
  node: P,
  /**
   * Immediate parent node
   */
  parent: (T & Parent<T>) | undefined,
  /**
   * Index of this node in it's parent's children list
   */
  index: number,
  /**
   * List of ancestors, starting with parent, i.e. ancestors[0] === parent
   */
  ancestors: Array<T & Parent<T>>
) => Action | void;

export function visit<T>(current: T, visitor: Visitor<T, T>): Action | void;

export function visit<P extends T, T>(
  current: T,
  predicate: Predicate<P>,
  visitor: Visitor<P, T>
): Action | void;

export function visit<P extends T, T>(
  current: T,
  predicate: Predicate<P> | Visitor<P, T>,
  visitor?: Visitor<P, T>
): Action | void {
  if (!visitor) {
    return visit_(current, undefined, -1, undefined, predicate as Visitor<P, T>, []);
  } else {
    if (!visitor) {
      throw new Error('Missing visitor');
    }
    return visit_(current, undefined, -1, predicate as Predicate<P>, visitor, []);
  }
}

function visit_<P extends T, T>(
  current: T,
  parent: (T & Parent<T>) | undefined,
  index: number,
  predicate: Predicate<P> | undefined,
  visitor: Visitor<P, T>,
  ancestors: Array<T & Parent<T>>
): Action | void {
  if (!predicate || predicate(current)) {
    const action = visitor(current as P, parent, index, ancestors);
    switch (action) {
      case EXIT:
        return EXIT;
      case SKIP:
        return;
    }
  }
  if (isParent<T>(current)) {
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

type AsyncVisitor<P extends T, T> = (
  node: P,
  parent: Parent<T> | undefined,
  index: number
) => AsyncResult;

export async function visitAsync<T>(current: T, visitor: AsyncVisitor<T, T>): AsyncResult;

export async function visitAsync<P extends T, T>(
  current: T,
  predicate: Predicate<P>,
  visitor: AsyncVisitor<P, T>
): AsyncResult;

export async function visitAsync<P extends T, T>(
  current: T,
  predicate: Predicate<P> | AsyncVisitor<P, T>,
  visitor?: AsyncVisitor<P, T>
): AsyncResult {
  if (!visitor) {
    return _visitAsync(current, undefined, -1, undefined, predicate as AsyncVisitor<P, T>);
  } else {
    return _visitAsync(current, undefined, -1, predicate as Predicate<P>, visitor);
  }
}

async function _visitAsync<P extends T, T>(
  current: T,
  parent: Parent<T> | undefined,
  index: number,
  predicate: Predicate<T> | undefined,
  visitor: AsyncVisitor<P, T>
): AsyncResult {
  if (!predicate || predicate(current)) {
    const action = await visitor(current as P, parent, index);
    switch (action) {
      case EXIT:
        return EXIT;
      case SKIP:
        return;
    }
  }
  if (isParent<T>(current)) {
    for (let index = 0; index < current.children.length; index++) {
      const child = current.children[index];
      if ((await _visitAsync(child, current, index, predicate, visitor)) === EXIT) {
        return EXIT;
      }
    }
  }
}
