import { CommandDeviceSessionRepository } from '../repositories/device-session/command-device-session.repository';
import { DeviceSessionDto } from '../types/device-session/input';
import dotenv from 'dotenv';
import { PromiseNull } from '../common/interfaces/optional.types';
import { IDeviceSessionSchema } from '../types/device-session/output';

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

    // static async removeSessionByOne(deviceId: string) {
    //     return CommandDeviceSessionRepository.deleteByDeviceIds([deviceId]);
    // }

    // static checkAccessForSession(session: IDeviceSessionSchema, userId: string, deviceId: string) {
    //     if (session.userId !== userId) return false;
    //     return session.deviceId === deviceId;
    // }
}
