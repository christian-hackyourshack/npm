// For finding feasible colors
// for (let i = 0; i < 14; i++) {
//   for (let j = 0; j < 8; j++) {
//     const index = i * 8 + j;
//     write(`\u001b[${index}m${index} ■  \u001b[39;49m  `);
//   }
//   write('\n');
// }

export const colors = [
  'black',
  'blue',
  'boldGray',
  'boldGrey',
  'boldItalic',
  'boldWhite',
  'cyan',
  'gray',
  'green',
  'grey',
  'magenta',
  'onBlack',
  'onBlue',
  'onCyan',
  'onDarkBlue',
  'onGreen',
  'onMagenta',
  'onRed',
  'onWhite',
  'onYellow',
  'red',
  'steel',
  'white',
  'yellow',
] as const;
export type Color = typeof colors[number];

const colorCodes: Record<Color, number> = {
  black: 30,
  blue: 34,
  boldGray: 2,
  boldGrey: 2,
  boldItalic: 3,
  boldWhite: 1,
  cyan: 36,
  gray: 30,
  green: 32,
  grey: 30,
  magenta: 35,
  onBlack: 40,
  onBlue: 44,
  onCyan: 46,
  onDarkBlue: 100,
  onGreen: 42,
  onMagenta: 45,
  onRed: 41,
  onWhite: 47,
  onYellow: 43,
  red: 31,
  steel: 90,
  white: 37,
  yellow: 33,
} as const;

function _print(msg: unknown = '') {
  write(toString(msg));
}
function _println(msg: unknown = '') {
  write(toString(msg) + '\n');
}
function _withColor(msg: string, color: Color) {
  return `\u001b[${colorCodes[color]}m${msg}\u001b[39;49m`;
}

// eslint-disable-next-line turbo/no-undeclared-env-vars
const supported = /color|ansi|cygwin|linux/i.test(process.env.TERM ?? '');

colors.forEach((color) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_print as any)[color] = function (msg: unknown = ''): void {
    let s = toString(msg);
    if (supported) {
      s = _withColor(s, color);
    }
    write(s);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_println as any)[color] = function (msg: unknown = ''): void {
    let s = toString(msg);
    if (supported) {
      s = _withColor(s, color);
    }
    write(s + '\n');
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_withColor as any)[color] = function (msg: string): string {
    return _withColor(msg, color);
  };
});

function toString(msg: unknown) {
  return typeof msg === 'string' ? msg : JSON.stringify(msg);
}

function write(msg: string) {
  process.stdout.write(msg);
}

type Print = {
  (msg?: unknown): void;
} & { [Property in Color]: (msg?: unknown) => void };

type WithColor = {
  (msg: string, color: Color): string;
} & { [Property in Color]: (msg: string) => string };

export const print = _print as Print;
export const println = _println as Print;
export const withColor = _withColor as WithColor;
