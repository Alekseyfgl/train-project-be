import { IDeviceSession, IDeviceSessionModel, IDeviceSessionSchema } from '../types/device-session/output';

export const deviceSessionsMapper = (data: IDeviceSessionSchema[]): IDeviceSession[] => {
    return data.map((device) => {
        return {
            deviceId: device.deviceId,
            ip: device.ip,
            lastActiveDate: device.creatAt.toISOString(),
            title: device.loc,
        };
    });
};

export const deviceSessionMapper = (data: IDeviceSessionSchema): IDeviceSessionModel => {
    return {
        id: data._id.toString(),
        deviceId: data.deviceId,
        ip: data.ip,
        creatAt: data.creatAt,
        os: data.os,
        loc: data.loc,
        userId: data.userId.toString(),
    };
};
