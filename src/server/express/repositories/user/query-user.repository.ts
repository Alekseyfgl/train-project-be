import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { offsetPagination } from '../../common/utils/offset-for-pagination/offset-for-pagination';
import { countTotalPages } from '../../common/utils/count-total-pages/count-total-pages';
import { UserModel } from '../../models/user.model';
import { pageUsersMapper, userMapper, userWithPasswordMapper } from '../../mappers/user.mapper';
import { IUser, IUserPaginationOut, UserSchema } from '../../types/user/output';
import { UserPaginationQuery } from '../../types/user/input';
import { meMapper } from '../../mappers/auth.mapper';
import { IMe } from '../../types/auth/output';
import { QueryConfirmationUserRepository } from '../confirmation-user/query-confirmation-user.repository';
import { ObjectId } from 'mongodb';

export class QueryUserRepository {
    static async findAll(query: UserPaginationQuery): Promise<IUserPaginationOut> {
        const { pageSize, pageNumber, sortDirection, sortBy, searchEmailTerm, searchLoginTerm } = query;

        let filter: { $or?: { email?: { $regex: RegExp }; login?: { $regex: RegExp } }[] } = {};

        if (searchEmailTerm || searchLoginTerm) {
            filter.$or = [];
            if (searchEmailTerm) {
                const filterByEmail: { email: { $regex: RegExp } } = { email: { $regex: new RegExp(searchEmailTerm, 'i') } };
                filter.$or.push(filterByEmail);
            }
            if (searchLoginTerm) {
                const filterByLogin: { login: { $regex: RegExp } } = { login: { $regex: new RegExp(searchLoginTerm, 'i') } };
                filter.$or.push(filterByLogin);
            }
        }
        const direction: 1 | -1 = sortDirection === 'desc' ? -1 : 1;

        try {
            const users: UserSchema[] = await UserModel.find(filter)
                .sort({ [sortBy]: direction })
                .skip(offsetPagination(pageNumber, pageSize))
                .limit(pageSize);

            const totalCount: number = await UserModel.countDocuments(filter);
            const pagesCount: number = countTotalPages(totalCount, pageSize);
            return pageUsersMapper({ users, pagesCount, totalCount, pageSize, pageNumber });
        } catch (e) {
            console.error('[findAll]', e);
            return pageUsersMapper({ users: [], pagesCount: 0, totalCount: 0, pageSize, pageNumber });
        }
    }

    static async findById(id: string): PromiseNull<IUser> {
        try {
            const user: Nullable<UserSchema> = await UserModel.findById(id);
            if (!user) return null;
            return userMapper(user);
        } catch (e) {
            console.error('[user,findById]', e);
            return null;
        }
    }

    static async findByLoginOrEmail(loginOrEmail: string): PromiseNull<ReturnType<typeof userWithPasswordMapper>> {
        try {
            const condition: RegExp = new RegExp('^' + loginOrEmail + '$', 'i');

            const user: Nullable<UserSchema> = await UserModel.findOne({ $or: [{ login: condition }, { email: condition }] });
            if (!user) return null;

            const confirmationStatus = await QueryConfirmationUserRepository.findConfStatusByUserId(user._id.toString());
            if (!confirmationStatus) return null;

            return userWithPasswordMapper(user, confirmationStatus);
        } catch (e) {
            console.error('[user,findByLoginOrEmail]', e);
            return null;
        }
    }

    static async findMe(userId: string): PromiseNull<IMe> {
        try {
            const user: Nullable<UserSchema> = await UserModel.findById(userId);
            if (!user) return null;
            return meMapper(user);
        } catch (e) {
            console.error('[user,findMe]', e);
            return null;
        }
    }
}

const x = {
    _id: new ObjectId('659edf8d2e4b9c27d7f06f6e'),
    isConfirmed: false,
    code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTllZGY4ZDJlNGI5YzI3ZDdmMDZmNmMiLCJpYXQiOjE3MDQ5MTA3MzMsImV4cCI6MTcwNDkxMTAzM30.N3QDD9ftOrZNIKe1ChHmHHL_RjGX0B47dAIziEQTv_w',
    __v: 0,
    userId: {
        _id: new ObjectId('659edf8d2e4b9c27d7f06f6c'),
        login: 'cestador',
        email: 'cestador@gmail.com',
        password: '$2b$10$16iDLMxw1rPTDOUUAMmoEen0nmBPFB.SPw3lj2xJeZ7VZWdHKkm8C',
        createdAt: '',
        __v: 0,
    },
};
