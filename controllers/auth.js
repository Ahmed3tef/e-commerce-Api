import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';
import { UserModel } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/sendEmail.js';
import { createToken } from '../utils/createToken.js';

// const expiresInSecondes = process.env.JWT_SECRET_EXPIRATION;

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

  const headersAuth = req.headers.authorization.split(' ');
  const token = headersAuth.length === 1 ? headersAuth[0] : headersAuth[1]; // 'bearer tokenCode' so we get only code

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
  if (user.active === false)
    return next(
      new ApiError(
        'Account has been deactivated, please activate your account to login.',
        401
      )
    );
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

export const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) get user by email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user)
    return next(
      new ApiError(`There is no user with this email ${req.body.email}`, 404)
    );

  // 2) if user exists, create reset code random 6 digits and send it to email, save the hashed one in db

  // 1- generate random 6 numbers and hashing it.
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeHashed = await bcrypt.hash(resetCode, 6);

  // 2- add the reset code to db and its expiration time.
  user.passwordResetCode = resetCodeHashed;
  // expires after (10 min)
  user.passwordResetCodeExpiresAt = Date.now() + 10 * 60 * 1000;
  user.passwordResetCodeVerified = false;
  await user.save();

  // 3) send the reset code to the user by email.
  const message = `Hi ${user.name}, \n your reset code for E-shop is ${resetCode}.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset your password code (valid for 5 min).',
      message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpiresAt = undefined;
    user.passwordResetCodeVerified = undefined;
    await user.save();
    return next(new ApiError('some error occurred in sending email'));
  }
  res
    .status(200)
    .json({ status: 'success', message: 'Reset code was sent to email.' });
});

export const verifyResetCode = asyncHandler(async (req, res, next) => {
  const { resetCode, email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) return next(new ApiError('user not found', 404));

  const codeIsCorrect = bcrypt.compare(resetCode, user.passwordResetCode);
  const codeIsExpired = user.passwordResetCodeExpiresAt < Date.now();

  if (!codeIsCorrect || codeIsExpired)
    return next(new ApiError('Reset code is invalid or expired.', 400));

  user.passwordResetCodeVerified = true;
  await user.save();

  res.status(200).json({ status: 'success', message: 'Reset code verified' });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // get user
  const user = await UserModel.findOne({ email });
  if (!user) return next(new ApiError('user not found', 404));

  // check resetCode is verified
  if (!user.passwordResetCodeVerified)
    return next(new ApiError('Reset code not verified.', 400));

  // check password not equal to current
  const passwordIsOld = bcrypt.compareSync(password, user.password);

  if (passwordIsOld)
    return next(new ApiError('please enter a new password value', 400));

  // if pass is correct and is new:
  // 1- add the new password to user after bcrypt is applied.
  // 2- set passwordResetCode, passwordResetCodeExpiresAt, passwordResetCodeVerified to undefined.
  // 3- generate new token.

  user.password = password;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpiresAt = undefined;
  user.passwordResetCodeVerified = undefined;
  await user.save();

  const token = createToken(user._id);
  res.status(200).json({ token });
});
