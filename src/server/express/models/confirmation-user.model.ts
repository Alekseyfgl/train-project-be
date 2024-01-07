import mongoose, { Schema, Types } from 'mongoose';
import { ConfirmationUserSchema } from '../types/user/output';

const ConfirmationUserSchema: Schema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    isConfirmed: { type: Boolean, required: true },
});

export const ConfirmationUserModel = mongoose.model<ConfirmationUserSchema>('Confirmation_user', ConfirmationUserSchema);
