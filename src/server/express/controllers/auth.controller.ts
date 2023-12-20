import { Request, Response } from 'express';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { LoginDto } from '../types/auth/input';
import { AuthService } from '../domain/auth.service';

class AuthController {
    async login(req: Request<{}, {}, LoginDto>, res: Response) {
        const response = new ApiResponse(res);
        const isLogin = await AuthService.login(req.body);
        isLogin ? response.send(HttpStatusCodes.NO_CONTENT) : response.notAuthorized();
    }
}

export const userController = new AuthController();
