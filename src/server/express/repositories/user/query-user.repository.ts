import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { offsetPagination } from '../../common/utils/offset-for-pagination/offset-for-pagination';
import { countTotalPages } from '../../common/utils/count-total-pages/count-total-pages';
import { IUserModel, UserModel } from '../../models/users.model';
import { pageUsersMapper, userMapper } from '../../mappers/user.mapper';
import { IUser, IUserPaginationOut } from '../../types/user/output';
import { UserPaginationQuery } from '../../types/user/input';

export class QueryUserRepository {
    static async findAll(query: UserPaginationQuery): Promise<IUserPaginationOut> {
        const { pageSize, pageNumber, sortDirection, sortBy, searchEmailTerm, searchLoginTerm } = query;

        let filter: { $or?: Array<{ email?: { $regex: RegExp }; login?: { $regex: RegExp } }> } = {};

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
            const users: IUserModel[] = await UserModel.find(filter)
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
            const user: Nullable<IUserModel> = await UserModel.findById(id);
            if (!user) return null;
            return userMapper(user);
        } catch (e) {
            console.error('[BLOG,findById]', e);
            return null;
        }
    }

    static async findByLoginOrEmail(loginOrEmail: string): PromiseNull<IUserModel> {
        try {
            const condition: RegExp = new RegExp('^' + loginOrEmail + '$', 'i');
            const user: IUserModel | null = await UserModel.findOne({ $or: [{ login: condition }, { email: condition }] });
            if (!user) return null;
            return user;
        } catch (e) {
            console.error('[BLOG,findById]', e);
            return null;
        }
    }
}
