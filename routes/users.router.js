import express from 'express';
import {} from 'express-async-errors';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import { isAuth } from '../middleware/users.js';
import * as usersController from '../controllers/users.controller.js';

const router = express.Router();

const validateCredentail = [
    body('userId')
        .isEmail()
        .normalizeEmail()
        .withMessage('잘못된 이메일 형식입니다.'),
    body('password')
        .trim()
        .isLength({ min: 9 })
        .withMessage('패스워드는 9글자 이상이어야 합니다.'),
    validate,
];

const validateSignup = [
    ...validateCredentail,
    body('userName')
        .notEmpty()
        .withMessage('유저명이 생략되었습니다.'),
    body('nickName')
        .notEmpty()
        .withMessage('닉네임이 생략되었습니다.'),
    validate,
];

router.post('/signup', validateSignup, usersController.signup);
router.post('/signin', validateCredentail, usersController.signin);
router.get('/me', isAuth, usersController.me);

export default router;