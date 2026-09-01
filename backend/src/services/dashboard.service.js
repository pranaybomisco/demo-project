import { Op, Sequelize } from 'sequelize';
import { Project, Task, User, ProjectMember } from '../models/index.js';
import {
  ROLES,
  TASK_STATUS,
  TASK_PRIORITY,
  ASSOCIATIONS,
  SORT_ORDERS,
  DB_FIELDS,
} from '../constants/index.js';

export class DashboardService {
  static async getMetrics(userId, userRole) {
    const projectWhere = userRole !== ROLES.ADMIN
      ? {
          [Op.or]: [
            { ownerId: userId },
            Sequelize.literal(`EXISTS (SELECT 1 FROM project_members AS pm WHERE pm.project_id = "Project"."id" AND pm.user_id = '${userId}')`),
          ],
        }
      : {};

    const accessibleProjects = await Project.findAll({
      attributes: ['id'],
      where: projectWhere,
    });
    const totalProjects = accessibleProjects.length;
    const accessibleProjectIds = accessibleProjects.map((p) => p.id);

    const taskWhere = userRole !== ROLES.ADMIN
      ? { projectId: { [Op.in]: accessibleProjectIds } }
      : {};

    // Counts
    const totalTasks = await Task.count({ where: taskWhere });
    const todoCount = await Task.count({ where: { ...taskWhere, status: TASK_STATUS.TODO } });
    const inProgressCount = await Task.count({ where: { ...taskWhere, status: TASK_STATUS.IN_PROGRESS } });
    const doneCount = await Task.count({ where: { ...taskWhere, status: TASK_STATUS.DONE } });

    const lowCount = await Task.count({ where: { ...taskWhere, priority: TASK_PRIORITY.LOW } });
    const mediumCount = await Task.count({ where: { ...taskWhere, priority: TASK_PRIORITY.MEDIUM } });
    const highCount = await Task.count({ where: { ...taskWhere, priority: TASK_PRIORITY.HIGH } });
    const criticalCount = await Task.count({ where: { ...taskWhere, priority: TASK_PRIORITY.CRITICAL } });

    // Overdue tasks
    const overdueTasks = await Task.findAll({
      where: {
        ...taskWhere,
        status: { [Op.ne]: TASK_STATUS.DONE },
        dueDate: { [Op.lt]: new Date() },
      },
      include: [
        {
          model: Project,
          as: ASSOCIATIONS.PROJECT,
          attributes: ['id', 'name'],
        },
      ],
      order: [[DB_FIELDS.DUE_DATE, SORT_ORDERS.ASC]],
      limit: 5,
    });

    // Recent tasks
    const recentTasks = await Task.findAll({
      where: taskWhere,
      include: [
        {
          model: Project,
          as: ASSOCIATIONS.PROJECT,
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: ASSOCIATIONS.ASSIGNEE,
          attributes: ['name'],
        },
      ],
      order: [[DB_FIELDS.UPDATED_AT, SORT_ORDERS.DESC]],
      limit: 6,
    });

    return {
      overview: {
        totalProjects,
        totalTasks,
        completedTasks: doneCount,
        pendingTasks: todoCount + inProgressCount,
        overdueTasksCount: overdueTasks.length,
      },
      statusBreakdown: {
        [TASK_STATUS.TODO]: todoCount,
        [TASK_STATUS.IN_PROGRESS]: inProgressCount,
        [TASK_STATUS.DONE]: doneCount,
      },
      priorityBreakdown: {
        [TASK_PRIORITY.LOW]: lowCount,
        [TASK_PRIORITY.MEDIUM]: mediumCount,
        [TASK_PRIORITY.HIGH]: highCount,
        [TASK_PRIORITY.CRITICAL]: criticalCount,
      },
      overdueTasks: overdueTasks.map((t) => t.toJSON()),
      recentTasks: recentTasks.map((t) => t.toJSON()),
    };
  }
}
