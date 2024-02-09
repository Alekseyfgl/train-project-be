import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { DeviceSessionModel } from '../../models/device-session.model';
import { IDeviceSession, IDeviceSessionModel, IDeviceSessionSchema } from '../../types/device-session/output';
import { deviceSessionMapper, deviceSessionsMapper } from '../../mappers/device-sessions.mapper';

export class QueryDeviceSessionRequestRepository {
    static async findByDeviceId(deviceId: string): PromiseNull<IDeviceSessionModel> {
        try {
            const result = await DeviceSessionModel.findOne({ deviceId });
            return result ? deviceSessionMapper(result) : null;
        } catch (e) {
            console.log('QueryDeviceSessionRequestRepository [findByDeviceId]', e);
            return null;
        }
    }

    static async findByUserId(userId: string): PromiseNull<IDeviceSession[]> {
        try {
            const result: Nullable<IDeviceSessionSchema[]> = await DeviceSessionModel.find({ userId });
            return result ? deviceSessionsMapper(result) : null;
        } catch (e) {
            console.log('QueryDeviceSessionRequestRepository [findByUserId]', e);
            return null;
        }
    }
}
