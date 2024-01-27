import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { CommentSchema, IComment, ICommentModel, ICommentPaginationOut, ICommentWithAuthorDB } from '../../types/comment/output';
import { CommentModel } from '../../models/comment.model';
import { QueryUserRepository } from '../user/query-user.repository';
import { IUser } from '../../types/user/output';
import { clearCommentMapper, commentMapper, getAllCommentByIdPagination } from '../../mappers/comment.mapper';
import { CommentsByPostQuery } from '../../types/comment/input';
import { countTotalPages } from '../../common/utils/count-total-pages/count-total-pages';
import { Types } from 'mongoose';
import { offsetPagination } from '../../common/utils/offset-for-pagination/offset-for-pagination';

export class QueryCommentRepository {
    static async findById(commentId: string): PromiseNull<ICommentModel> {
        try {
            const comment: Nullable<CommentSchema> = await CommentModel.findById(commentId);
            if (!comment) return null;
            return clearCommentMapper(comment);
        } catch (e) {
            console.log('[findById]', e);
            return null;
        }
    }

    static async getCommentByIdWithAuthor(commentId: string): PromiseNull<IComment> {
        const comment: Nullable<ICommentModel> = await this.findById(commentId);
        if (!comment) return null;
        const author: Nullable<IUser> = await QueryUserRepository.findById(comment.userId);
        if (!author) return null;
        return commentMapper(comment, author);
    }

    static async getAllCommentsByPostId(postId: string, query: CommentsByPostQuery): PromiseNull<ICommentPaginationOut> {
        const { pageSize, pageNumber, sortDirection, sortBy } = query;
        const direction = sortDirection === 'desc' ? -1 : 1;

        try {
            const comments: ICommentWithAuthorDB[] = await CommentModel.aggregate([
                { $match: { postId: new Types.ObjectId(postId) } }, // Фильтруем комментарии по postId
                {
                    $lookup: {
                        from: 'users', // Название коллекции пользователей
                        localField: 'userId', // Поле в коллекции комментариев
                        foreignField: '_id', // Поле в коллекции пользователей
                        as: 'user', // Название нового поля, содержащего найденных пользователей
                    },
                },
                { $addFields: { user: { $first: '$user' } } }, // Преобразуем массив user в объект
                {
                    $match: {
                        'user._id': { $exists: true }, // Исключаем комментарии, где пользователь не найден
                    },
                },
                { $sort: { [sortBy]: direction } }, // Сортируем результаты
                { $skip: offsetPagination(pageNumber, pageSize) }, // Пропускаем комментарии для пагинации
                { $limit: pageSize }, // Ограничиваем количество комментариев
            ]);

            if (comments.length === 0) return null;

            const totalCount: number = await CommentModel.countDocuments({ postId: postId });
            const pagesCount: number = countTotalPages(totalCount, pageSize);

            return getAllCommentByIdPagination({ pageNumber, pageSize, items: comments, pagesCount, totalCount });
        } catch (e) {
            console.log('[getAllCommentsByPostId]', e);
            return null;
        }
    }
}
