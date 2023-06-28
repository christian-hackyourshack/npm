
export type Node = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & Record<string, any>;

export function isNode(node: unknown): node is Node {
  return !!node && (node as Node).type !== undefined;
}
