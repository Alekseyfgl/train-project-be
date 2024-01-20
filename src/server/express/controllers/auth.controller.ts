import { Request, Response } from 'express';
import { ApiResponse } from '../common/api-response/api-response';
import { HttpStatusCodes } from '../common/constans/http-status-codes';
import { LoginDto, RegistrationUserDto } from '../types/auth/input';
import { Nullable, Optional } from '../common/interfaces/optional.types';
import { IMe, ITokens } from '../types/auth/output';
import { QueryUserRepository } from '../repositories/user/query-user.repository';
import { AuthService } from '../service/auth.service';
import { COOKIE_NAME } from '../common/constans/cookie';

class AuthController {
    async confirmRegistration(req: Request<{}, {}, { code: string }>, res: Response) {
        const result: boolean = await AuthService.confirmRegistration(req.body);

        const response = new ApiResponse(res);
        result ? response.send(HttpStatusCodes.NO_CONTENT) : response.badRequest('code');
    }

    async resendEmail(req: Request<{}, {}, { email: string }>, res: Response) {
        const result: boolean = await AuthService.resendEmail(req.body.email);

        const response = new ApiResponse(res);
        result ? response.send(HttpStatusCodes.NO_CONTENT) : response.badRequest('email');
    }

    async registration(req: Request<{}, {}, RegistrationUserDto>, res: Response) {
        const result: boolean = await AuthService.registration(req.body);

        const response = new ApiResponse(res);
        result ? response.send(HttpStatusCodes.NO_CONTENT) : response.badRequest();
    }

    async login(req: Request<{}, {}, LoginDto>, res: Response) {
        const result: Nullable<ITokens> = await AuthService.login(req.body);
        if (!result) return new ApiResponse(res).notAuthorized();

        const { refreshToken, accessToken } = result;

        res.cookie(COOKIE_NAME.REFRESH_TOKEN, refreshToken, { httpOnly: true, secure: true });
        new ApiResponse(res).send(HttpStatusCodes.OK, { accessToken });
    }

    async me(req: Request<{}, {}, LoginDto>, res: Response) {
        const userId: Optional<string> = req?.user?.userId;
        const response = new ApiResponse(res);
        if (!userId) return response.notAuthorized();

        const result: Nullable<IMe> = await QueryUserRepository.findMe(userId);
        result ? response.send(HttpStatusCodes.OK, result) : response.notAuthorized();
    }

    async refreshToken(req: Request<{}, {}, {}>, res: Response) {
        const oldRefreshToken: Optional<string> = req.cookies[COOKIE_NAME.REFRESH_TOKEN];
        if (!oldRefreshToken) return new ApiResponse(res).notAuthorized();

        const result: Nullable<ITokens> = await AuthService.refreshTokens(oldRefreshToken);
        if (!result) return new ApiResponse(res).notAuthorized();

        const { accessToken, refreshToken } = result;

        res.cookie(COOKIE_NAME.REFRESH_TOKEN, refreshToken, { httpOnly: true, secure: true });
        new ApiResponse(res).send(HttpStatusCodes.OK, { accessToken });
    }
    async logout(req: Request<{}, {}, {}>, res: Response) {
        const refreshTokenFromCookie: Optional<string> = req.cookies[COOKIE_NAME.REFRESH_TOKEN];
        if (!refreshTokenFromCookie) return new ApiResponse(res).notAuthorized();

        const isRefreshTokenVerified: boolean = await AuthService.logout(refreshTokenFromCookie);
        if (!isRefreshTokenVerified) return new ApiResponse(res).notAuthorized();

        res.cookie(COOKIE_NAME.REFRESH_TOKEN, '', { maxAge: 0 });
        new ApiResponse(res).send(HttpStatusCodes.NO_CONTENT);
    }
}

export const userController = new AuthController();
