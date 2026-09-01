import { Op, Sequelize } from 'sequelize';
import { Task, Project, User, ProjectMember } from '../models/index.js';
import { NotFoundError, AuthorizationError, ValidationError } from '../errors/apperror.js';
import {
  ERROR_MESSAGES,
  ROLES,
  APP_DEFAULTS,
  TASK_STATUS,
  TASK_PRIORITY,
  ASSOCIATIONS,
  SORT_ORDERS,
  DB_FIELDS,
} from '../constants/index.js';

export class TaskService {
  static async listTasks(userId, userRole, { page = APP_DEFAULTS.PAGE, limit = APP_DEFAULTS.LIMIT_TASKS, projectId, status, priority, assigneeId, search, sortBy = DB_FIELDS.CREATED_AT, sortOrder = SORT_ORDERS.DESC }) {
    const pageNum = parseInt(page, APP_DEFAULTS.RADIX_10);
    const limitNum = parseInt(limit, APP_DEFAULTS.RADIX_10);
    const offset = (pageNum - 1) * limitNum;

    const whereConditions = [];

    if (projectId) {
      whereConditions.push({ projectId });
    }

    if (status) {
      const statusArr = Array.isArray(status) ? status : status.split(',').map((s) => s.trim()).filter(Boolean);
      if (statusArr.length === 1) {
        whereConditions.push({ status: statusArr[0] });
      } else if (statusArr.length > 1) {
        whereConditions.push({ status: { [Op.in]: statusArr } });
      }
    }

    if (priority) {
      const priorityArr = Array.isArray(priority) ? priority : priority.split(',').map((p) => p.trim()).filter(Boolean);
      if (priorityArr.length === 1) {
        whereConditions.push({ priority: priorityArr[0] });
      } else if (priorityArr.length > 1) {
        whereConditions.push({ priority: { [Op.in]: priorityArr } });
      }
    }

    if (assigneeId) {
      whereConditions.push({ assigneeId });
    }

    if (search) {
      whereConditions.push({
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ],
      });
    }

    const projectInclude = {
      model: Project,
      as: ASSOCIATIONS.PROJECT,
      attributes: ['id', 'name'],
    };

    if (userRole !== ROLES.ADMIN) {
      const userProjects = await Project.findAll({
        attributes: ['id'],
        where: {
          [Op.or]: [
            { ownerId: userId },
            Sequelize.literal(`EXISTS (SELECT 1 FROM project_members AS pm WHERE pm.project_id = "Project"."id" AND pm.user_id = '${userId}')`),
          ],
        },
      });
      const accessibleProjectIds = userProjects.map((p) => p.id);
      whereConditions.push({
        projectId: { [Op.in]: accessibleProjectIds },
      });
    }

    const whereClause = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};

    const { count: total, rows: tasks } = await Task.findAndCountAll({
      where: whereClause,
      include: [
        projectInclude,
        {
          model: User,
          as: ASSOCIATIONS.CREATOR,
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
        {
          model: User,
          as: ASSOCIATIONS.ASSIGNEE,
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase() === SORT_ORDERS.ASC ? SORT_ORDERS.ASC : SORT_ORDERS.DESC]],
      limit: limitNum,
      offset,
      distinct: true,
    });

    return {
      tasks: tasks.map((t) => t.toJSON()),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  static async getTaskById(taskId, userId, userRole) {
    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: Project,
          as: ASSOCIATIONS.PROJECT,
          attributes: ['id', 'name', 'ownerId'],
          include: [
            {
              model: ProjectMember,
              as: ASSOCIATIONS.MEMBERS,
              attributes: ['userId', 'role'],
            },
          ],
        },
        {
          model: User,
          as: ASSOCIATIONS.CREATOR,
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
        {
          model: User,
          as: ASSOCIATIONS.ASSIGNEE,
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
      ],
    });

    if (!task) {
      throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    if (userRole !== ROLES.ADMIN) {
      const isMember = task.project?.members?.some((m) => m.userId === userId);
      const isOwner = task.project?.ownerId === userId;
      if (!isMember && !isOwner) {
        throw new AuthorizationError(ERROR_MESSAGES.FORBIDDEN_ACTION);
      }
    }

    return task.toJSON();
  }

  static async createTask(userId, userRole, { title, description, status = TASK_STATUS.TODO, priority = TASK_PRIORITY.MEDIUM, dueDate, projectId, assigneeId }) {
    const project = await Project.findByPk(projectId, {
      include: [{ model: ProjectMember, as: ASSOCIATIONS.MEMBERS }],
    });

    if (!project) {
      throw new NotFoundError(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    }

    if (userRole !== ROLES.ADMIN) {
      const isMember = project.members.some((m) => m.userId === userId);
      const isOwner = project.ownerId === userId;
      if (!isMember && !isOwner) {
        throw new AuthorizationError(ERROR_MESSAGES.FORBIDDEN_ACTION);
      }
    }

    if (assigneeId) {
      const isAssigneeMember = project.members.some((m) => m.userId === assigneeId) || project.ownerId === assigneeId;
      if (!isAssigneeMember) {
        throw new ValidationError(ERROR_MESSAGES.VALIDATION_FAILED);
      }
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      projectId,
      creatorId: userId,
      assigneeId: assigneeId || null,
    });

    return this.getTaskById(task.id, userId, ROLES.ADMIN);
  }

  static async updateTask(taskId, userId, userRole, data) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    if (data.assigneeId) {
      const project = await Project.findByPk(task.projectId, {
        include: [{ model: ProjectMember, as: ASSOCIATIONS.MEMBERS }],
      });
      if (project) {
        const isAssigneeMember = project.members.some((m) => m.userId === data.assigneeId) || project.ownerId === data.assigneeId;
        if (!isAssigneeMember) {
          throw new ValidationError(ERROR_MESSAGES.VALIDATION_FAILED);
        }
      }
    }

    await task.update(data);
    return this.getTaskById(taskId, userId, userRole);
  }

  static async deleteTask(taskId, userId, userRole) {
    const task = await Task.findByPk(taskId, {
      include: [{ model: Project, as: ASSOCIATIONS.PROJECT }],
    });

    if (!task) {
      throw new NotFoundError(ERROR_MESSAGES.TASK_NOT_FOUND);
    }

    const isCreator = task.creatorId === userId;
    const isOwner = task.project?.ownerId === userId;
    const isAdmin = userRole === ROLES.ADMIN;
    const isManager = userRole === ROLES.MANAGER;

    if (!isCreator && !isOwner && !isAdmin && !isManager) {
      throw new AuthorizationError(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    await task.destroy();
    return true;
  }
}
