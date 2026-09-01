import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { DB_TABLES, ROLES, MODEL_NAMES, DB_FIELDS } from '../constants/index.js';

export const ProjectMember = sequelize.define(
  MODEL_NAMES.PROJECT_MEMBER,
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: DB_FIELDS.PROJECT_ID,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: DB_FIELDS.USER_ID,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ROLES.MEMBER,
    },
  },
  {
    tableName: DB_TABLES.PROJECT_MEMBERS,
    underscored: true,
    timestamps: true,
    createdAt: DB_FIELDS.JOINED_AT,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: [DB_FIELDS.PROJECT_ID, DB_FIELDS.USER_ID],
      },
    ],
  }
);
