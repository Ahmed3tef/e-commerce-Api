import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import { UserModel } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const expiresInSecondes = process.env.JWT_SECRET_EXPIRATION;

const createToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRATION,
  });

export const signup = asyncHandler(async (req, res, next) => {
  // 1- create user
  // عايز اليوزر عشان اجيب الاي دي بتاعه لانه مهم جدا ف التوكن
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });

  // 2- crate JWT token
  const token = createToken(user._id);

  // 3- get token expiration date from jwt
  // 3- send token to client
  res.status(201).json({ token, data: user });
});

export const login = asyncHandler(async (req, res, next) => {
  // get user to know if user exits and to check for password.
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    return next(new ApiError('Incorrect email or password', 401));
  }

  const token = createToken(user._id);

  res.status(200).json({ token });
});

// token checker

export const tokenProtection = asyncHandler(async (req, res, next) => {
  // 1) check if token exists.
  // - we must check if there is a Barer or not to take the right token.
  let token;
  const headersAuth = req.headers.authorization.split(' ');
  token = headersAuth.length === 1 ? headersAuth[0] : headersAuth[1]; // 'bearer tokenCode' so we get only code
  console.log(token);
  if (!token)
    return next(
      new ApiError('You are not logged in, please login first.', 401)
    );
  // 2) check if token is valid.
  const verification = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(verification); => { id: '63b833df5c7503ebf4bc6719', iat: 1673020046, exp: 1675612046 }

  // 3) check if user exists
  const user = await UserModel.findById(verification.id);
  if (!user) return next(new ApiError('User no longer exists.', 401));

  // 4) check if password changed after token changed.
  // this means user has changed password
  if (user.passwordChangedAt) {
    const passwordChangedAtInSeconds = parseInt(
      user.passwordChangedAt / 1000,
      10
    );
    // this means after user has changed password he didn't login again
    if (passwordChangedAtInSeconds > verification.iat)
      return next(
        new ApiError(
          'User has changed his password, please login and try again.',
          401
        )
      );
  }
  req.user = user;
  next();
});

export const accessAllowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ApiError('You are not allowed to access this route.', 403)
      );

    next();
  });
