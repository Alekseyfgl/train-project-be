import { RecoveryPasswordModel } from '../../models/recovery-password.model';
import { UpdateWriteOpResult } from 'mongoose';
import { Nullable } from '../../common/interfaces/optional.types';

export class CommandRecoveryPasswordRepository {
    static async changeCode(newCode: Nullable<string>, userId: string): Promise<boolean> {
        try {
            const updatedCode: UpdateWriteOpResult = await RecoveryPasswordModel.updateOne({ userId }, { code: newCode });
            return !!updatedCode;
        } catch (e) {
            console.error('CommandRecoveryPasswordRepository [changeCode]', e);
            return false;
        }
    }

    static async create(userId: string): Promise<boolean> {
        try {
            const result = await RecoveryPasswordModel.create({ code: null, userId });
            return !!result;
        } catch (e) {
            console.error('CommandRecoveryPasswordRepository [create]', e);
            return false;
        }
    }
}
