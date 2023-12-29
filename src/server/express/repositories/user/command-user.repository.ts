import { PromiseNull } from '../../common/interfaces/optional.types';
import { AddUserDto } from '../../types/user/input';
import { IUserModel, UserModel } from '../../models/user.model';
import { DeleteResult } from 'mongodb';

export class CommandUserRepository {
    // static async updateById(id: string, dto: UpdateBlogDto): Promise<boolean> {
    //     try {
    //         const result: UpdateWriteOpResult = await BlogModel.updateOne({ _id: id }, dto);
    //         return !!result.matchedCount;
    //     } catch (e) {
    //         console.error('[updateById]', e);
    //         return false;
    //     }
    // }

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
            const createdUser: IUserModel = await UserModel.create(dto);
            return createdUser.id;
        } catch (err) {
            console.error('CommandUserRepository [create]', err);
            return null;
        }
    }
}
