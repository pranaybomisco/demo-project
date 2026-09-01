import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { DB_TABLES, ROLES, MODEL_NAMES, DB_FIELDS } from '../constants/index.js';

export const User = sequelize.define(
  MODEL_NAMES.USER,
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: DB_FIELDS.PASSWORD_HASH,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ROLES.MEMBER,
    },
    avatarUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: DB_FIELDS.AVATAR_URL,
    },
  },
  {
    tableName: DB_TABLES.USERS,
    underscored: true,
    timestamps: true,
  }
);
