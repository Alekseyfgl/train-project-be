import { CommandDeviceSessionRepository } from '../repositories/device-session/command-device-session.repository';
import { DeviceSessionDto } from '../types/device-session/input';
import dotenv from 'dotenv';
import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { IDeviceSessionModel, IDeviceSessionSchema } from '../types/device-session/output';
import { QueryDeviceSessionRequestRepository } from '../repositories/device-session/query-device-session.repository';
import { HttpStatusCodes } from '../common/constans/http-status-codes';

dotenv.config();

export class DeviceSessionService {
    static createRefreshSession(data: DeviceSessionDto): PromiseNull<IDeviceSessionSchema> {
        return CommandDeviceSessionRepository.create(data);
    }

    static refreshSessionByDeviceId(deviceId: string, createdAt: Date): Promise<boolean> {
        return CommandDeviceSessionRepository.updateDateByDeviceId(deviceId, createdAt);
    }

    static deleteAllExpectCurrentSession(currentDeviceId: string, userId: string) {
        return CommandDeviceSessionRepository.deleteAllExpectCurrentSession(currentDeviceId, userId);
    }

    static async removeSessionByOne(deviceId: string, userId: string) {
        const sessionForRemove: Nullable<IDeviceSessionModel> = await QueryDeviceSessionRequestRepository.findByDeviceId(deviceId);
        if (!sessionForRemove) return HttpStatusCodes.NOT_FOUND;

        const checkAccess: boolean = userId === sessionForRemove.userId;
        if (!checkAccess) return HttpStatusCodes.FORBIDDEN;

        const result = await CommandDeviceSessionRepository.deleteByDeviceIds([deviceId]);
        return result ? HttpStatusCodes.NO_CONTENT : HttpStatusCodes.NOT_FOUND;
    }
}
