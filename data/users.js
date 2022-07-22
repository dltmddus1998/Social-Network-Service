import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
const DataTypes = SQ.DataTypes;

export const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    nickName: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
});

export async function findByUserId(userId) {
    return User.findOne({ where: { userId } });
}

export async function findById(id) {
    return User.findByPk(id);
}

export async function createUser(user) {
    return User.create(user).then(data => data.dataValues.id);
}