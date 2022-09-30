// importing these from text-utils would result in circular dependencies
export function capitalize(input: string) {
  return input ? input.charAt(0).toUpperCase() + input.slice(1) : input;
}

export function decapitalize(input: string) {
  return input ? input.charAt(0).toLowerCase() + input.slice(1) : input;
}

const INITIAL_LETTER = /(?:^\w|[A-Z]|\b\w)/g;
export function toCamelCase(input: string): string {
  return input
    .replace(INITIAL_LETTER, function (letter, index) {
      return index == 0 ? letter : letter.toUpperCase();
    })
    .replace(/[^A-Za-z0-9_]+/g, '');
}
