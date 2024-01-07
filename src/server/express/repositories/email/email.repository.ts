import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import { IBodyEmail } from '../../types/email/output';

dotenv.config();

export class EmailRepository {
    static async sendEmail(toEmail: string, bodyEmail: IBodyEmail): Promise<boolean> {
        const { subject, text, html } = bodyEmail;
        try {
            const transporter: Transporter<SentMessageInfo> = nodemailer.createTransport({
                host: process.env.EMAIL_HOST as string,
                auth: { user: process.env.EMAIL_LOGIN as string, pass: process.env.EMAIL_PASSWORD },
            });

            const result: SentMessageInfo = await transporter.sendMail({
                to: toEmail, // list of receivers
                from: `Auth service <${process.env.EMAIL_HOST as string}>`, // sender address
                subject: subject, // Subject line
                text: text, // plain text body
                html: html,
            });
            console.log('sendEmail', result);
            return true;
        } catch (error) {
            return false;
            console.log('EmailRepository [sendEmail]', error);
        }
    }
}
