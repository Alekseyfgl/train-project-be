import mongoose, { Schema } from 'mongoose';
import { UserSchema } from '../types/user/output';

const UserSchema: Schema = new Schema(
    {
        login: { type: String, required: true, unique: true, index: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }, // добавлено поле createdAt
    },
    {},
);

//изменили _id на одекватный id
UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    },
});

export const UserModel = mongoose.model<UserSchema>('User', UserSchema);
