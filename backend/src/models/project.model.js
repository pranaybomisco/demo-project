import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { DB_TABLES, MODEL_NAMES, DB_FIELDS } from '../constants/index.js';

export const Project = sequelize.define(
  MODEL_NAMES.PROJECT,
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: DB_FIELDS.OWNER_ID,
    },
  },
  {
    tableName: DB_TABLES.PROJECTS,
    underscored: true,
    timestamps: true,
  }
);
