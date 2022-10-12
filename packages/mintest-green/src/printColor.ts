const colors: Record<string, number> = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  gray: 90,
};

// eslint-disable-next-line turbo/no-undeclared-env-vars
const supported = /color|ansi|cygwin|linux/i.test(process.env.TERM ?? '');

const print_: Record<string, (msg: unknown) => void> = {};
Object.keys(colors).forEach((name) => {
  print_[name] = function (msg: unknown) {
    if (supported) {
      msg = `\u001b[${colors[name]}m${msg}\u001b[39m`;
    }
    process.stdout.write(msg as string);
  };
});

export const print = print_ as { [Property in keyof typeof colors]: (msg: unknown) => void };

const println_: Record<string, (msg: unknown) => void> = {};
Object.keys(colors).forEach((name) => {
  println_[name] = function (msg: unknown) {
    print[name](msg + '\n');
  };
});

export const println = println_ as { [Property in keyof typeof colors]: (msg: unknown) => void };
