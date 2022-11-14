import { ImapConnectionOptions } from "../types/connectionTypes";
import { Mail } from "../types/mailTypes";

export interface GetMailService {
  testConnection(options: ImapConnectionOptions): Promise<boolean>;

  send(connectionOptions: ImapConnectionOptions, mail: Mail): Promise<void>;
}
