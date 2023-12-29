import { body, param } from 'express-validator';
import { inputModelValidator } from './input-model-validation/input-model.validator';

const blogIdParam = param('id').isString().trim().withMessage('Incorrect blogId');
const contentField = body('content').isString().trim().isLength({ min: 20, max: 300 }).withMessage('Incorrect content');

export const commentToPostValidation = () => [blogIdParam, contentField, inputModelValidator];
