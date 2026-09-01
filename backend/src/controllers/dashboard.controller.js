import { DashboardService } from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/response.util.js';
import { SUCCESS_MESSAGES } from '../constants/index.js';

export class DashboardController {
  static async getMetrics(req, res, next) {
    try {
      const data = await DashboardService.getMetrics(req.user.userId, req.user.role);
      sendSuccess(res, data, SUCCESS_MESSAGES.DASHBOARD_RETRIEVED);
    } catch (err) {
      next(err);
    }
  }
}
