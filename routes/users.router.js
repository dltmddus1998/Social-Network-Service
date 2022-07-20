import express from 'express';
// import {} from 'express-async-errors';
import { body } from 'express-validator';

const router = express.Router();

router.post('/signup');
router.post('/signin');

export default router;