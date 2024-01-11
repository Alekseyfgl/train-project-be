import { ConfirmRegistrationDto, IJwtPayload, LoginDto, RegistrationUserDto } from '../types/auth/input';
import { QueryUserRepository } from '../repositories/user/query-user.repository';
import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import bcrypt from 'bcrypt';
import { ConfirmationUserSchema, UserWithConfirm } from '../types/user/output';
import dotenv from 'dotenv';
import { userWithPasswordMapper } from '../mappers/user.mapper';
import { UserService } from './user.service';
import { JwtService } from './jwt.service';
import { EmailRepository } from '../repositories/email/email.repository';
import { EmailPayloadsBuilder } from '../repositories/email/messages/email-payloads';
import { ConfirmationUserService } from './confirmation-user.service';

dotenv.config();

export class AuthService {
    static async login(dto: LoginDto): PromiseNull<{ accessToken: string }> {
        const { loginOrEmail, password } = dto;
        const user: Nullable<ReturnType<typeof userWithPasswordMapper>> = await QueryUserRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;

        const isPasswordCorrect: boolean = await this.checkPassword(password, user.password);
        if (!isPasswordCorrect) return null;

        const isUserConfirmed: boolean = user.confInfo.isConfirmed;
        if (!isUserConfirmed) return null;

        const newToken: string = await JwtService.createJwt(user, process.env.ACCESS_TOKEN_EXP as string);
        return { accessToken: newToken };
    }

    static async registration(dto: RegistrationUserDto): Promise<boolean> {
        const registeredUser: Nullable<UserWithConfirm> = await UserService.create(dto, false);
        if (!registeredUser) return false;

        const confCode: Nullable<string> = registeredUser.confirmInfo.code;
        if (!confCode) return false;

        const isSendEmail = await EmailRepository.sendEmail(dto.email, EmailPayloadsBuilder.createRegistration(confCode));
        if (!isSendEmail) {
            await UserService.removeById(registeredUser.id);
            return false;
        }

        return true;
    }

    static async confirmRegistration({ code }: ConfirmRegistrationDto): Promise<boolean> {
        const isValid: Nullable<IJwtPayload> = await JwtService.verifyToken(code);
        if (!isValid) return false;

        const userId = isValid.userId;

        const confirmData: Nullable<ConfirmationUserSchema> = await ConfirmationUserService.updateConfStatusByCode(userId, code, true);
        return !!confirmData;
    }

    static async resendEmail(toEmail: string) {
        const user: Nullable<ReturnType<typeof userWithPasswordMapper>> = await QueryUserRepository.findByLoginOrEmail(toEmail);
        if (!user) return false;

        const { id, email, login, createdAt } = user;
        const newToken: string = await JwtService.createJwt({ id, email, login, createdAt }, process.env.ACCESS_TOKEN_EXP as string);

        const isSendEmail = await EmailRepository.sendEmail(email, EmailPayloadsBuilder.createRegistration(newToken));
        // if (!isSendEmail) {
        //     await UserService.removeById();
        //     return false;
        // }
        return !!(await ConfirmationUserService.updateConfStatusByCode(id, newToken, false));
    }

    private static async checkPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            return bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error('Error when comparing passwords:', error);
            return false;
        }
    }
}
