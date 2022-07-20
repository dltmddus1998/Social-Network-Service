import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import usersRouter from './routes/users.router.js';
import tweetsRouter from './routes/tweets.router.js';
import { sequelize } from './db/database.js';
import { config } from './config.js';
import { User } from './data/users.js';
import { Tweet } from './data/tweets.js';
import { HashTag } from './data/hashTags.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

app.use('/users', usersRouter);
app.use('/tweets', tweetsRouter);


app.use((req, res, next) => {
    res.sendStatus(404);
});

app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});

sequelize.sync().then((client) => {
    app.listen(config.host.port, () => {
        console.log("서버 연결 완료!!")
    });
});