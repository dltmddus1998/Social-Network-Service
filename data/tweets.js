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

const INCLUDE_USER = {
    attributes: [
        'tweetId',
        'title',
        'contents',
        'views',
        'agrees',
        'deleted',
        'createdAt',
        'updatedAt',
        'userId',
        [Sequelize.col('user.userName'), 'userName'],
    ],
    include: {
        model: User,
        attributes: [],
    },
};

const ORDER_DESC = {
    order: [['createdAt', 'DESC']],
}

export async function getAllByUserId(userId) {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...ORDER_DESC,
        include: {
            ...INCLUDE_USER.include,
            where: { userId },
        },
    });
}

export async function getAll() {
    return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}

export async function getById(id) {
    return Tweet.findOne({
        where: { tweetId: id },
        ...INCLUDE_USER,
    })
}

export async function create(title, contents, id) {
    return Tweet.create({
        title,
        contents,
        userId: id
    }).then(data => getById(data.dataValues.tweetId));
}

export async function update(tweetId, title, contents) {
    return Tweet.findByPk(tweetId, INCLUDE_USER)
        .then(tweet => {
            tweet.title = title;
            tweet.contents = contents;
            return tweet.save();
        });
}

export async function remove(tweetId) {
    return Tweet.findByPk(tweetId)
        .then(tweet => {
            tweet.deleted = true;
            return tweet.save();
        });
}

export async function revoke(tweetId) {
    return Tweet.findByPk(tweetId)
        .then(tweet => {
            tweet.deleted = false;
            return tweet.save();
        });
}