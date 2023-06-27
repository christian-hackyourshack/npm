import type { Node } from "@internal/mdast-util";

export type HProperties = Record<string, boolean | number | string | null | undefined | Array<string | number>>;

export function getHProperties(node: Node): HProperties {
  const data = node.data ?? (node.data = {});
  return (data.hProperties ?? (data.hProperties = {})) as HProperties;
}

export function addHClasses(node: Node, ...classes: string[]) {
  if (!classes || classes.length === 0) return;

  const hProperties = getHProperties(node);
  const existing = (hProperties.class as string)?.split(/\s/) ?? [];
  if (existing.length > 0) {
    classes = classes.filter((cls) => !existing.includes(cls));
    if (classes.length > 0) {
      hProperties.class += " " + classes.join(" ");
    }
  } else {
    hProperties.class = classes.join(" ");
  }
}

export function setHName(node: Node, name: string) {
  const data = node.data ?? (node.data = {});
  data.hName = name;
}

