import { body } from 'express-validator';
import { BlogRepository } from '../../repositories/blog.repository';
import { IBlog } from '../../types/blog/output';
import { Nullable } from '../interfaces/optional.types';
import { inputModelValidator } from './input-model-validation/input-model.validator';

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

const idValidator = body('id').isString().trim();
const titleValidator = body('title').isString().trim().isLength({ min: 1, max: 30 });
const shortDescriptionValidator = body('shortDescription').isString().trim().isLength({ min: 1, max: 100 });
const contentValidator = body('content').isString().trim().isLength({ min: 1, max: 1000 });

export const postValidation = () => [blogIdValidator, idValidator, titleValidator, shortDescriptionValidator, contentValidator, inputModelValidator];
