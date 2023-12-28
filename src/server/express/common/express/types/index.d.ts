import { IJwtPayload } from '../../../domain/auth.service';

export declare global {
    export declare namespace Express {
        export interface Request {
            user?: IJwtPayload;
        }
    }
}
