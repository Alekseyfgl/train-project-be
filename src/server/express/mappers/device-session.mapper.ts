import { IDeviceSession, IDeviceSessionSchema } from '../types/device-session/output';

export const deviceSessionMapper = (data: IDeviceSessionSchema[]): IDeviceSession[] => {
    return data.map((device) => {
        return {
            deviceId: device.deviceId,
            ip: device.ip,
            lastActiveDate: device.creatAt.toISOString(),
            title: device.loc,
        };
    });
};
