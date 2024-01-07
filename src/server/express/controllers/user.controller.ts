import { Request, Response } from 'express';
import { IUser } from '../types/user/output';
import { Nullable } from '../common/interfaces/optional.types';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { createFilterGetAllUsersMapper } from '../mappers/user.mapper';
import { QueryUserRepository } from '../repositories/user/query-user.repository';
import { UserService } from '../service/user.service';
import { RegistrationUserDto } from '../types/auth/input';
import { UserPaginationQuery } from '../types/user/input';

class UserController {
    /**
     * create user like a supper admin
     */
    async createUser(req: Request<{}, {}, RegistrationUserDto>, res: Response) {
        const newUser: Nullable<IUser> = await UserService.create(req.body, true);
        const response = new ApiResponse(res);

        newUser ? response.send(HttpStatusCodes.NO_CONTENT, newUser) : response.badRequest();
    }

    async removeById(req: Request<{ id: string }>, res: Response) {
        const isRemoved: boolean = await UserService.removeById(req.params.id);
        const response = new ApiResponse(res);

        isRemoved ? response.send(HttpStatusCodes.NO_CONTENT) : response.notFound();
    }

    async getAll(req: Request<{}, {}, {}, {}>, res: Response) {
        const query: UserPaginationQuery = createFilterGetAllUsersMapper(req.query);
        const pageWithUsers = await QueryUserRepository.findAll(query);
        new ApiResponse(res).send(HttpStatusCodes.OK, pageWithUsers);
    }
}

export const userController = new UserController();
