import { JwtPayload } from 'jsonwebtoken';

export interface RegistrationUserDto {
    login: string;
    password: string;
    email: string;
}

export interface IJwtPayload extends JwtPayload {
    userId: string;
}

export interface LoginDto {
    loginOrEmail: string;
    password: string;
}

// export interface AuthRequest<P = {}, ResBody = {}, ReqBody = {}, ReqQuery = {}> extends Request<P, ResBody, ReqBody, ReqQuery> {
//     user: IJwtPayload;
// }
