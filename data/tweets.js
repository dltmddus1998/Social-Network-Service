import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './users.js';
import { HashTag } from './hashTags.js';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

export const Tweet = sequelize.define('tweet', {
    tweetId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(1024),
        allowNull: false,
    },
    contents: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    agrees: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    deleted: {  // 삭제 여부 -> false: 존재, true: 삭제
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
});
User.hasMany(Tweet, {foreignKey: 'userId'});
Tweet.belongsTo(User, {foreignKey: 'userId'});
Tweet.belongsToMany(HashTag, {as: 'hashtags', through: 'tweets_hashtags', foreignKey: 'tweetId'});
HashTag.belongsToMany(Tweet, {as: 'tweets', through: 'tweets_hashtags', foreignKey: 'hashTagId'});