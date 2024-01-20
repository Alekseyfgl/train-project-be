import mongoose, { Schema } from 'mongoose';
import { ITokenBlacklistSchema } from '../types/token-blacklist/output';

const TokenBlacklistSchema: Schema = new Schema({
    token: { type: String, required: true },
});

export const TokenBlacklistModel = mongoose.model<ITokenBlacklistSchema>('Token_blacklist', TokenBlacklistSchema);
