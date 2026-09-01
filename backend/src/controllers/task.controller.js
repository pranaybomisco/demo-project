import { TaskService } from '../services/task.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.util.js';
import { SUCCESS_MESSAGES } from '../constants/index.js';

export class TaskController {
  static async list(req, res, next) {
    try {
      const result = await TaskService.listTasks(req.user.userId, req.user.role, req.query);
      sendSuccess(res, result.tasks, SUCCESS_MESSAGES.TASKS_LISTED, undefined, result.pagination);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const task = await TaskService.getTaskById(req.params.id, req.user.userId, req.user.role);
      sendSuccess(res, task, SUCCESS_MESSAGES.TASK_RETRIEVED);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const task = await TaskService.createTask(req.user.userId, req.user.role, req.body);
      sendCreated(res, task, SUCCESS_MESSAGES.TASK_CREATED);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const task = await TaskService.updateTask(req.params.id, req.user.userId, req.user.role, req.body);
      sendSuccess(res, task, SUCCESS_MESSAGES.TASK_UPDATED);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await TaskService.deleteTask(req.params.id, req.user.userId, req.user.role);
      sendNoContent(res);
    } catch (err) {
      next(err);
    }
  }
}
