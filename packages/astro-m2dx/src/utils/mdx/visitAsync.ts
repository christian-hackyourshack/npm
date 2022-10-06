import { Action, EXIT, isParent, Node, Parent, Predicate, SKIP } from './visit';

type AsyncResult = Promise<Action | void>;

type Visitor<T = Node> = (node: T, parent: Parent | undefined, index: number) => AsyncResult;

export async function visit(current: Node, visitor: Visitor): AsyncResult;

export async function visit<T>(
  current: Node,
  predicate: Predicate<T>,
  visitor: Visitor<T>
): AsyncResult;

export async function visit(
  current: Node,
  predicate?: Predicate | Visitor,
  visitor?: Visitor
): AsyncResult {
  if (!predicate && !visitor) {
    return;
  }
  if (!visitor) {
    visitor = predicate as unknown as Visitor;
    predicate = undefined;
  }
  return visit_(current, undefined, -1, predicate as Predicate, visitor);
}

async function visit_<T>(
  current: Node,
  parent: Parent | undefined,
  index: number,
  predicate: Predicate<T> | undefined,
  visitor: Visitor
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
  if (isParent(current)) {
    for (let index = 0; index < current.children.length; index++) {
      const child = current.children[index];
      if ((await visit_(child, current, index, predicate, visitor)) === EXIT) {
        return EXIT;
      }
    }
  }
}
