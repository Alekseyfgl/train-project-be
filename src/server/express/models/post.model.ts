import mongoose, { Schema, Types } from 'mongoose';
import { PostSchema } from '../types/post/output';
import { CommentModel } from './comment.model';

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

PostSchema.post('findOneAndDelete', async function (doc: PostSchema) {
    if (doc) {
        // console.log(doc);
        await CommentModel.deleteMany({ postId: doc._id.toString() });
    }
});
export const PostModel = mongoose.model<PostSchema>('Post', PostSchema);
