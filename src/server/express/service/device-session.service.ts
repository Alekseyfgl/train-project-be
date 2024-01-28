import { CommandDeviceSessionRepository } from '../repositories/device-session/command-device-session.repository';
import { DeviceSessionDto } from '../types/device-session/input';
import { v4 } from 'uuid';

export class DeviceSessionService {
    static async createSession(ip: string, os: string, location: string, refreshToken: string) {
        const newSession: DeviceSessionDto = {
            ip,
            os,
            location,
            deviceId: v4(),
            creatAt: new Date(),
            expAt: new Date(),
        };
        return CommandDeviceSessionRepository.create(newSession);
    }
}
