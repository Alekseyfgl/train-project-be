import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { UserModel } from '../../models/user.model';
import { ConfirmationUserSchema, IUser, UserSchema, UserWithConfirm } from '../../types/user/output';
import { RegistrationUserDto } from '../../types/auth/input';
import { userMapper, userWithConf } from '../../mappers/user.mapper';
import { ConfirmationUserModel } from '../../models/confirmation-user.model';
import { JwtService } from '../../service/jwt.service';

export class CommandUserRepository {
    static async removeById(id: string): Promise<boolean> {
        try {
            const result = await UserModel.findOneAndDelete({ _id: id });
            return !!result;
        } catch (e) {
            console.error('CommandUserRepository [removeById]', e);
            return false;
        }
    }

    static async create(dto: RegistrationUserDto, isConfirmed: boolean): PromiseNull<UserWithConfirm> {
        try {
            const createdUser: UserSchema = await UserModel.create(dto);
            const newUser: IUser = userMapper(createdUser);

            const confCode: Nullable<string> = isConfirmed ? null : await JwtService.createJwt(newUser, '5m');
            const confInfo: ConfirmationUserSchema = await ConfirmationUserModel.create({ userId: newUser.id, isConfirmed: isConfirmed, code: confCode });

            return userWithConf(newUser, confInfo);
        } catch (e) {
            console.error('CommandUserRepository [create]', e);
            return null;
        }
    }
}
