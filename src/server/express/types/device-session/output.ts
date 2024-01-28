import { Types } from 'mongoose';

export interface IDeviceSessionSchema extends Document {
    _id: Types.ObjectId;
    deviceId: string;
    ip: string;
    creatAt: Date;
    expAt: Date;
    os: string;
    loc: string;
}
