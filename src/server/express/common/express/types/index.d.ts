import { IAgentInfo, IJwtPayload } from '../../../types/auth/input';
import { IDeviceSessionModel } from '../../../types/device-session/output';

export declare global {
    export declare namespace Express {
        export interface Request {
            user?: IJwtPayload;
            networkInfo: IAgentInfo;
            deviceSession?: IDeviceSessionModel;
        }
    }
}
