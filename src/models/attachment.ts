import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MailEntity } from "./mail";

export interface Attachment {
  readonly filename: string;
  readonly content: Buffer;
}

@Entity()
export class AttachmentEntity implements Attachment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  filename!: string;

  @Column({ type: "bytea", nullable: false })
  content!: Buffer;

  @ManyToOne(() => MailEntity, (mail) => mail.attachments)
  mail!: MailEntity;
}
