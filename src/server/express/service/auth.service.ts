import { ChangePasswordDto, ConfirmRegistrationDto, IAgentInfo, IJwtPayload, LoginDto, RegistrationUserDto } from '../types/auth/input';
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
import { PasswordRecoveryService } from './password-recovery.service';
import { QueryRecoveryPasswordRepository } from '../repositories/recovery-password/query-recovery-password.repository';
import { IRecoveryPassword } from '../types/recovery-password/output';
import { CommandUserRepository } from '../repositories/user/command-user.repository';

dotenv.config();

export class AuthService {
    static async login(dto: LoginDto, userAgent: IAgentInfo): PromiseNull<ITokens> {
        const { loginOrEmail, password } = dto;
        const { os, loc, ip } = userAgent;
        const user: Nullable<ReturnType<typeof userWithPasswordMapper>> = await QueryUserRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;
        const userId: string = user.id;

        const isPasswordCorrect: boolean = await this.checkPassword(password, user.password);
        if (!isPasswordCorrect) return null;

        const isUserConfirmed: boolean = user.confInfo.isConfirmed;
        if (!isUserConfirmed) return null;

        const _accessToken = +process.env.ACCESS_TOKEN_EXP! as number;
        const _refreshToken = +process.env.REFRESH_TOKEN_EXP! as number;

        // const creatAt: Date = new Date();
        const creatAt: Date = JwtService.iat;
        const deviceId: string = v4();
        const [accessToken, refreshToken] = await Promise.all([JwtService.createJwt(user.id, _accessToken, creatAt, deviceId), JwtService.createJwt(user.id, _refreshToken, creatAt, deviceId)]);

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

        await PasswordRecoveryService.createRowPasswordRecovery(registeredUser.id);
        return true;
    }

    static async logout(deviceId: string, userId: string): Promise<boolean> {
        const result = await DeviceSessionService.removeSessionByOne(deviceId, userId);
        return result === HttpStatusCodes.NO_CONTENT;
    }

    static async confirmRegistration({ code }: ConfirmRegistrationDto): Promise<boolean> {
        const isValid: Nullable<IJwtPayload> = await JwtService.verifyToken(code);
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

        const isConfirmedUser: Nullable<ConfirmationUserSchema> = await QueryConfirmationUserRepository.findConfStatusByUserId(user.id);
        if (!isConfirmedUser) return false;
        if (isConfirmedUser.isConfirmed) return false;

        const _accessToken = +process.env.ACCESS_TOKEN_EXP! as number;
        const creatAt: Date = JwtService.iat;
        const deviceId: string = v4();
        const newToken: string = await JwtService.createJwt(user.id, _accessToken, creatAt, deviceId);

        await EmailRepository.sendEmail(user.email, EmailPayloadsBuilder.createRegistration(newToken));
        return !!(await ConfirmationUserService.updateConfStatusByCode(user.id, newToken, false));
    }

    // static async refreshTokens(oldRefreshToken: string): PromiseNull<ITokens> {
    static async refreshTokens(deviceId: string, userId: string): PromiseNull<ITokens> {
        const userByToken: Nullable<IUser> = await QueryUserRepository.findById(userId);
        if (!userByToken) return null;

        const creatAt = JwtService.iat;

        await DeviceSessionService.refreshSessionByDeviceId(deviceId, creatAt);

        const _accessToken = +process.env.ACCESS_TOKEN_EXP! as number;
        const _refreshToken = +process.env.REFRESH_TOKEN_EXP! as number;

        const [accessToken, refreshToken] = await Promise.all([JwtService.createJwt(userByToken.id, _accessToken, creatAt, deviceId), JwtService.createJwt(userByToken.id, _refreshToken, creatAt, deviceId)]);

        return { accessToken, refreshToken };
    }

    static async sendRecoveryPasswordMsg(email: string) {
        const user: Nullable<ReturnType<typeof userWithPasswordMapper>> = await QueryUserRepository.findByLoginOrEmail(email);
        if (!user) return false;

        const expiresIn: number = +process.env.CONFIRMATION_TOKEN_PASSWORD_EXP!; // in seconds
        const issuedAt: Date = JwtService.iat;

        const recoveryCode: string = await JwtService.createJwt(user.id, expiresIn, issuedAt, v4());

        const isSentEmail = await EmailRepository.sendEmail(email, EmailPayloadsBuilder.createRecoveryPassword(recoveryCode));
        if (!isSentEmail) return false;

        return PasswordRecoveryService.updateCode(recoveryCode, user.id);
    }

    static async changePassword(dto: ChangePasswordDto): Promise<boolean> {
        const { recoveryCode, newPassword } = dto;

        const recoveryModel: Nullable<IRecoveryPassword> = await QueryRecoveryPasswordRepository.findCode(recoveryCode);
        if (!recoveryModel) return false;

        const userId: string = recoveryModel.userId;

        const verifiedToken: Nullable<IJwtPayload> = await JwtService.verifyToken(recoveryModel.code);
        // console.log('verifiedToken', verifiedToken);
        if (!verifiedToken) {
            // await PasswordRecoveryService.updateCode(null, userId);
            return false;
        }

        const hashedPassword: string = await UserService.hashPassword(newPassword);

        const isPasswordChanged: boolean = await CommandUserRepository.changePassword(userId, hashedPassword);
        if (!isPasswordChanged) return false;

        // await PasswordRecoveryService.updateCode(null, userId);
        return true;
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
