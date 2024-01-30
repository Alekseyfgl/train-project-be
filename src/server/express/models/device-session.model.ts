import mongoose, { Schema } from 'mongoose';
import { IDeviceSessionSchema } from '../types/device-session/output';

const DeviceSessionSchema: Schema = new Schema(
    {
        deviceId: { type: String, required: true },
        ip: { type: String, required: true },
        creatAt: { type: Date, required: true },
        // expAt: { type: Date, required: true },
        os: { type: String, required: true },
        loc: { type: String, required: true },
        userId: { type: String, required: true },
    },
    {},
);

export const DeviceSessionModel = mongoose.model<IDeviceSessionSchema>('Device_session', DeviceSessionSchema);
