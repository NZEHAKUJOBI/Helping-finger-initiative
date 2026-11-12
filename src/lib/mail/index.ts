/**
 * Adapter pattern: forms send notifications through MailProvider.
 * ConsoleMailProvider is the dev default; add a Resend/SMTP adapter when credentials exist.
 */
export interface MailMessage {
  subject: string;
  replyTo?: string;
  fields: Record<string, string | undefined>;
}

export interface MailProvider {
  send(message: MailMessage): Promise<void>;
}

class ConsoleMailProvider implements MailProvider {
  async send(message: MailMessage) {
    console.info("[mail]", message.subject, message.fields);
  }
}

export const mail: MailProvider = new ConsoleMailProvider();
