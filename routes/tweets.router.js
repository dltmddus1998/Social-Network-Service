import express from 'express';
// import {} from 'express-async-errors';
import { body } from 'express-validator';
import { isAuth } from '../middleware/users.js';
import * as tweetController from '../controllers/tweets.controller.js'

const router = express.Router();

router.post('/create', isAuth, tweetController.createTweet);
router.get('/:tweetNum', isAuth, tweetController.getTweet);
router.get('/', isAuth, tweetController.getTweets);
router.patch('/update/:tweetNum', isAuth, tweetController.updateTweet);
router.patch('/delete/:tweetNum', isAuth, tweetController.deleteTweet);
router.patch('/revoke/:tweetNum', isAuth, tweetController.revokeTweet);

export default router;
