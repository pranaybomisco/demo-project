import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { DB_TABLES, TASK_STATUS, TASK_PRIORITY, MODEL_NAMES, DB_FIELDS } from '../constants/index.js';

export const Task = sequelize.define(
  MODEL_NAMES.TASK,
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: TASK_STATUS.TODO,
    },
    priority: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: TASK_PRIORITY.MEDIUM,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: DB_FIELDS.DUE_DATE,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: DB_FIELDS.PROJECT_ID,
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: DB_FIELDS.CREATOR_ID,
    },
    assigneeId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: DB_FIELDS.ASSIGNEE_ID,
    },
  },
  {
    tableName: DB_TABLES.TASKS,
    underscored: true,
    timestamps: true,
    indexes: [
      {
        fields: [DB_FIELDS.PROJECT_ID, DB_FIELDS.STATUS],
      },
      {
        fields: [DB_FIELDS.ASSIGNEE_ID],
      },
    ],
  }
);
