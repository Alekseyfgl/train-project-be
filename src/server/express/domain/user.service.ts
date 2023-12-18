import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { CommandUserRepository } from '../repositories/user/command-user.repository';
import { AddUserDto } from '../types/user/input';
import { IUser } from '../types/user/output';
import { QueryUserRepository } from '../repositories/user/query-user.repository';
import bcrypt from 'bcrypt';

export class UserService {
    static async create(dto: AddUserDto): PromiseNull<IUser> {
        const hashedPassword: string = await this.hashPassword(dto.password);
        dto.password = hashedPassword;

        const createdUserId: Nullable<string> = await CommandUserRepository.create(dto);
        if (!createdUserId) return null;
        return QueryUserRepository.findById(createdUserId);
    }

    static async removeById(userId: string): Promise<boolean> {
        return await CommandUserRepository.removeById(userId);
    }

    private static async hashPassword(pass: string): Promise<string> {
        return bcrypt.hash(pass, +(process.env.SALT_ROUNDS as string));
    }

    private static async checkPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            return bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error('Error when comparing passwords:', error);
            return false;
        }
    }

    // static async updateById(id: string, dto: UpdatePostDto) {
    //     return CommandPostRepository.updateById(id, dto);
    // }
    //
    // static async removeById(id: string) {
    //     return CommandPostRepository.removeById(id);
    // }
}
