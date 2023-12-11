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
        // const blog: Nullable<IBlogModel> = await QueryBlogRepository.findById(value);
        //
        // if (!blog) {
        //     return Promise.reject('Incorrect id');
        // }

        return true;
    })
    .withMessage('Incorrect id');

// const idValidator = body('id').isString().trim();
const titleValidator = body('title').isString().trim().isLength({ min: 1, max: 30 });
const shortDescriptionValidator = body('shortDescription').isString().trim().isLength({ min: 1, max: 100 });
const contentValidator = body('content').isString().trim().isLength({ min: 1, max: 1000 });

export const postValidation = () => [blogIdValidator, titleValidator, shortDescriptionValidator, contentValidator, inputModelValidator];
export const addPostToBlogValidation = () => [blogIdParamValidator, titleValidator, shortDescriptionValidator, contentValidator, inputModelValidator];

const res = [
    {
        blogId: '65769abb1437b9d967751adc',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:36.054Z',
        id: '65769abc1437b9d967751adf',
    },
    {
        blogId: '65769ab91437b9d967751ac4',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:33.536Z',
        id: '65769ab91437b9d967751ac7',
    },
    {
        blogId: '65769ab71437b9d967751ab2',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:31.719Z',
        id: '65769ab71437b9d967751ab5',
    },
    {
        blogId: '65769abb1437b9d967751ad6',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:35.399Z',
        id: '65769abb1437b9d967751ad9',
    },
    {
        blogId: '65769ab91437b9d967751aca',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:34.151Z',
        id: '65769aba1437b9d967751acd',
    },
    {
        blogId: '65769ab81437b9d967751abe',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:32.917Z',
        id: '65769ab81437b9d967751ac1',
    },
    {
        blogId: '65769ab61437b9d967751aac',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:30.925Z',
        id: '65769ab61437b9d967751aaf',
    },
    {
        blogId: '65769ab81437b9d967751ab8',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:32.321Z',
        id: '65769ab81437b9d967751abb',
    },
    {
        blogId: '65769aba1437b9d967751ad0',
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogName: 'string',
        createdAt: '2023-12-11T05:14:34.760Z',
        id: '65769aba1437b9d967751ad3',
    },
];
