import { AuthService } from '../services/auth.service.js';
import { sendSuccess, sendCreated } from '../utils/response.util.js';
import { SUCCESS_MESSAGES } from '../constants/index.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      sendCreated(res, result, SUCCESS_MESSAGES.USER_REGISTERED);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      sendSuccess(res, result, SUCCESS_MESSAGES.USER_LOGGED_IN);
    } catch (err) {
      next(err);
    }
  }

  static async logout(_req, res, next) {
    try {
      sendSuccess(res, null, SUCCESS_MESSAGES.USER_LOGGED_OUT);
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req, res, next) {
    try {
      const profile = await AuthService.getProfile(req.user.userId);
      sendSuccess(res, profile, SUCCESS_MESSAGES.USER_PROFILE_RETRIEVED);
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const profile = await AuthService.updateProfile(req.user.userId, req.body);
      sendSuccess(res, profile, SUCCESS_MESSAGES.USER_PROFILE_UPDATED);
    } catch (err) {
      next(err);
    }
  }
}

