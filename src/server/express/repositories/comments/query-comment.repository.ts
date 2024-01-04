import { Nullable, PromiseNull } from '../../common/interfaces/optional.types';
import { CommentSchema, IComment, ICommentModel, ICommentWithAuthorDB } from '../../types/comment/output';
import { CommentModel } from '../../models/comment.model';
import { QueryUserRepository } from '../user/query-user.repository';
import { IUser } from '../../types/user/output';
import { clearCommentMapper, commentMapper, getAllCommentByIdPagination } from '../../mappers/comment.mapper';
import { CommentsByPostQuery } from '../../types/comment/input';
import { PostModel } from '../../models/post.model';
import { countTotalPages } from '../../common/utils/count-total-pages/count-total-pages';
import { Types } from 'mongoose';
import { offsetPagination } from '../../common/utils/offset-for-pagination/offset-for-pagination';
import { ObjectId } from 'mongodb';

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

    static async getAllCommentsByPostId(postId: string, query: CommentsByPostQuery) {
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

            const totalCount: number = await PostModel.countDocuments({ postId: new Types.ObjectId(postId) });
            const pagesCount: number = countTotalPages(totalCount, pageSize);

            return getAllCommentByIdPagination({ pageNumber, pageSize, items: comments, pagesCount, totalCount });
        } catch (e) {
            console.log('[getAllCommentsByPostId]', e);
            return getAllCommentByIdPagination({
                items: [],
                totalCount: 0,
                pageNumber: 1,
                pagesCount: 1,
                pageSize: 10,
            });
        }
    }
}

const x = [
    {
        _id: new ObjectId('6595907a8db8ea4ca7601548'),
        postId: new ObjectId('659590478db8ea4ca760153f'),
        userId: new ObjectId('659590038db8ea4ca7601537'),
        content: 'stringstringstringst',
        createdAt: '',
        __v: 0,
        user: {
            _id: new ObjectId('659590038db8ea4ca7601537'),
            login: 'qweeee1',
            email: 'qwe1@gmail.com',
            password: '$2b$10$F8ldbtPBNC.KNxvynSwhe.z5nRybZ6wbtM.mOMDrJxwZBJbzCmsjy',
            createdAt: '',
            __v: 0,
        },
    },
];
