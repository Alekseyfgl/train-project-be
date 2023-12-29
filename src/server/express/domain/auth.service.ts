import { IJwtPayload, LoginDto } from '../types/auth/input';
import { QueryUserRepository } from '../repositories/user/query-user.repository';
import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import bcrypt from 'bcrypt';
import { IUser, UserSchema } from '../types/user/output';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class AuthService {
    static async login(dto: LoginDto): PromiseNull<{ accessToken: string }> {
        const { loginOrEmail, password } = dto;
        const user: Nullable<UserSchema> = await QueryUserRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;

        const isPasswordCorrect: boolean = await this.checkPassword(password, user.password);
        if (!isPasswordCorrect) return null;

        const newToken: string = await this.createJwt(user);
        return { accessToken: newToken };
    }

    // static async getUserIdByToken(token: string): PromiseNull<string> {
    //     try {
    //         const result = jwt.verify(token, process.env.JWT_SECRET as string) as IJwtPayload;
    //         return result.userId;
    //     } catch (e) {
    //         console.log('[getUserIdByToken]', e);
    //         return null;
    //     }
    // }

    static async verifyToken(token: string): PromiseNull<IJwtPayload> {
        try {
            return jwt.verify(token, process.env.JWT_SECRET as string) as IJwtPayload;
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
