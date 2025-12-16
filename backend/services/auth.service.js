import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { RefreshToken } from '../models/refreshToken.model.js';

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || '7d';

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL }
  );
}

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.create({ name, email, password });
  return user;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const decoded = jwt.decode(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt,
  });

  return { user, accessToken, refreshToken };
}

export async function refreshTokens(oldRefreshToken) {
  if (!oldRefreshToken) {
    const err = new Error('Refresh token required');
    err.statusCode = 401;
    throw err;
  }

  const stored = await RefreshToken.findOne({ token: oldRefreshToken });
  if (!stored) {
    const err = new Error('Invalid refresh token');
    err.statusCode = 401;
    throw err;
  }

  try {
    const payload = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    // rotate token
    const accessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);
    const decoded = jwt.decode(newRefreshToken);
    const expiresAt = new Date(decoded.exp * 1000);

    stored.token = newRefreshToken;
    stored.expiresAt = expiresAt;
    await stored.save();

    return { user, accessToken, refreshToken: newRefreshToken };
  } catch (e) {
    await RefreshToken.deleteOne({ token: oldRefreshToken });
    const err = new Error('Invalid refresh token');
    err.statusCode = 401;
    throw err;
  }
}

export async function logoutUser(refreshToken) {
  if (!refreshToken) return;
  await RefreshToken.deleteOne({ token: refreshToken });
}

/**
 * Update user profile (name only, not email or password)
 */
export async function updateUserProfile(userId, updates) {
  // Only allow updating name for now
  const allowedUpdates = {};
  if (updates.name !== undefined) {
    allowedUpdates.name = updates.name.trim();
  }

  if (Object.keys(allowedUpdates).length === 0) {
    const err = new Error('No valid fields to update');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findByIdAndUpdate(userId, allowedUpdates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return user;
}

/**
 * Change user password
 */
export async function changeUserPassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const err = new Error('Current password is incorrect');
    err.statusCode = 401;
    throw err;
  }

  // Update password (will be hashed by pre-save hook)
  user.password = newPassword;
  await user.save();

  // Invalidate all refresh tokens for security
  await RefreshToken.deleteMany({ user: userId });

  return { message: 'Password changed successfully' };
}
