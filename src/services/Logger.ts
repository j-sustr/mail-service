export interface Logger {
  info(message: any, ...optionalParams: any[]): void;
  warn(message: any, ...optionalParams: any[]): void;
  error(message: any, ...optionalParams: any[]): void;
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
