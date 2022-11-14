import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ConnectionType, SmtpConnectionOptions } from "../types/connectionTypes";

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

  @Column()
  password!: string;
}
