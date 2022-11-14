export interface Mail {
  readonly connectionId: number;
  readonly from: string;
  readonly to: string;
  readonly subject: string;
  readonly text?: string;
  readonly html?: string;
  readonly attachemnt?: string;
  readonly sendTime?: Date;
}
