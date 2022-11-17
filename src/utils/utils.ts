export function toPositiveIntOrUndefined(value: unknown): number | undefined {
  if (typeof value === "number") {
    return Math.trunc(value);
  }
  if (typeof value === "string") {
    const result = parseInt(value);
    if (isNaN(result) || result <= 0) {
      return undefined;
    } else {
      return result;
    }
  }
  return undefined;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
