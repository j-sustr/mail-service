import { createTransport, createTestAccount } from "nodemailer";
import { SmtpConnectionOptions } from "../types/connectionTypes";
import { Mail } from "../types/mailTypes";

export interface SendMailService {
  testConnection(options: SmtpConnectionOptions): Promise<boolean>;

  send(connectionOptions: SmtpConnectionOptions, mail: Mail): Promise<void>;
}

export class NodemailerSendMailService implements SendMailService {
  constructor() {}

  async testConnection(options: SmtpConnectionOptions): Promise<boolean> {
    try {
      await _createTransporter(options).verify();
      return true;
    } catch (error) {
      return false;
    }
  }

  async send(connectionOptions: SmtpConnectionOptions, mail: Mail): Promise<void> {
    const transporter = _createTransporter(connectionOptions);
    const { from, to, subject, text, html } = mail;

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  }
}

function _createTransporter(options: SmtpConnectionOptions) {
  const { host, port, secure, username, password } = options;

  return createTransport({
    host,
    port,
    secure,
    auth: {
      user: username,
      pass: password,
    },
  });
}
