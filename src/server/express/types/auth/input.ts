import { JwtPayload } from 'jsonwebtoken';

export interface RegistrationUserDto {
    login: string;
    password: string;
    email: string;
}

export interface ConfirmRegistrationDto {
    code: string;
}
export type UserLocationType = `Country:${string}, city:${string}` | 'Unknown';
export type UserBrowserType = `Browser:${string}, version:${string}` | 'Unknown';
export type UserOsType = string | 'Unknown';

export interface IAgentInfo {
    browser: UserBrowserType;
    os: UserOsType;
    loc: UserLocationType;
    ip: string;
}

export interface IJwtPayload extends JwtPayload {
    userId: string;
    deviceId: string;
}

export interface LoginDto {
    loginOrEmail: string;
    password: string;
}

// export interface AuthRequest<P = {}, ResBody = {}, ReqBody = {}, ReqQuery = {}> extends Request<P, ResBody, ReqBody, ReqQuery> {
//     user: IJwtPayload;
// }
