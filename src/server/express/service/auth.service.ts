import { IJwtPayload, LoginDto, RegistrationUserDto } from '../types/auth/input';
import { QueryUserRepository } from '../repositories/user/query-user.repository';
import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import bcrypt from 'bcrypt';
import { IUser, UserWithConfirm } from '../types/user/output';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { userWithPasswordMapper } from '../mappers/user.mapper';
import { UserService } from './user.service';

dotenv.config();

export class AuthService {
    static async login(dto: LoginDto): PromiseNull<{ accessToken: string }> {
        const { loginOrEmail, password } = dto;
        const user: Nullable<ReturnType<typeof userWithPasswordMapper>> = await QueryUserRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;

        const isPasswordCorrect: boolean = await this.checkPassword(password, user.password);
        if (!isPasswordCorrect) return null;

        const newToken: string = await this.createJwt(user);
        return { accessToken: newToken };
    }

    static async registration(dto: RegistrationUserDto): Promise<boolean> {
        const registeredUser: Nullable<UserWithConfirm> = await UserService.create(dto);
        if (!registeredUser) return false;

        // const codeForConfirmation: string = registeredUser.confirmInfo.id;

        // await EmailRepository.sendEmail(dto.email, EmailPayloadsBuilder.createRegistration(codeForConfirmation));

        return true;
    }

    static async verifyToken(token: string): PromiseNull<IJwtPayload> {
        try {
            const dataFromToken = (await jwt.verify(token, process.env.JWT_SECRET as string)) as IJwtPayload;

            return dataFromToken;
        } catch (e) {
            console.log('[getUserIdByToken]', e);
            return null;
        }
    }

    static async createJwt(user: IUser): Promise<string> {
        return jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: process.env.ACCESS_TOKEN_EXP as string });
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
