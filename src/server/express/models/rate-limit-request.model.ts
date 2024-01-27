import mongoose, { Schema } from 'mongoose';
import { IRateLimitRequestSchema } from '../types/rate-limit-request/output';

const RateLimitRequestSchema: Schema = new Schema(
    {
        ip: { type: String, required: true, index: true },
        url: { type: String, required: true },
        date: { type: Date, default: Date.now, expires: '15s' },
    },
    {},
);

export const RateLimitRequestModel = mongoose.model<IRateLimitRequestSchema>('Rate_limit_request', RateLimitRequestSchema);
