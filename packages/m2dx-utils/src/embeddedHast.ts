import type { ElementContent, Properties } from 'hast';
import type { Node } from './mdast';

export function getHName(node: Node): string | undefined {
  return node.data?.hName as string;
}

export function setHName(node: Node, hName: string): void {
  const data = node.data ?? (node.data = {});
  data.hName = hName;
}

export function getHChildren(node: Node): ElementContent[] {
  const data = node.data ?? (node.data = {});
  return data.hChildren ?? (data.hChildren = []);
}

export function getHProperties(node: Node): Properties {
  const data = node.data ?? (node.data = {});
  return data.hProperties ?? (data.hProperties = {});
}

export function getHProperty(node: Node, name: string) {
  const hProperties = node.data?.hProperties as Properties;
  return hProperties ? hProperties[name] : undefined;
}

export function addHProperty(
  node: Node,
  name: string,
  value: boolean | number | string | null | undefined | Array<string | number>
): void {
  const hProperties = getHProperties(node);
  hProperties[name] = value;
}

export function addHClasses(node: Node, ...classes: string[]) {
  const hProperties = getHProperties(node);
  const merged = new Set();

  const existing = hProperties.class;
  if (typeof existing === 'string') {
    existing.split(/\s/).forEach((s) => merged.add(s));
  }

  classes.forEach((c) => c.split(/\s/).forEach((s) => merged.add(s)));
  hProperties.class = [...merged].join(' ');
}
