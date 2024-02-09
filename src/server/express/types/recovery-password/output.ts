import { Types } from 'mongoose';

export interface IRecoveryPasswordSchema extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    code: string;
}

export interface IRecoveryPassword {
    id: string;
    userId: string;
    code: string;
}
