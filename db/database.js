import mysql from 'mysql2';
import { config } from '../config.js';
import SQ from 'sequelize';

/**
 * Sequelize 연동하기
 */
const { host, user, database, password } = config.db;
export const sequelize = new SQ.Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
    logging: false,
});