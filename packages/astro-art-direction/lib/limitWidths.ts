export function limitWidths(widths: number[], limit?: number): number[] {
  if (!widths || widths.length === 0) return widths;

  widths.sort();
  if (!limit || widths[widths.length - 1] < limit) return widths;
  const index = widths.findIndex((w) => w > limit);
  if (index === 0) {
    return [limit];
  } else {
    widths.splice(index);
    if (limit >= widths[index - 1] * 1.2) {
      widths.push(limit);
    }
  }
  return widths;
}
