import { body } from 'express-validator';
import { inputModelValidator } from './input-model-validation/input-model.validator';

//fields for login
const loginOrEmailField = body('loginOrEmail').isString().trim().withMessage('Incorrect data');
const passwordField = body('password').isString().trim().withMessage('Incorrect data');

//fields for registration
const loginField = body('login').isString().trim().isLength({ min: 3, max: 10 }).matches('^[a-zA-Z0-9_-]*$').withMessage('Incorrect login');
const emailField = body('email').isString().trim().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Incorrect email');
const passwordForRegField = body('password').isString().trim().isLength({ min: 6, max: 20 }).withMessage('Incorrect password');

//===============
export const loginValidation = () => [loginOrEmailField, passwordField, inputModelValidator];
export const registrationValidation = () => [loginField, emailField, passwordForRegField, inputModelValidator];
