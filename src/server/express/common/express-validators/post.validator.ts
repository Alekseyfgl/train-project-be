import { body, param } from 'express-validator';
import { IBlogModel } from '../../types/blog/output';
import { Nullable } from '../interfaces/optional.types';
import { inputModelValidator } from './input-model-validation/input-model.validator';
import { QueryBlogRepository } from '../../repositories/blog/query-blog.repository';

const blogIdValidator = body('blogId')
    .isString()
    .trim()
    .custom(async (value) => {
        const blog: Nullable<IBlogModel> = await QueryBlogRepository.findById(value);

        if (!blog) {
            // return false
            return Promise.reject('Некорректный blogId');
        }

        return true;
    })
    .withMessage('Incorrect blogId');

const blogIdParamValidator = param('id')
    .isString()
    .trim()
    .custom(async (value) => {
        const blog: Nullable<IBlogModel> = await QueryBlogRepository.findById(value);

        if (!blog) {
            return Promise.reject('Incorrect id');
        }

        return true;
    })
    .withMessage('Incorrect id');

// const idValidator = body('id').isString().trim();
const titleValidator = body('title').isString().trim().isLength({ min: 1, max: 30 });
const shortDescriptionValidator = body('shortDescription').isString().trim().isLength({ min: 1, max: 100 });
const contentValidator = body('content').isString().trim().isLength({ min: 1, max: 1000 });

export const postValidation = () => [blogIdValidator, titleValidator, shortDescriptionValidator, contentValidator, inputModelValidator];
export const addPostToBlogValidation = () => [blogIdParamValidator, titleValidator, shortDescriptionValidator, contentValidator, inputModelValidator];
