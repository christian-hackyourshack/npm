// importing these from text-utils would result in circular dependencies
export function capitalize(input: string) {
  return input ? input.charAt(0).toUpperCase() + input.slice(1) : input;
}

export function toCamelCase(input: string): string {
  const regex = new RegExp(`${'-'}+.`, 'g');
  return input.replace(regex, (x) => x.slice(-1).toUpperCase());
}

export function lastSegment(input: string): string {
  const index = input.lastIndexOf('/');
  return input.slice(index + 1);
}
