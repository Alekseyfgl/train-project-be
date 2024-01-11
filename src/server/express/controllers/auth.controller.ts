import { Request, Response } from 'express';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { LoginDto, RegistrationUserDto } from '../types/auth/input';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { IMe } from '../types/auth/output';
import { QueryUserRepository } from '../repositories/user/query-user.repository';
import { AuthService } from '../service/auth.service';

class AuthController {
    async confirmRegistration(req: Request<{}, {}, { code: string }>, res: Response) {
        const result: boolean = await AuthService.confirmRegistration(req.body);

        const response = new ApiResponse(res);
        result ? response.send(HttpStatusCodes.NO_CONTENT) : response.badRequest();
    }

    async resendEmail(req: Request<{}, {}, { email: string }>, res: Response) {
        const result: boolean = await AuthService.resendEmail(req.body.email);

        const response = new ApiResponse(res);
        result ? response.send(HttpStatusCodes.NO_CONTENT) : response.badRequest();
    }

    async registration(req: Request<{}, {}, RegistrationUserDto>, res: Response) {
        const result: boolean = await AuthService.registration(req.body);

        const response = new ApiResponse(res);
        result ? response.send(HttpStatusCodes.NO_CONTENT) : response.badRequest();
    }

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
