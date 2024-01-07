import { PromiseNull } from '../../common/interfaces/optional.types';
import { UserModel } from '../../models/user.model';
import { DeleteResult } from 'mongodb';
import { ConfirmationUserSchema, IUser, UserSchema, UserWithConfirm } from '../../types/user/output';
import { RegistrationUserDto } from '../../types/auth/input';
import { userMapper, userWithConf } from '../../mappers/user.mapper';
import { ConfirmationUserModel } from '../../models/confirmation-user.model';

export class CommandUserRepository {
    static async removeById(id: string): Promise<boolean> {
        try {
            const result: DeleteResult = await UserModel.deleteOne({ _id: id });
            return !!result.deletedCount;
        } catch (e) {
            console.error('CommandUserRepository [removeById]', e);
            return false;
        }
    }

    static async create(dto: RegistrationUserDto, isConfirmed: boolean): PromiseNull<UserWithConfirm> {
        try {
            const createdUser: UserSchema = await UserModel.create(dto);
            const newUser: IUser = userMapper(createdUser);
            const confInfo: ConfirmationUserSchema = await ConfirmationUserModel.create({ userId: newUser.id, isConfirmed: isConfirmed });

            return userWithConf(newUser, confInfo);
        } catch (e) {
            console.error('CommandUserRepository [create]', e);
            return null;
        }
    }
}
