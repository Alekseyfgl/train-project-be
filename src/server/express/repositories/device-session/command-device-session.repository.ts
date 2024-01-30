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
            console.error('CommandDeviceSessionRepository [create]', e);
            return null;
        }
    }

    static async updateDateByDeviceId(deviceId: string, issuedAt: Date) {
        try {
            const createdDeviceSession = await DeviceSessionModel.updateOne({ deviceId }, { creatAt: issuedAt });
            return !!createdDeviceSession;
        } catch (e) {
            console.error('CommandDeviceSessionRepository [updateDate]', e);
            return false;
        }
    }

    static async deleteByDeviceIds(deviceIds: string[]): Promise<boolean> {
        try {
            const result = await DeviceSessionModel.deleteMany({ deviceId: { $in: deviceIds } });
            return !!result.deletedCount;
        } catch (e) {
            console.error('CommandDeviceSessionRepository [deleteByDeviceIds]', e);
            return false;
        }
    }
}
