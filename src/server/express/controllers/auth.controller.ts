import { Request, Response } from 'express';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { LoginDto } from '../types/auth/input';
import { AuthService } from '../domain/auth.service';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { IMe } from '../types/auth/output';
import { QueryUserRepository } from '../repositories/user/query-user.repository';

class AuthController {
    async login(req: Request<{}, {}, LoginDto>, res: Response) {
        const result: Nullable<{ accessToken: string }> = await AuthService.login(req.body);
        const response = new ApiResponse(res);
        result ? response.send(HttpStatusCodes.OK, result) : response.notAuthorized();
    }

    async me(req: Request<{}, {}, LoginDto>, res: Response) {
        const userId: Optional<string> = req?.user?.userId;
        const response = new ApiResponse(res);
        if (!userId) return response.notAuthorized();

        const result: Nullable<IMe> = await QueryUserRepository.findMe(userId);
        result ? response.send(HttpStatusCodes.OK, result) : response.notAuthorized();
    }
}

export const userController = new AuthController();
