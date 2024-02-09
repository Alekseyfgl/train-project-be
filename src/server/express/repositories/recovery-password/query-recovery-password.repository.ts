import { RecoveryPasswordModel } from '../../models/recovery-password.model';
import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { IRecoveryPassword, IRecoveryPasswordSchema } from '../../types/recovery-password/output';
import { recoveryPasswordMapper } from '../../mappers/recovery-password.mapper';

export class QueryRecoveryPasswordRepository {
    static async findCode(code: string): PromiseNull<IRecoveryPassword> {
        try {
            const result: Nullable<IRecoveryPasswordSchema> = await RecoveryPasswordModel.findOne({ code });
            return result ? recoveryPasswordMapper(result) : null;
        } catch (e) {
            console.error('QueryRecoveryPasswordRepository [findCode]', e);
            return null;
        }
    }
}
