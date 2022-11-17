import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

@Entity()
export class ConnectionEntity implements SmtpConnectionOptions {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: ConnectionType,
    default: ConnectionType.IMAP,
  })
  type!: ConnectionType;

  @Column()
  host!: string;

  @Column()
  port!: number;

  @Column()
  secure!: boolean;

  @Column()
  username!: string;

  // TODO: encrypt
  @Column()
  password!: string;
}
