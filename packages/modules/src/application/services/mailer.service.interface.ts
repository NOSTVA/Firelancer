import type { Readable } from "stream";

export interface Address {
  name: string;
  address: string;
}
export interface Options {
  from?: string | Address | undefined;
  sender?: string | Address | undefined;
  to?: string | Address | Array<string | Address> | undefined;
  subject?: string | undefined;
  html?: string | Buffer | Readable | undefined;
}

export interface IMailerService {
  sendMail(opts: Options): Promise<void>;
}
