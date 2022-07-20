import express from 'express';
// import {} from 'express-async-errors';
import { body } from 'express-validator';

const router = express.Router();

router.post('/create');
router.patch('/update:/tweetNum');
router.patch('/delete:/tweetNum');

export default router;
