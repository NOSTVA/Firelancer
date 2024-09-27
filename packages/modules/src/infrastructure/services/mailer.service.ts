import { injectable } from "inversify";
import {
  IMailerService,
  Options,
} from "../../application/services/mailer.service.interface.js";
import nodemailer, { type Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import env from "../../env.js";
import { log } from "../../log.js";

@injectable()
export class MailerService implements IMailerService {
  private _transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this._transporter = nodemailer.createTransport({
      service: env.MAIL_HOST,
      auth: { user: env.MAIL_USERNAME, pass: env.MAIL_PASSWORD },
    });
  }

  async sendMail(opts: Options): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._transporter.sendMail(opts, (error, info) => {
        if (error) {
          log.error(error);
          reject(error);
        } else {
          log.info(info.response);
          resolve();
        }
      });
    });
  }
}
