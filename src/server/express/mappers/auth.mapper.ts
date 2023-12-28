import { IUserModel } from '../models/users.model';
import { IMe } from '../types/auth/output';

export const meMapper = (user: IUserModel): IMe => {
    return {
        email: user.email,
        login: user.login,
        userId: user.id,
    };
};
