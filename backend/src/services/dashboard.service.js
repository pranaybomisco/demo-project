import { Op, Sequelize } from 'sequelize';
import { Project, Task, User, ProjectMember } from '../models/index.js';
import { BACKEND_PERF_CONFIG } from '../config/performance.config.js';
import { logger } from '../config/logger.js';
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

    // 💥 UNOPTIMIZED BACKEND: In-Memory Array Filtering & Heavy Main-Thread CPU Overhead
    if (BACKEND_PERF_CONFIG.mode === 'unoptimized') {
      logger.warn('[UNOPTIMIZED BACKEND] Pulling raw unaggregated records into Node.js heap memory for manual processing...');
      const allTasks = await Task.findAll({ where: taskWhere });

      // In-memory calculations instead of database-level GROUP BY / COUNT
      let todoCount = 0;
      let inProgressCount = 0;
      let doneCount = 0;
      let lowCount = 0;
      let mediumCount = 0;
      let highCount = 0;
      let criticalCount = 0;
      const overdueList = [];

      const now = new Date();
      for (const t of allTasks) {
        if (t.status === TASK_STATUS.TODO) todoCount++;
        else if (t.status === TASK_STATUS.IN_PROGRESS) inProgressCount++;
        else if (t.status === TASK_STATUS.DONE) doneCount++;

        if (t.priority === TASK_PRIORITY.LOW) lowCount++;
        else if (t.priority === TASK_PRIORITY.MEDIUM) mediumCount++;
        else if (t.priority === TASK_PRIORITY.HIGH) highCount++;
        else if (t.priority === TASK_PRIORITY.CRITICAL) criticalCount++;

        if (t.status !== TASK_STATUS.DONE && t.dueDate && new Date(t.dueDate) < now) {
          overdueList.push(t);
        }

        // Heavy in-loop serialization
        for (let i = 0; i < 5000; i++) {
          Math.sin(i);
        }
      }

      const recentTasks = await Task.findAll({
        where: taskWhere,
        include: [
          { model: Project, as: ASSOCIATIONS.PROJECT, attributes: ['id', 'name'] },
          { model: User, as: ASSOCIATIONS.ASSIGNEE, attributes: ['name'] },
        ],
        order: [[DB_FIELDS.UPDATED_AT, SORT_ORDERS.DESC]],
        limit: 6,
      });

      return {
        overview: {
          totalProjects,
          totalTasks: allTasks.length,
          completedTasks: doneCount,
          pendingTasks: todoCount + inProgressCount,
          overdueTasksCount: overdueList.length,
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
        overdueTasks: overdueList.slice(0, 5).map((t) => t.toJSON()),
        recentTasks: recentTasks.map((t) => t.toJSON()),
      };
    }

    // 🚀 OPTIMIZED BACKEND: Database-level COUNT aggregations
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
