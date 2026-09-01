import { ProjectService } from '../services/project.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.util.js';
import { SUCCESS_MESSAGES } from '../constants/index.js';

export class ProjectController {
  static async list(req, res, next) {
    try {
      const result = await ProjectService.listProjects(req.user.userId, req.user.role, req.query);
      sendSuccess(res, result.projects, SUCCESS_MESSAGES.PROJECTS_LISTED, undefined, result.pagination);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id, req.user.userId, req.user.role);
      sendSuccess(res, project, SUCCESS_MESSAGES.PROJECT_RETRIEVED);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const project = await ProjectService.createProject(req.user.userId, req.body);
      sendCreated(res, project, SUCCESS_MESSAGES.PROJECT_CREATED);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const project = await ProjectService.updateProject(req.params.id, req.user.userId, req.user.role, req.body);
      sendSuccess(res, project, SUCCESS_MESSAGES.PROJECT_UPDATED);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await ProjectService.deleteProject(req.params.id, req.user.userId, req.user.role);
      sendNoContent(res);
    } catch (err) {
      next(err);
    }
  }

  static async addMember(req, res, next) {
    try {
      const member = await ProjectService.addMember(req.params.id, req.user.userId, req.user.role, req.body);
      sendCreated(res, member, SUCCESS_MESSAGES.MEMBER_ADDED);
    } catch (err) {
      next(err);
    }
  }

  static async removeMember(req, res, next) {
    try {
      await ProjectService.removeMember(req.params.id, req.params.userId, req.user.userId, req.user.role);
      sendNoContent(res);
    } catch (err) {
      next(err);
    }
  }
}
