import crypto from "crypto";
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import createHttpError from "http-errors";

import UserModel from '../models/user.js';
import generateToken from '../utils/generateToken.js';
import * as Email from "../utils/email.js";
import EmailVerificationToken from "../models/emailVerificationToken.js";
import PasswordResetToken from "../models/passwordResetToken.js";
import {userSchema} from "../models/user.js";
import { takeCoverage } from "v8";
// import { destroyAllActiveSessionsForUser } from "../utils/auth";

const getAllUsers = asyncHandler(async (_, res) => {
  const users = await UserModel.find({});
  res.status(200).json(users);
});

// auth user & get token (login)
const authUser = asyncHandler(async (req, res) => {
  const {
    email,
    password
  } = req.body;
  const user = await UserModel.findOne({
    email
  });

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // check if user is banned
  if (user.is_disabled) {
    res.status(403);
    throw new Error("Your account has been suspended. Please contact support for more information.");
  }

  if (await user.matchPassword(password)) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// logout user / clear cookie
const logoutUser = (_, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    message: 'User successfully logged out'
  })
};

// register a new user
const registerUser = asyncHandler(async (req, res) => {
  const {
    username,
    first_name,
    last_name,
    email,
    password,
    mobile_no,
    company_name,
    address_1,
    address_2,
    country,
    postcode,
    is_verified,
    roles,
    is_disabled,
    // verificationCode
  } = req.body;

  if (!username || !first_name || !last_name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  const userExists = await UserModel.findOne({
    email
  }); // first step

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // const emailVerificationToken = await EmailVerificationToken.findOne({
  //   email,
  //   verificationCode
  // }).exec();

  // if (!emailVerificationToken) {
  //   throw createHttpError(400, "Verification code incorrect or expired.");
  // } else {
  //   await emailVerificationToken.deleteOne();
  // }

  const user = await UserModel.create(req.body);
  // const user = await UserModel.create({
  //   username,
  //   email,
  //   password,
  //   roles
  // });

  if (user) {
    generateToken(res, user._id); // first step
    res.status(201).json(user);
    // res.status(201).json({
    //   _id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   roles,
    // });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user?._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user?._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// delete user
const deleteUser = asyncHandler(async (req, res) => {
  const result = await UserModel.deleteOne({
    _id: req.params.id
  });

  if (result.deletedCount === 0) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    message: 'User successfully deleted'
  });
});


// admin can disable user account (user can't login) - banning
const disableUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (user.roles.includes('admin')) {
    res.status(403);
    throw new Error('Admin cannot be disabled');
  }

  if (user.is_disabled) {
    res.status(403);
    throw new Error('User is already disabled');
  }

  if (user) {
    user.is_disabled = true;
    await user.save();
    res.status(200).json({
      message: 'User successfully disabled'
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const requestEmailVerificationCode = asyncHandler(async (req, res, next) => {
  const {
    email
  } = req.body;

  try {
    const existingEmail = await UserModel.findOne({
      email
    }).collation({ locale: "en", strength: 2 })
    .exec();

    if (existingEmail) {
      res.status(409);
      throw new Error("A user with this email address already exists. Please log in instead.");
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    await EmailVerificationToken.create({
      email,
      verificationCode
    });

    await Email.sendVerificationCode(email, verificationCode);

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
})

const requestResetPasswordCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  try {
      const user = await UserModel.findOne({ email })
          .collation({ locale: "en", strength: 2 })
          .exec();

      if (!user) {
          throw createHttpError(404, "A user with this email doesn't exist. Please sign up instead.");
      }

      const verificationCode = crypto.randomInt(100000, 999999).toString();
      await PasswordResetToken.create({ email, verificationCode });

      await Email.sendPasswordResetCode(email, verificationCode);

      res.sendStatus(200);
  } catch (error) {
      next(error);
  }
})

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password: newPasswordRaw, verificationCode } = req.body;

  try {
      const existingUser = await UserModel.findOne({ email }).select("+email")
          .collation({ locale: "en", strength: 2 })
          .exec();

      if (!existingUser) {
          throw createHttpError(404, "User not found");
      }

      const passwordResetToken = await PasswordResetToken.findOne({ email, verificationCode }).exec();

      if (!passwordResetToken) {
          throw createHttpError(400, "Verification code incorrect or expired.");
      } else {
          await passwordResetToken.deleteOne();
      }

      // await destroyAllActiveSessionsForUser(existingUser._id.toString());

      const newPasswordHashed = await bcrypt.hash(newPasswordRaw, 10);

      existingUser.password = newPasswordHashed;

      await existingUser.save();

      const user = existingUser.toObject();

      delete user.password;

      res.status(200).json(user);

      // req.logIn(user, error => {
      //     if (error) throw error;
      //     res.status(200).json(user);
      // });
  } catch (error) {
      next(error);
  }
})

const changePasswordExpiry = asyncHandler(async(req, res, next) => {
  const { passwordExpiresAt } = req.body;
  const defaultExpiryMs = new Date(userSchema.path('passwordExpiresAt').defaultValue).getTime();
  const newExpiryMs = new Date(passwordExpiresAt).getTime()

  if (newExpiryMs < defaultExpiryMs) {
    throw createHttpError(400, "New Expiry date cannot be earlier than current expiry date.");
  }

  userSchema.add({
    // Add or modify fields as needed
    passwordExpiresAt: {
      type: Date,
      default: new Date(newExpiryMs) // at least 3 months ahead
    },
  });

    await UserModel.updateMany({}, {
      $set: {
        passwordExpiresAt: userSchema.path('passwordExpiresAt').defaultValue,
      }
    }, {
      upsert: true
    });

    res.status(200).json({message:'Expiry date successfully updated'});
 });

export {
  getAllUsers,
  registerUser,
  authUser,
  logoutUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  disableUser,
  requestEmailVerificationCode,
  requestResetPasswordCode,
  resetPassword,
  changePasswordExpiry
}