import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import usersRouter from './routes/users.router.js';
import tweetsRouter from './routes/tweets.router.js';
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

const port = 3000 || process.env.PORT;

app.listen(port, () => {
    console.log(`SERVER listening on port ${port}`);
})
