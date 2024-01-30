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
}
