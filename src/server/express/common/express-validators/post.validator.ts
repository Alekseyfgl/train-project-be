import { body } from 'express-validator';
import { BlogRepository } from '../../repositories/blog.repository';
import { IBlog } from '../../types/blog/output';
import { Nullable } from '../interfaces/optional.types';

const blogIdValidator = body('blogId')
    .isString()
    .trim()
    .custom((value) => {
        const blog: Nullable<IBlog> = BlogRepository.findBlockById(value);

        if (!blog) {
            // return false
            throw new Error('Incorrect blogId');
        }

        return true;
    })
    .withMessage('Incorrect blogId');
