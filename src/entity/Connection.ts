import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum ConnectionType {
  IMAP = "IMAP",
  SMTP = "SMTP",
}

@Entity()
export class Connection {
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
  port!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;
}
