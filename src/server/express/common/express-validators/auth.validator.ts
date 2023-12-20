import { body } from 'express-validator';
import { inputModelValidator } from './input-model-validation/input-model.validator';

const loginOrEmailField = body('loginOrEmail').isString().trim().withMessage('Incorrect data');
const passwordField = body('password').isString().trim().withMessage('Incorrect data');

export const loginValidation = () => [loginOrEmailField, passwordField, inputModelValidator];
