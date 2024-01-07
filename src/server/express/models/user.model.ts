import mongoose, { Schema } from 'mongoose';
import { UserSchema } from '../types/user/output';
import { ConfirmationUserModel } from './confirmation-user.model';
import { CommentModel } from './comment.model';

const UserSchema: Schema = new Schema(
    {
        login: { type: String, required: true, unique: true, index: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }, // добавлено поле createdAt
    },
    {},
);

//remove cascading after remove user, we remove all comments by user and confirmation data
UserSchema.post('findOneAndDelete', async function (doc: UserSchema) {
    if (doc) {
        // console.log(doc);
        await ConfirmationUserModel.deleteMany({ userId: doc._id.toString() });
        await CommentModel.deleteMany({ postId: doc._id.toString() });
    }
});

// //изменили _id на одекватный id
// UserSchema.set('toJSON', {
//     virtuals: true,
//     versionKey: false,
//     transform: (doc, ret) => {
//         delete ret._id;
//     },
// });

export const UserModel = mongoose.model<UserSchema>('User', UserSchema);
