import SQ, { Op } from 'sequelize';
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

const LIST_EXIST = {
    where: { deleted: false },
}

const ORDER_DESC = {
    order: [['createdAt', 'DESC']],
}

const ORDER_DESC_VIEWS = {
    order: [['views', 'DESC']],
}

const ORDER_DESC_AGREES = {
    order: [['agrees', 'DESC']],
}

const ORDER_ASC = {
    order: [['createdAt', 'ASC']],
}

const ORDER_ASC_VIEWS = {
    order: [['views', 'ASC']],
}

const ORDER_ASC_AGREES = {
    order: [['agrees', 'ASC']],
}

const LIMIT10 = {
    limit: 10
}

export async function addViews(tweetId) {
    return Tweet.findByPk(tweetId, INCLUDE_USER)
        .then(tweet => {
            tweet.views++;
            return tweet.save();
        });
}

export async function getAllByUserId(userId) {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...ORDER_DESC,
        ...LIMIT10,
        include: {
            ...INCLUDE_USER.include,
            where: { userId },
        },
    });
}

export async function getAllSortedByViewsDESC() {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...ORDER_DESC_VIEWS,
        ...LIST_EXIST,
        ...LIMIT10,
    })
}

export async function getAllSortedByViewsASC() {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...ORDER_ASC_VIEWS,
        ...LIST_EXIST,
        ...LIMIT10,
    })
}

export async function getAllSortedByAgreesDESC() {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...ORDER_DESC_AGREES,
        ...LIST_EXIST,
        ...LIMIT10,
    })
}

export async function getAllSortedByAgreesASC() {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...ORDER_ASC_AGREES,
        ...LIST_EXIST,
        ...LIMIT10,
    });
}

export async function getSearchedTitleDESC(search) {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...LIST_EXIST,
        ...ORDER_DESC,
        where: {
            title: {
                [Op.like]: `%${search}%`,
            },
        },
    });
}

export async function getSearchedTitleASC(search) {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...LIST_EXIST,
        ...ORDER_ASC,
        where: {
            title: {
                [Op.like]: `%${search}%`,
            },
        },
    });
}

export async function getPagination(limit, offset) {
    return Tweet.findAll({
        limit,
        offset,
        ...LIST_EXIST,
    });
}

export async function getAllDESC() {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...ORDER_DESC,
        ...LIST_EXIST,
    });
}

export async function getAllASC() {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...ORDER_ASC,
        ...LIST_EXIST,
    });
}

export async function getAllBySortingByCreatedAtDESC() {
    return Tweet.findAll({ order: [['createdAt', 'DESC']] });
}

export async function getAllBySortingByCreatedAtASC() {
    return Tweet.findAll({ order: [['createdAt', 'ASC']] });
}

export async function getById(id) {
    return Tweet.findOne({
        where: { tweetId: id },
        ...INCLUDE_USER,
    });
}

export async function create(title, contents, hashTag, id) {
    const tweet = await Tweet.create({
        title,
        contents,
        userId: id,
    });
    const result = await Promise.all(
        hashTag.map(tag => {
            return HashTag.findOrCreate({
                where: {
                    hashTags: tag.slice(1).toLowerCase()
                }
            })
        })
    )

    await tweet.addHashtag(result.map(r => r[0]));

    return await Tweet.findByPk(tweet.dataValues.tweetId, INCLUDE_USER);
}

// export async function createHashTags(hashTag) {
//     const tweetId = await Tweet.findOne({
//         where: 
//     })
//     const result = await Promise.all(
//         hashTag.map(tag => {
//             return HashTag.findOrCreate({
//                 where: {
//                     hashTags: tag.slice(1).toLowerCase()
//                 }
//             })
//         }),
//     );
//     return await result.addTweets()
// }

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