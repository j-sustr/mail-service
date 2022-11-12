export interface Logger {
  info(message: any): void;
  warn(message: any): void;
  error(message: any): void;
}

export class ConsoleLogger implements Logger {
  info(message: any) {
    console.info(message);
  }
  warn(message: any) {
    console.warn(message);
  }
  error(message: any) {
    console.error(message);
  }
}
