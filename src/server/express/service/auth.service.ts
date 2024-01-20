import { ConfirmRegistrationDto, IJwtPayload, LoginDto, RegistrationUserDto } from '../types/auth/input';
import { QueryUserRepository } from '../repositories/user/query-user.repository';
import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import bcrypt from 'bcrypt';
import { ConfirmationUserSchema, IUser, UserWithConfirm } from '../types/user/output';
import dotenv from 'dotenv';
import { userWithPasswordMapper } from '../mappers/user.mapper';
import { UserService } from './user.service';
import { JwtService } from './jwt.service';
import { EmailRepository } from '../repositories/email/email.repository';
import { EmailPayloadsBuilder } from '../repositories/email/messages/email-payloads';
import { ConfirmationUserService } from './confirmation-user.service';
import { QueryConfirmationUserRepository } from '../repositories/confirmation-user/query-confirmation-user.repository';
import { ITokens } from '../types/auth/output';

dotenv.config();

export class AuthService {
    static async login(dto: LoginDto): PromiseNull<ITokens> {
        const { loginOrEmail, password } = dto;
        const user: Nullable<ReturnType<typeof userWithPasswordMapper>> = await QueryUserRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;

        const isPasswordCorrect: boolean = await this.checkPassword(password, user.password);
        if (!isPasswordCorrect) return null;

        const isUserConfirmed: boolean = user.confInfo.isConfirmed;
        if (!isUserConfirmed) return null;

        const [accessToken, refreshToken] = await Promise.all([JwtService.createJwt(user, process.env.ACCESS_TOKEN_EXP as string), JwtService.createJwt(user, process.env.REFRESH_TOKEN_EXP as string)]);

        return { accessToken, refreshToken };
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

    static async logout(refreshToken: string) {
        return JwtService.verifyToken(refreshToken);
    }

    static async confirmRegistration({ code }: ConfirmRegistrationDto): Promise<boolean> {
        const isValid: Nullable<IJwtPayload> = await JwtService.verifyToken(code);
        if (!isValid) return false;

        const userId = isValid.userId;

        const isConfirmedUser: Nullable<ConfirmationUserSchema> = await QueryConfirmationUserRepository.findConfStatusByUserId(userId);
        if (!isConfirmedUser) return false;
        if (isConfirmedUser.isConfirmed) return false;

        const confirmData: Nullable<ConfirmationUserSchema> = await ConfirmationUserService.updateConfStatusByCode(userId, code, true);
        return !!confirmData;
    }

    static async resendEmail(toEmail: string) {
        const user: Nullable<ReturnType<typeof userWithPasswordMapper>> = await QueryUserRepository.findByLoginOrEmail(toEmail);
        if (!user) return false;

        const { id, email, login, createdAt } = user;

        const isConfirmedUser: Nullable<ConfirmationUserSchema> = await QueryConfirmationUserRepository.findConfStatusByUserId(id);
        if (!isConfirmedUser) return false;
        if (isConfirmedUser.isConfirmed) return false;

        const newToken: string = await JwtService.createJwt({ id, email, login, createdAt }, process.env.ACCESS_TOKEN_EXP as string);

        await EmailRepository.sendEmail(email, EmailPayloadsBuilder.createRegistration(newToken));
        return !!(await ConfirmationUserService.updateConfStatusByCode(id, newToken, false));
    }

    static async refreshTokens(oldRefreshToken: string): PromiseNull<ITokens> {
        const verifiedToken: Nullable<IJwtPayload> = await JwtService.verifyToken(oldRefreshToken);
        if (!verifiedToken) return null;

        const userByToken: Nullable<IUser> = await QueryUserRepository.findById(verifiedToken.userId);
        if (!userByToken) return null;

        const [accessToken, refreshToken] = await Promise.all([JwtService.createJwt(userByToken, process.env.ACCESS_TOKEN_EXP as string), JwtService.createJwt(userByToken, process.env.REFRESH_TOKEN_EXP as string)]);
        return { accessToken, refreshToken };
    }

    private static async checkPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            return bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error('AuthService [checkPassword]', error);
            return false;
        }
    }
}
