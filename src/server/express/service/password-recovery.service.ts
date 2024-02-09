import dotenv from 'dotenv';
import { CommandRecoveryPasswordRepository } from '../repositories/recovery-password/command-recovery-password.repository';
import { Nullable } from '../common/interfaces/optional.types';

dotenv.config();

export class PasswordRecoveryService {
    static updateCode(code: Nullable<string>, userId: string): Promise<boolean> {
        return CommandRecoveryPasswordRepository.changeCode(code, userId);
    }

    static createRowPasswordRecovery(userId: string): Promise<boolean> {
        return CommandRecoveryPasswordRepository.create(userId);
    }
}
