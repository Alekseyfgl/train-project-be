import mongoose, { Schema } from 'mongoose';
import { IBlogSchema } from '../types/blog/output';

const BlogSchema: Schema = new Schema(
    {
        isMembership: { type: Boolean, required: false, default: false },
        name: { type: String, required: true },
        description: { type: String, required: true },
        websiteUrl: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }, // добавлено поле createdAt
    },
    {},
);

//изменили _id на одекватный id
BlogSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id;
    },
});

// // Обеспечиваем сериализацию виртуальных полей (добавить еще поле id равное _id)
// BlogSchema.set('toJSON', {
//     virtuals: true,
// });

export const BlogModel = mongoose.model<IBlogSchema>('Blog', BlogSchema);
