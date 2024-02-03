import { CommandDeviceSessionRepository } from '../repositories/device-session/command-device-session.repository';
import { DeviceSessionDto } from '../types/device-session/input';
import dotenv from 'dotenv';
import { Nullable, PromiseNull } from '../common/interfaces/optional.types';
import { IDeviceSessionSchema } from '../types/device-session/output';
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

    static removeSessionByMany(deviceId: string[]) {
        return CommandDeviceSessionRepository.deleteByDeviceIds(deviceId);
    }

    static deleteAllExpectCurrentSession(currentDeviceId: string, userId: string) {
        return CommandDeviceSessionRepository.deleteAllExpectCurrentSession(currentDeviceId, userId);
    }

    static async removeSessionByOne(deviceId: string, userId: string) {
        const sessionForRemove: Nullable<IDeviceSessionSchema> = await QueryDeviceSessionRequestRepository.findByDeviceId(deviceId);
        if (!sessionForRemove) return HttpStatusCodes.NOT_FOUND;

        const checkAccess: boolean = userId === sessionForRemove.userId;
        if (!checkAccess) return HttpStatusCodes.FORBIDDEN;

        const result = await CommandDeviceSessionRepository.deleteByDeviceIds([deviceId]);
        return result ? HttpStatusCodes.OK : HttpStatusCodes.NOT_FOUND;
    }

    // static checkAccessForSession(session: IDeviceSessionSchema, userId: string, deviceId: string) {
    //     if (session.userId !== userId) return false;
    //     return session.deviceId === deviceId;
    // }
}
