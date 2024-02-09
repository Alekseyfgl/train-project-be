import { IRecoveryPassword, IRecoveryPasswordSchema } from '../types/recovery-password/output';

export const recoveryPasswordMapper = (data: IRecoveryPasswordSchema): IRecoveryPassword => {
    return {
        id: data._id.toString(),
        userId: data.userId.toString(),
        code: data.code,
    };
};
