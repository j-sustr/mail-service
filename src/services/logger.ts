export interface Logger {
  info(message: any): void;
  warn(message: any): void;
  error(message: any): void;
}

export class ConsoleLogger implements Logger {
  info(message: any, ...optionalParams: any[]) {
    console.info(message, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }
}
