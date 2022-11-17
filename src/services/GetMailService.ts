import { ImapConnectionOptions } from "../models/connection";
import { Mail } from "../models/mail";

export interface GetMailService {
  testConnection(options: ImapConnectionOptions): Promise<boolean>;

  send(connectionOptions: ImapConnectionOptions, mail: Mail): Promise<void>;
}
