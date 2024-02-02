import { Types } from 'mongoose';

export interface IDeviceSessionSchema extends Document {
    _id: Types.ObjectId;
    deviceId: string;
    ip: string;
    creatAt: Date;
    os: string;
    loc: string;
    userId: string;
}

export interface IDeviceSession {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string;
}
