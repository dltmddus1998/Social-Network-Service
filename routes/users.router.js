import express from 'express';
// import {} from 'express-async-errors';
import { body } from 'express-validator';
import * as usersController from '../controllers/users.controller.js';

const router = express.Router();

router.post('/signup', usersController.signup);
router.post('/signin', usersController.signin);

export default router;