import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {} from 'express-async-errors';
import * as userRepository from '../data/users.js';
import { config } from '../config.js';

export async function signup(req, res) {
    /**
     * 기능: 회원가입
     */
    const { userId, password, userName, nickName } = req.body;
    const found = await userRepository.findByUserId(userId);
    if (found) {
        return res.status(409).json({ message: `${userId} 는 이미 있는 아이디입니다!` });
    }
    const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
    const id = await userRepository.createUser({
        userId,
        password: hashed,
        userName,
        nickName,
    });
    createJwtToken(id);
    return res.status(201).json({ message: '회원가입이 완료됐습니다!' });
}

export async function signin(req, res) {
    /**
     * 기능: 로그인
     */
    const { userId, password } = req.body;
    const user = await userRepository.findByUserId(userId);
    if (!user) { // 보안을 위해 아이디, 비밀번호 중 무엇이 잘못됐는지 모호하게 알려줌
        return res.status(401).json({ message: '잘못된 아이디나 비밀번호를 입력하셨습니다!' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword) {  
        return res.status(401).json({ message: '잘못된 아이디나 비밀번호를 입력하셨습니다!' });
    }
    const token = createJwtToken(user.id);
    return res.status(200).json({ 
        message: `${userId} 님의 로그인이 완료됐습니다!`,
        token
    });
}

function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, {
        expiresIn: config.jwt.expiresInSec,
    });
}

export async function me(req, res) {
    const user = await userRepository.findById(req.id);
    if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    const { userId, userName, nickName } = user.dataValues;
    return res.status(200).json({
        userId,
        userName,
        nickName,
    });
}