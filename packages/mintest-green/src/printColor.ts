const colors: Record<string, number> = {
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
};

// eslint-disable-next-line turbo/no-undeclared-env-vars
const supported = /color|ansi|cygwin|linux/i.test(process.env.TERM ?? '');

type Print = {
  (msg?: unknown): void;
} & { [Property in keyof typeof colors]: (msg?: unknown) => void };

function toString(msg: unknown) {
  return typeof msg === 'string' ? msg : JSON.stringify(msg);
}

function write(msg: string) {
  process.stdout.write(msg);
}

function print_(msg: unknown = '') {
  write(toString(msg));
}
Object.keys(colors).forEach((name) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (print_ as any)[name] = function (msg: unknown = ''): void {
    if (supported) {
      write(`\u001b[${colors[name]}m${toString(msg)}\u001b[39;49m`);
    } else {
      write(toString(msg));
    }
  };
});

export const print = print_ as Print;

function println_(msg: unknown = '') {
  write(toString(msg) + '\n');
}
Object.keys(colors).forEach((name) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (println_ as any)[name] = function (msg: unknown = ''): void {
    if (supported) {
      write(`\u001b[${colors[name]}m${toString(msg)}\u001b[39;49m` + '\n');
    } else {
      write(toString(msg) + '\n');
    }
  };
});

export const println = println_ as Print;

// For testing
// for (let i = 0; i < 14; i++) {
//   for (let j = 0; j < 8; j++) {
//     const index = i * 8 + j;
//     write(`\u001b[${index}m${index} ■  \u001b[39;49m  `);
//   }
//   write('\n');
// }
