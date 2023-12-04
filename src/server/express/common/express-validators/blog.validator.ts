import { body } from 'express-validator';
import { inputModelValidator } from './input-model-validation/input-model.validator';
import mongoose from 'mongoose';
import { Nullable } from '../interfaces/optional.types';
import { IBlogModel } from '../../types/blog/output';
import { ReadBlogRepository } from '../../repositories/blog/read-blog.repository';

const nameValidator = body('name').isString().trim().isLength({ min: 1, max: 15 }).withMessage('Incorrect name!');
const descriptionValidator = body('description').isString().trim().isLength({ min: 1, max: 500 }).withMessage('Incorrect description!');
const websiteUrlValidator = body('websiteUrl').isString().trim().isLength({ min: 1, max: 100 }).matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$').withMessage('Incorrect websiteUrl!');
const idValidator = body('_id')
    .custom(async (value) => {
        const isValid: boolean = mongoose.Types.ObjectId.isValid(value);
        if (!isValid) return Promise.reject(new Error('Incorrect _id'));

        const blog: Nullable<IBlogModel> = await ReadBlogRepository.findById(value);
        if (!blog) return Promise.reject(new Error('Incorrect _id'));
    })
    .withMessage('Invalid MongoDB _id!');
export const blogValidation = () => [nameValidator, descriptionValidator, websiteUrlValidator, inputModelValidator];
export const updateBlogValidation = () => [idValidator, nameValidator, descriptionValidator, websiteUrlValidator, inputModelValidator];
