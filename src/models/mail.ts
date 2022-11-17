import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Attachment, AttachmentEntity } from "./attachment";

export interface Mail {
  readonly id: number;
  readonly connectionId: number;
  readonly from: string;
  readonly to: string;
  readonly subject: string;
  readonly text?: string;
  readonly html?: string;
  readonly attachments?: Attachment[];
  readonly sendTime?: Date;
}

@Entity()
export class MailEntity implements Mail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  connectionId!: number;

  @Column()
  from!: string;

  @Column()
  to!: string;

  @Column()
  subject!: string;

  @Column({ nullable: true })
  text?: string;

  @Column({ nullable: true })
  html?: string;

  @OneToMany(() => AttachmentEntity, (attachment) => attachment.mail)
  attachments?: AttachmentEntity[];

  @Column({ type: "timestamptz" })
  sendTime!: Date;
}
