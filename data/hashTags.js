import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

export const HashTag = sequelize.define('hashtag', {
    hashTagId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    hashTags: {
        type: DataTypes.STRING(128),
        allowNull: true,
    }
});