export enum ConnectionType {
  IMAP = "IMAP",
  SMTP = "SMTP",
}

export interface SmtpConnectionOptions extends ConnectionOptions {}

export interface ImapConnectionOptions extends ConnectionOptions {}

export interface ConnectionOptions {
  readonly type: ConnectionType;
  readonly host: string;
  readonly port: number;
  readonly secure: boolean;
  readonly username: string;
  readonly password: string;
}
