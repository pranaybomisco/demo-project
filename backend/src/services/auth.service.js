import { User } from '../models/index.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { signToken } from '../utils/jwt.util.js';
import { ConflictError, AuthenticationError, NotFoundError } from '../errors/apperror.js';
import { ERROR_MESSAGES, ROLES } from '../constants/index.js';

export class AuthService {
  static async register({ email, password, name, role = ROLES.MEMBER }) {
    const existing = await User.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name.trim(),
      role,
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      token,
    };
  }

  static async login({ email, password }) {
    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      token,
    };
  }

  static async getProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email', 'name', 'role', 'avatarUrl', 'createdAt'],
    });
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user.toJSON();
  }

  static async updateProfile(userId, { name, email, currentPassword, newPassword, avatarUrl }) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const existing = await User.findOne({
        where: { email: email.toLowerCase().trim() },
      });
      if (existing) {
        throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
      user.email = email.toLowerCase().trim();
    }

    if (name) {
      user.name = name.trim();
    }

    if (avatarUrl !== undefined) {
      user.avatarUrl = avatarUrl;
    }

    if (newPassword) {
      if (!currentPassword) {
        throw new ValidationError('Current password is required to set a new password');
      }
      const isValid = await comparePassword(currentPassword, user.passwordHash);
      if (!isValid) {
        throw new AuthenticationError('Current password is incorrect');
      }
      if (newPassword.length < 6) {
        throw new ValidationError('New password must be at least 6 characters');
      }
      user.passwordHash = await hashPassword(newPassword);
    }

    await user.save();

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }
}

