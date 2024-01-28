import { PromiseNull } from '../../common/interfaces/optional.types';
import { DeviceSessionModel } from '../../models/device-session.model';
import { IDeviceSessionSchema } from '../../types/device-session/output';

export class QueryDeviceSessionRequestRepository {
    static async findByDeviceId(deviceId: string): PromiseNull<IDeviceSessionSchema> {
        try {
            return await DeviceSessionModel.findOne({ deviceId });
        } catch (e) {
            console.log('QueryDeviceSessionRequestRepository [findByDeviceId]', e);
            return null;
        }
    }
}
