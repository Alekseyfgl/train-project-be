import mongoose, { Schema, Types } from 'mongoose';
import { IPostModel } from '../types/post/output';

const PostSchema: Schema = new Schema(
    {
        blogId: { type: Types.ObjectId, ref: 'Blog', required: true }, //ref на Blog
        title: { type: String, required: true },
        shortDescription: { type: String, required: true },
        content: { type: String, required: true },
        blogName: { type: String, required: false, default: 'string' },
        createdAt: { type: Date, default: Date.now }, // добавлено поле createdAt
    },
    {},
);

//изменили _id на одекватный id
PostSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    },
});

export const PostModel = mongoose.model<IPostModel>('Post', PostSchema);
