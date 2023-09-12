import asyncHandler from 'express-async-handler';

import UserModel from '../models/user.js';
import generateToken from '../utils/generateToken.js';

const getAllUsers = asyncHandler(async (_,res) => {
  const users = await UserModel.find({});
  res.status(200).json(users);
});

// auth user & get token (login)
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
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
  res.status(200).json({message : 'User successfully logged out'})};

// register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, roles } = req.body; 

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  const userExists = await UserModel.findOne({ email });


 // verify email (valid email or not) -  nodemailer (verification code) - second step
 // user pw expires every 3 (changeable by admin) months after email is confirmed (first login)
 // don't re-use pw (pw history)
 // admin can disable user account (user can't login) - its kinda like banning

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await UserModel.create({
    name,
    email,
    password,
    roles
  });

  if (user) {
    generateToken(res, user._id); // first step
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      roles,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user?._id);

  if (user) {
    res.json({
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

    res.json({
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
  const result = await UserModel.deleteOne({_id: req.params.id});

  if (result.deletedCount === 0) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({message: 'User successfully deleted'});
});

 export  {
  getAllUsers,
  registerUser,
  authUser,
  logoutUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
 }