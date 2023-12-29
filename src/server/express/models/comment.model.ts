import mongoose, { Schema, Types } from 'mongoose';
import { CommentSchema } from '../types/comment/output';

const CommentSchema: Schema = new Schema(
    {
        postId: { type: Types.ObjectId, ref: 'Post', required: true },
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }, // добавлено поле createdAt
    },
    {},
);

//изменили _id на одекватный id
CommentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret._id;
    },
});

export const CommentModel = mongoose.model<CommentSchema>('Comment', CommentSchema);
