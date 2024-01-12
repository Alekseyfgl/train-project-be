import { body } from 'express-validator';
import { inputModelValidator } from './input-model-validation/input-model.validator';
import { RegistrationUserDto } from '../../types/auth/input';
import { QueryUserRepository } from '../../repositories/user/query-user.repository';

//fields for login
const loginOrEmailField = body('loginOrEmail').isString().trim().withMessage('Incorrect data');
const passwordField = body('password').isString().trim().withMessage('Incorrect data');

// //fields for registration
const loginForRegisterField = body('login').isString().trim().isLength({ min: 3, max: 10 }).matches('^[a-zA-Z0-9_-]*$');
const emailForRegisterField = body('email').isString().trim().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
const isExistEmailOrLogin = [
    body().custom(async (dto: RegistrationUserDto) => {
        const login = dto.login.trim();
        const email = dto.email.trim();

        const isEmailExist: boolean = !!(await QueryUserRepository.findByLoginOrEmail(email));
        const isLoginExist: boolean = !!(await QueryUserRepository.findByLoginOrEmail(login));
        if (isEmailExist) {
            return Promise.reject({
                message: 'Email is already exist',
                field: 'email',
            });
        }
        if (isLoginExist) {
            return Promise.reject({
                message: 'Login is already exist',
                field: 'login',
            });
        }
        return true;
    }),
];

const passwordForRegField = body('password').isString().trim().isLength({ min: 6, max: 20 }).withMessage('Incorrect password');
//===============
export const loginValidation = () => [loginOrEmailField, passwordField, inputModelValidator];
export const registrationValidation = () => [loginForRegisterField, emailForRegisterField, passwordForRegField, isExistEmailOrLogin, inputModelValidator];
