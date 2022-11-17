import { CancellationToken } from "./CancellationTokenSource";

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

export function sleep(ms: number, token?: CancellationToken): Promise<void> {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(resolve, ms);
    token?.addCancelListener(() => {
      clearTimeout(timeoutId);
    });
  });
}

export async function* exponentialBackoff(firstDelay = 200, retryCount = 3): AsyncGenerator<number> {
  for (let i = 0; i <= retryCount; i++) {
    if (i > 0) {
      await sleep(firstDelay * 2 ** (i - 1));
    }
    yield i;
  }
}
