import { body } from 'express-validator';
import { inputModelValidator } from './input-model-validation/input-model.validator';

const loginField = body('login').isString().trim().isLength({ min: 1, max: 10 }).matches('^[a-zA-Z0-9_-]*$').withMessage('Incorrect login');
const emailField = body('email').isString().trim().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Incorrect email');
const passwordField = body('password').isString().trim().isLength({ min: 6, max: 20 }).withMessage('Incorrect password');

export const createUserLikeAdminValidation = () => [loginField, emailField, passwordField, inputModelValidator];
