import { LoginDto } from '../types/auth/input';
import { QueryUserRepository } from '../repositories/user/query-user.repository';
import { Nullable } from '../common/interfaces/optional.types';
import { IUserModel } from '../models/users.model';
import bcrypt from 'bcrypt';

export class AuthService {
    static async login(dto: LoginDto): Promise<boolean> {
        const { loginOrEmail, password } = dto;
        const user: Nullable<IUserModel> = await QueryUserRepository.findByLogin(loginOrEmail);
        if (!user) return false;

        return this.checkPassword(password, user.password);
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
