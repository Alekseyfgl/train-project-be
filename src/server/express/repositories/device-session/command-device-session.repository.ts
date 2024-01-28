import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { IDeviceSessionSchema } from '../../types/device-session/output';
import { DeviceSessionModel } from '../../models/device-session.model';
import { DeviceSessionDto } from '../../types/device-session/input';

export class CommandDeviceSessionRepository {
    static async create(dto: DeviceSessionDto): PromiseNull<IDeviceSessionSchema> {
        try {
            const createdDeviceSession: Nullable<IDeviceSessionSchema> = await DeviceSessionModel.create(dto);
            if (!createdDeviceSession) return null;

            return createdDeviceSession;
        } catch (e) {
            console.error('CommandRateLimitRequestRepository [create]', e);
            return null;
        }
    }
}
