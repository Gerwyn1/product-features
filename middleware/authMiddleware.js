import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import UserModel from '../models/user.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await UserModel.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const checkUserRole = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user.id);

      if (!user) {
        throw new Error('Not authorized, please log in');
      }
      
       if (!user?.roles) {
          throw new Error('Not authorized, no roles found');
        }

      // Check if the user has one of the allowed roles
      const rolesArray = [...allowedRoles];
      const result = user.roles.map(role => rolesArray.includes(role)).find(val => val === true);
      if (!result) {
        throw new Error('Not authorized, user does not have required role');
      }

      // If user has allowed role, continue to next middleware
      next();
    } catch (error) {
        res.status(401);
        next(error);
    }
  });
};

const checkIfPasswordExpired = (req, res, next) => { 
  if (req.user.passwordExpiresAt <= Date.now()) {
    res.status(401);
    throw new Error('Password expired, please change your password');
  }

  next();
 }

export {
  protect,
  checkUserRole,
  checkIfPasswordExpired
}