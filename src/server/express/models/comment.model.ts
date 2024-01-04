import mongoose, { Schema, Types } from 'mongoose';
import { CommentSchema } from '../types/comment/output';
import { UserModel } from './user.model';

const CommentSchema: Schema = new Schema(
    {
        postId: { type: Types.ObjectId, ref: 'Post', required: true },
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }, // добавлено поле createdAt
    },
    {},
);

CommentSchema.pre('save', async function (next) {
    const comment = this;
    try {
        // Проверяем, существует ли пользователь с userId, связанным с комментарием
        const userExists = await UserModel.findOne({ _id: comment.userId });
        if (!userExists) {
            // Если пользователь не найден, передаем ошибку в next()
            return next(new Error('Не удается добавить комментарий к несуществующему пользователю'));
        }
        // Если пользователь существует, продолжаем сохранение комментария
        next();
    } catch (error: any) {
        next(error);
    }
});

CommentSchema.pre('updateOne', async function (next) {
    const comment = this;
    try {
        // Получаем ID комментария из условия запроса
        const commentId = comment.getQuery()._id;
        // Находим комментарий и проверяем, существует ли связанный пользователь
        const existingComment = await CommentModel.findById(commentId).populate('userId');
        if (!existingComment) {
            return next(new Error('Комментарий не найден'));
        }
        if (!existingComment.userId) {
            // Если пользователь не найден, передаем ошибку в next()
            return next(new Error('Не удается удалить комментарий для несуществующего пользователя'));
        }
        // Если пользователь существует, продолжаем удаление комментария
        next();
    } catch (error: any) {
        next(error);
    }
});

CommentSchema.pre('deleteOne', async function (next) {
    const comment = this;
    try {
        // Получаем ID комментария из условия запроса
        const commentId = comment.getQuery()._id;
        // Находим комментарий и проверяем, существует ли связанный пользователь
        const existingComment = await CommentModel.findById(commentId).populate('userId');
        if (!existingComment) {
            return next(new Error('Комментарий не найден'));
        }
        if (!existingComment.userId) {
            // Если пользователь не найден, передаем ошибку в next()
            return next(new Error('Не удается удалить комментарий для несуществующего пользователя'));
        }
        // Если пользователь существует, продолжаем удаление комментария
        next();
    } catch (error: any) {
        next(error);
    }
});

export const CommentModel = mongoose.model<CommentSchema>('Comment', CommentSchema);
