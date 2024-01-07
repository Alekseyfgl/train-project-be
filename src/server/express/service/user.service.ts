import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { CommandUserRepository } from '../repositories/user/command-user.repository';
import { UserWithConfirm } from '../types/user/output';
import bcrypt from 'bcrypt';
import { RegistrationUserDto } from '../types/auth/input';
import { EmailRepository } from '../repositories/email/email.repository';
import { EmailPayloadsBuilder } from '../repositories/email/messages/email-payloads';

export class UserService {
    static async create(dto: RegistrationUserDto, isUserConfirmed: boolean = false): PromiseNull<UserWithConfirm> {
        const hashedPassword: string = await this.hashPassword(dto.password);
        dto.password = hashedPassword;

        const createdUser: Nullable<UserWithConfirm> = await CommandUserRepository.create(dto, isUserConfirmed);
        if (!createdUser) return null;

        if (isUserConfirmed) return createdUser;

        const isEmailSent = await EmailRepository.sendEmail(createdUser.email, EmailPayloadsBuilder.createRegistration(createdUser.confirmInfo.id));
        console.log('isEmailSent', isEmailSent);
        if (!isEmailSent) {
            await UserService.removeById(createdUser.id);
        }
        return null;
    }

    static async removeById(userId: string): Promise<boolean> {
        return await CommandUserRepository.removeById(userId);
    }

    private static async hashPassword(pass: string): Promise<string> {
        return bcrypt.hash(pass, +(process.env.SALT_ROUNDS as string));
    }

    // static async updateById(id: string, dto: UpdatePostDto) {
    //     return CommandPostRepository.updateById(id, dto);
    // }
    //
    // static async removeById(id: string) {
    //     return CommandPostRepository.removeById(id);
    // }
}
