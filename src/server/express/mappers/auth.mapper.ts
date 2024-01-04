import { IMe } from '../types/auth/output';
import { UserSchema } from '../types/user/output';

export const meMapper = (user: UserSchema): IMe => {
    return {
        email: user.email,
        login: user.login,
        userId: user._id.toString(),
    };
};
