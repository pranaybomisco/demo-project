import { sequelize } from '../config/db.js';
import { User } from './user.model.js';
import { Project } from './project.model.js';
import { ProjectMember } from './projectmember.model.js';
import { Task } from './task.model.js';
import { ASSOCIATIONS } from '../constants/index.js';

// User <-> Project Ownership
User.hasMany(Project, { foreignKey: 'ownerId', as: ASSOCIATIONS.OWNED_PROJECTS, onDelete: 'CASCADE' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: ASSOCIATIONS.OWNER });

// Project <-> User (Membership Many-to-Many)
User.belongsToMany(Project, {
  through: ProjectMember,
  foreignKey: 'userId',
  otherKey: 'projectId',
  as: ASSOCIATIONS.MEMBER_PROJECTS,
});
Project.belongsToMany(User, {
  through: ProjectMember,
  foreignKey: 'projectId',
  otherKey: 'userId',
  as: ASSOCIATIONS.MEMBER_USERS,
});

// Project <-> ProjectMember Direct Relations (for eager loading with role)
Project.hasMany(ProjectMember, { foreignKey: 'projectId', as: ASSOCIATIONS.MEMBERS, onDelete: 'CASCADE' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId', as: ASSOCIATIONS.PROJECT });
ProjectMember.belongsTo(User, { foreignKey: 'userId', as: ASSOCIATIONS.USER });

// Project <-> Task
Project.hasMany(Task, { foreignKey: 'projectId', as: ASSOCIATIONS.TASKS, onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: ASSOCIATIONS.PROJECT });

// User <-> Task (Creator)
User.hasMany(Task, { foreignKey: 'creatorId', as: ASSOCIATIONS.CREATED_TASKS, onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'creatorId', as: ASSOCIATIONS.CREATOR });

// User <-> Task (Assignee)
User.hasMany(Task, { foreignKey: 'assigneeId', as: ASSOCIATIONS.ASSIGNED_TASKS, onDelete: 'SET NULL' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: ASSOCIATIONS.ASSIGNEE });

export const initDb = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
};

export {
  sequelize,
  User,
  Project,
  ProjectMember,
  Task,
};
