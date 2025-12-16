import {
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
  updateUserProfile,
  changeUserPassword,
} from '../services/auth.service.js';

// Helper to set refresh token cookie (optional – you can also send in body)
function setRefreshCookie(res, token) {
  if (!token) return;
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({ name, email, password });
    return res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser({ email, password });
    setRefreshCookie(res, refreshToken);
    return res.json({ success: true, user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

export async function adminLogin(req, res, next) {
  try {
    // Admin login is the same endpoint but we can later add extra checks if needed
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    if (result.user.role !== 'admin') {
      const error = new Error('Admin access required');
      error.statusCode = 403;
      throw error;
    }
    setRefreshCookie(res, result.refreshToken);
    return res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function refreshTokenController(req, res, next) {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    const { user, accessToken, refreshToken } = await refreshTokens(token);
    setRefreshCookie(res, refreshToken);
    return res.json({ success: true, user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    await logoutUser(token);
    setRefreshCookie(res, '');
    return res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res) {
  return res.json({ success: true, user: req.user });
}

export async function updateProfile(req, res, next) {
  try {
    const user = await updateUserProfile(req.user._id, req.body);
    return res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await changeUserPassword(req.user._id, { currentPassword, newPassword });
    return res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}
