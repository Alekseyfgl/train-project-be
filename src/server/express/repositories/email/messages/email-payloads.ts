import { IBodyEmail } from '../../../types/email/output';

export class EmailPayloadsBuilder {
    static createRegistration(confCode: string): IBodyEmail {
        return {
            subject: 'Registration',
            // text: 'text',
            html: `
                <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href='https://somesite.com/confirm-email?code=${confCode}'>Complete registration</a>
                </p>`,
        };
    }

    static createRecoveryPassword(recoveryCode: string) {
        return {
            subject: 'Recovery password',
            // text: 'text',
            html: `
             <h1>Password recovery</h1>
             <p>To finish password recovery please follow the link below:
                  <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
             </p>
    `,
        };
    }
}
