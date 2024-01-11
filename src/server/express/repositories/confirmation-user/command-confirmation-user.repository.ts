import { ConfirmationUserModel } from '../../models/confirmation-user.model';
import { PromiseNull } from '../../common/interfaces/optional.types';
import { ConfirmationUserSchema } from '../../types/user/output';

export class CommandConfirmationUserRepository {
    static async updateConfStatusByCode(code: string): PromiseNull<ConfirmationUserSchema> {
        try {
            // Второй параметр метода findOneAndUpdate - это объект с обновлениями.
            // $set оператор используется для указания полей, которые нужно обновить.
            return ConfirmationUserModel.findOneAndUpdate(
                { code }, // условие поиска
                { $set: { isConfirmed: true, code: null } }, // обновляемые поля
                { new: true }, // опция, указывающая, что нужно вернуть обновлённый документ
            );
        } catch (err) {
            console.error('CommandConfirmationUserRepository [updateConfStatusByCode]', err);
            return null;
        }
    }
}
