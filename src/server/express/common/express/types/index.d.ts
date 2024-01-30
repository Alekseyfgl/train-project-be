import { IAgentInfo, IJwtPayload } from '../../../types/auth/input';

export declare global {
    export declare namespace Express {
        export interface Request {
            user?: IJwtPayload;
            networkInfo: IAgentInfo;
        }
    }
}
