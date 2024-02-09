import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { CommandUserRepository } from '../repositories/user/command-user.repository';
import { UserWithConfirm } from '../types/user/output';
import bcrypt from 'bcrypt';
import { RegistrationUserDto } from '../types/auth/input';

export class UserService {
    static async create(dto: RegistrationUserDto, isUserConfirmed: boolean): PromiseNull<UserWithConfirm> {
        const hashedPassword: string = await this.hashPassword(dto.password);
        dto.password = hashedPassword;

        const createdUser: Nullable<UserWithConfirm> = await CommandUserRepository.create(dto, isUserConfirmed);

        return createdUser;
    }

    static async removeById(userId: string): Promise<boolean> {
        return await CommandUserRepository.removeById(userId);
    }

    static async hashPassword(pass: string): Promise<string> {
        return bcrypt.hash(pass, +(process.env.SALT_ROUNDS as string));
    }
}
