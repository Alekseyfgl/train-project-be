import { Types } from 'mongoose';

export interface ITokenBlacklistSchema extends Document {
    _id: Types.ObjectId;
    token: string;
}
