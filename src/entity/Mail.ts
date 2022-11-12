import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Mail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  from!: string;

  @Column()
  to!: string;

  @Column()
  subject!: string;

  @Column()
  text?: string;

  @Column()
  html?: string;

  @Column()
  attachment?: string;

  @Column({ type: "timestamptz", nullable: true })
  sendTime: Date | null = null;
}
