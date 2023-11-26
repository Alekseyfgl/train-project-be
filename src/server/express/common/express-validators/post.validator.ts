import { body } from 'express-validator';
import { BlogRepository } from '../../repositories/blog.repository';
import { IBlogModel } from '../../types/blog/output';
import { Nullable } from '../interfaces/optional.types';
import { inputModelValidator } from './input-model-validation/input-model.validator';

const blogIdValidator = body('blogId')
    .isString()
    .trim()
    .custom(async (value) => {
        const blog: Nullable<IBlogModel> = await BlogRepository.findById(value);

        if (!blog) {
            // return false
            // throw new Error('Incorrect blogId');
            return Promise.reject(new Error('Некорректный blogId'));
        }

        return true;
    })
    .withMessage('Incorrect blogId');

// const idValidator = body('id').isString().trim();
const titleValidator = body('title').isString().trim().isLength({ min: 1, max: 30 });
const shortDescriptionValidator = body('shortDescription').isString().trim().isLength({ min: 1, max: 100 });
const contentValidator = body('content').isString().trim().isLength({ min: 1, max: 1000 });

export const postValidation = () => [blogIdValidator, titleValidator, shortDescriptionValidator, contentValidator, inputModelValidator];
