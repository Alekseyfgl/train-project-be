import mongoose, { Schema, Types } from 'mongoose';
import { IRecoveryPasswordSchema } from '../types/recovery-password/output';

const RecoveryPasswordSchema: Schema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        code: { type: String, default: null },
    },
    {},
);

export const RecoveryPasswordModel = mongoose.model<IRecoveryPasswordSchema>('Recovery_password', RecoveryPasswordSchema);
