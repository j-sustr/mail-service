export interface ScheduledMail {
  mailId: number;
  sendTime: Date;
}

export class ScheduledMailQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(mail: ScheduledMail) {}

  dequeue(): ScheduledMail {}

  isEmpty() {}
}
