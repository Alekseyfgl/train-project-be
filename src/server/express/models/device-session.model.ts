import mongoose, { Schema, Types } from 'mongoose';
import { IDeviceSessionSchema } from '../types/device-session/output';

const DeviceSessionSchema: Schema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        deviceId: { type: String, required: true },
        ip: { type: String, required: true },
        creatAt: { type: Date, required: true },
        os: { type: String, required: true },
        loc: { type: String, required: true },
    },
    {},
);

export const DeviceSessionModel = mongoose.model<IDeviceSessionSchema>('Device_session', DeviceSessionSchema);
