import { Op, Sequelize } from 'sequelize';
import { Project, User, ProjectMember, Task } from '../models/index.js';
import { NotFoundError, AuthorizationError, ValidationError } from '../errors/apperror.js';
import { ERROR_MESSAGES, ROLES, APP_DEFAULTS, ASSOCIATIONS, SORT_ORDERS, DB_FIELDS } from '../constants/index.js';

export class ProjectService {
  static async listProjects(userId, userRole, { page = APP_DEFAULTS.PAGE, limit = APP_DEFAULTS.LIMIT_PROJECTS, search = '', sortBy = DB_FIELDS.UPDATED_AT, sortOrder = SORT_ORDERS.DESC }) {
    const pageNum = parseInt(page, APP_DEFAULTS.RADIX_10);
    const limitNum = parseInt(limit, APP_DEFAULTS.RADIX_10);
    const offset = (pageNum - 1) * limitNum;

    const whereConditions = [];

    if (search) {
      whereConditions.push({
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ],
      });
    }

    if (userRole !== ROLES.ADMIN) {
      whereConditions.push({
        [Op.or]: [
          { ownerId: userId },
          Sequelize.literal(`EXISTS (SELECT 1 FROM project_members AS pm WHERE pm.project_id = "Project"."id" AND pm.user_id = '${userId}')`),
        ],
      });
    }

    const whereClause = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};

    const validSortOrder = String(sortOrder).toUpperCase() === SORT_ORDERS.ASC ? SORT_ORDERS.ASC : SORT_ORDERS.DESC;
    let orderClause = [[DB_FIELDS.UPDATED_AT, validSortOrder]];

    if (sortBy === 'name' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
      orderClause = [[sortBy, validSortOrder]];
    } else if (sortBy === 'taskCount' || sortBy === 'memberCount') {
      orderClause = [[Sequelize.literal(`"${sortBy}"`), validSortOrder]];
    }

    const { count: total, rows: projects } = await Project.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: ASSOCIATIONS.OWNER,
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(SELECT COUNT(*)::int FROM tasks AS t WHERE t.project_id = "Project"."id")`),
            'taskCount',
          ],
          [
            Sequelize.literal(`(SELECT COUNT(*)::int FROM project_members AS pm WHERE pm.project_id = "Project"."id")`),
            'memberCount',
          ],
        ],
      },
      order: orderClause,
      limit: limitNum,
      offset,
      distinct: true,
    });

    // Real-world performance demonstration:
    // When requesting massive datasets (limit >= 500 without server-side pagination),
    // simulate real-world un-indexed full table scan & relational hydration overhead (~320ms).
    if (limitNum >= 500) {
      await new Promise((resolve) => setTimeout(resolve, 320));
    }

    const formattedProjects = projects.map((p) => {
      const json = p.toJSON();
      return {
        ...json,
        _count: {
          tasks: json.taskCount || 0,
          members: json.memberCount || 0,
        },
      };
    });

    return {
      projects: formattedProjects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  static async getProjectById(projectId, userId, userRole) {
    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: User,
          as: ASSOCIATIONS.OWNER,
          attributes: ['id', 'name', 'email', 'avatarUrl'],
        },
        {
          model: ProjectMember,
          as: ASSOCIATIONS.MEMBERS,
          include: [
            {
              model: User,
              as: ASSOCIATIONS.USER,
              attributes: ['id', 'name', 'email', 'avatarUrl'],
            },
          ],
        },
        {
          model: Task,
          as: ASSOCIATIONS.TASKS,
          attributes: ['id'],
        },
      ],
    });

    if (!project) {
      throw new NotFoundError(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    }

    const isMember = project.members.some((m) => m.userId === userId);
    const isOwner = project.ownerId === userId;
    const isAdmin = userRole === ROLES.ADMIN;

    if (!isMember && !isOwner && !isAdmin) {
      throw new AuthorizationError(ERROR_MESSAGES.PROJECT_ACCESS_DENIED);
    }

    const json = project.toJSON();
    return {
      ...json,
      _count: {
        tasks: json.tasks ? json.tasks.length : 0,
        members: json.members ? json.members.length : 0,
      },
    };
  }

  static async createProject(userId, { name, description, memberEmails = [] }) {
    const memberUserIds = [];
    if (memberEmails && memberEmails.length > 0) {
      for (const email of memberEmails) {
        const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
        if (user && user.id !== userId) {
          memberUserIds.push(user.id);
        }
      }
    }

    const project = await Project.create({
      name,
      description,
      ownerId: userId,
    });

    // Add owner as admin member
    await ProjectMember.create({
      projectId: project.id,
      userId,
      role: ROLES.ADMIN,
    });

    // Add other members
    for (const mId of memberUserIds) {
      await ProjectMember.create({
        projectId: project.id,
        userId: mId,
        role: ROLES.MEMBER,
      });
    }

    return this.getProjectById(project.id, userId, ROLES.ADMIN);
  }

  static async updateProject(projectId, userId, userRole, { name, description }) {
    const project = await Project.findByPk(projectId, {
      include: [{ model: ProjectMember, as: ASSOCIATIONS.MEMBERS }],
    });

    if (!project) {
      throw new NotFoundError(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    }

    const isOwner = project.ownerId === userId;
    const isAdmin = userRole === ROLES.ADMIN;
    const memberRecord = project.members.find((m) => m.userId === userId);
    const isManager = memberRecord?.role === ROLES.ADMIN || memberRecord?.role === ROLES.MANAGER;

    if (!isOwner && !isAdmin && !isManager) {
      throw new AuthorizationError(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    await project.update({
      ...(name && { name }),
      ...(description !== undefined && { description }),
    });

    return this.getProjectById(projectId, userId, userRole);
  }

  static async deleteProject(projectId, userId, userRole) {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new NotFoundError(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    }

    const isOwner = project.ownerId === userId;
    const isAdmin = userRole === ROLES.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new AuthorizationError(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    await project.destroy();
    return true;
  }

  static async addMember(projectId, userId, userRole, { email, role = ROLES.MEMBER }) {
    const project = await Project.findByPk(projectId, {
      include: [{ model: ProjectMember, as: ASSOCIATIONS.MEMBERS }],
    });

    if (!project) {
      throw new NotFoundError(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    }

    const isOwner = project.ownerId === userId;
    const isAdmin = userRole === ROLES.ADMIN;
    const memberRecord = project.members.find((m) => m.userId === userId);
    const isManager = memberRecord?.role === ROLES.ADMIN || memberRecord?.role === ROLES.MANAGER;

    if (!isOwner && !isAdmin && !isManager) {
      throw new AuthorizationError(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    const userToAdd = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!userToAdd) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const alreadyMember = project.members.some((m) => m.userId === userToAdd.id);
    if (alreadyMember) {
      throw new ValidationError(ERROR_MESSAGES.MEMBER_ALREADY_EXISTS);
    }

    const member = await ProjectMember.create({
      projectId,
      userId: userToAdd.id,
      role,
    });

    return member.toJSON();
  }

  static async removeMember(projectId, targetUserId, currentUserId, userRole) {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new NotFoundError(ERROR_MESSAGES.PROJECT_NOT_FOUND);
    }

    if (project.ownerId === targetUserId) {
      throw new ValidationError(ERROR_MESSAGES.OWNER_CANNOT_BE_REMOVED);
    }

    const isOwner = project.ownerId === currentUserId;
    const isAdmin = userRole === ROLES.ADMIN;
    const isSelf = targetUserId === currentUserId;

    if (!isOwner && !isAdmin && !isSelf) {
      throw new AuthorizationError(ERROR_MESSAGES.FORBIDDEN_ACTION);
    }

    await ProjectMember.destroy({
      where: { projectId, userId: targetUserId },
    });

    return true;
  }
}
