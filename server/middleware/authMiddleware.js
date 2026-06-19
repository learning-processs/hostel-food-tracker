import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// Verifies the JWT from the request header and attaches the user to req.user
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await userModel.findById(decoded.id);

      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ message: 'Not authorized, user not found or inactive' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Restricts a route to specific roles, e.g. authorize('admin', 'mess_manager')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user ? req.user.role : 'unknown'}' is not permitted to access this resource`,
      });
    }
    next();
  };
};