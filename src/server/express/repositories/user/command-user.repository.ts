import { PromiseNull } from '../../common/interfaces/optional.types';
import { AddUserDto } from '../../types/user/input';
import { UserModel } from '../../models/user.model';
import { DeleteResult } from 'mongodb';
import { UserSchema } from '../../types/user/output';

export class CommandUserRepository {
    static async removeById(id: string): Promise<boolean> {
        try {
            const result: DeleteResult = await UserModel.deleteOne({ _id: id });
            return !!result.deletedCount;
        } catch (e) {
            console.error('[removeById]', e);
            return false;
        }
    }

    static async create(dto: AddUserDto): PromiseNull<string> {
        try {
            const createdUser: UserSchema = await UserModel.create(dto);
            return createdUser.id;
        } catch (err) {
            console.error('CommandUserRepository [create]', err);
            return null;
        }
    }
}
