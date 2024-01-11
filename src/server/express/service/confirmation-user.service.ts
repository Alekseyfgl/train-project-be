import { PromiseNull } from '../common/interfaces/optional.types';
import { CommandConfirmationUserRepository } from '../repositories/confirmation-user/command-confirmation-user.repository';
import { ConfirmationUserSchema } from '../types/user/output';

export class ConfirmationUserService {
    static async updateConfStatusByCode(code: string, isConfirmed: boolean): PromiseNull<ConfirmationUserSchema> {
        return CommandConfirmationUserRepository.updateConfStatusByCode(code, isConfirmed);
    }
}
