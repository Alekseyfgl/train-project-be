import { Types } from 'mongoose';

export interface IRateLimitRequestSchema extends Document {
    _id: Types.ObjectId;
    ip: string;
    url: string;
    date: Date;
}
