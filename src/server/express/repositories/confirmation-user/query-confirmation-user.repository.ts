import { ConfirmationUserModel } from '../../models/confirmation-user.model';
import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { ConfirmationUserSchema } from '../../types/user/output';

export class QueryConfirmationUserRepository {
    static async findConfStatusByUserId(userId: string): PromiseNull<ConfirmationUserSchema> {
        try {
            const confirmationStatus: Nullable<ConfirmationUserSchema> = await ConfirmationUserModel.findOne({ userId });
            return confirmationStatus;
        } catch (err) {
            console.error('QueryConfirmationUserRepository [create]', err);
            return null;
        }
    }
}
