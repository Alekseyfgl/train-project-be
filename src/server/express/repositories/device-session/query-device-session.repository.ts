import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { DeviceSessionModel } from '../../models/device-session.model';
import { IDeviceSession, IDeviceSessionSchema } from '../../types/device-session/output';
import { deviceSessionMapper } from '../../mappers/device-session.mapper';

export class QueryDeviceSessionRequestRepository {
    static async findByDeviceId(deviceId: string): PromiseNull<IDeviceSessionSchema> {
        try {
            return await DeviceSessionModel.findOne({ deviceId });
        } catch (e) {
            console.log('QueryDeviceSessionRequestRepository [findByDeviceId]', e);
            return null;
        }
    }

    static async findByUserId(userId: string): PromiseNull<IDeviceSession[]> {
        try {
            const result: Nullable<IDeviceSessionSchema[]> = await DeviceSessionModel.find({ userId });
            return result ? deviceSessionMapper(result) : null;
        } catch (e) {
            console.log('QueryDeviceSessionRequestRepository [findByUserId]', e);
            return null;
        }
    }
}
