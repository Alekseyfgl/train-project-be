import { ConfirmRegistrationDto, IAgentInfo, IJwtPayload, LoginDto, RegistrationUserDto } from '../types/auth/input';
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
import { v4 } from 'uuid';
import { DeviceSessionService } from './device-session.service';
import { HttpStatusCodes } from '../common/constans/http-status-codes';

dotenv.config();

export class AuthService {
    static async login(dto: LoginDto, userAgent: IAgentInfo): PromiseNull<ITokens> {
        const { loginOrEmail, password } = dto;
        const { os, loc, ip, browser } = userAgent;
        const user: Nullable<ReturnType<typeof userWithPasswordMapper>> = await QueryUserRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;
        const userId: string = user.id;

        const isPasswordCorrect: boolean = await this.checkPassword(password, user.password);
        if (!isPasswordCorrect) return null;

        const isUserConfirmed: boolean = user.confInfo.isConfirmed;
        if (!isUserConfirmed) return null;

        const _accessToken = +process.env.ACCESS_TOKEN_EXP! as number;
        const _refreshToken = +process.env.REFRESH_TOKEN_EXP! as number;

        const creatAt: Date = new Date();
        const deviceId: string = v4();
        const [accessToken, refreshToken] = await Promise.all([JwtService.createJwt(user, _accessToken, creatAt, deviceId), JwtService.createJwt(user, _refreshToken, creatAt, deviceId)]);

        // const expAt: Date = addMilliseconds(creatAt, _refreshToken);
        await DeviceSessionService.createRefreshSession({ deviceId, os, loc, ip, creatAt, userId });
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

    static async logout(deviceId: string, userId: string): Promise<boolean> {
        const result = await DeviceSessionService.removeSessionByOne(deviceId, userId);
        return result === HttpStatusCodes.NO_CONTENT;
    }

    static async confirmRegistration({ code }: ConfirmRegistrationDto): Promise<boolean> {
        const isValid: Nullable<IJwtPayload> = await JwtService.verifyToken(code, 'confirm-email');
        if (!isValid) return false;

        const userId = isValid.userId;

        const isConfirmedUser: Nullable<ConfirmationUserSchema> = await QueryConfirmationUserRepository.findConfStatusByUserId(userId);
        if (!isConfirmedUser || isConfirmedUser.isConfirmed) return false;

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

        const _accessToken = +process.env.ACCESS_TOKEN_EXP! as number;
        const newDate = new Date();
        const deviceId: string = v4();
        const newToken: string = await JwtService.createJwt(
            {
                id,
                email,
                login,
                createdAt,
            },
            _accessToken,
            newDate,
            deviceId,
        );

        await EmailRepository.sendEmail(email, EmailPayloadsBuilder.createRegistration(newToken));
        return !!(await ConfirmationUserService.updateConfStatusByCode(id, newToken, false));
    }

    // static async refreshTokens(oldRefreshToken: string): PromiseNull<ITokens> {
    static async refreshTokens(deviceId: string, userId: string): PromiseNull<ITokens> {
        const userByToken: Nullable<IUser> = await QueryUserRepository.findById(userId);
        if (!userByToken) return null;

        const newDate: Date = new Date();

        await DeviceSessionService.refreshSessionByDeviceId(deviceId, newDate);

        const _accessToken = +process.env.ACCESS_TOKEN_EXP! as number;
        const _refreshToken = +process.env.REFRESH_TOKEN_EXP! as number;

        const [accessToken, refreshToken] = await Promise.all([JwtService.createJwt(userByToken, _accessToken, newDate, deviceId), JwtService.createJwt(userByToken, _refreshToken, newDate, deviceId)]);

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
