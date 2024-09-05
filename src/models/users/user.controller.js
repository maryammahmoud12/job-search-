import jwt from "jsonwebtoken";
import userModel from "../../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../service/sendEmail.js";
import { appError } from "../../utils/classError.js";
import { asyncHandler } from "../../middleware/errorHandle.js";

//  1 - signUp

export const signUp = asyncHandler(async (req, res, next) => {
  // destruct user details from request body
  const { firstName, lastName, email, password, DOB, mobileNumber, role } =
    req.body;
  // check if user already exist or no
  const userExisst = await userModel.findOne({ email });
  // if user alredy exist , return error
  if (userExisst) {
    return next(new appError("user already exist", 400));
  }

  // generate a JWT token for email confirmation
  const token = jwt.sign({ email }, process.env.jwt_email);
  // link of confirmation that send to user
  const link = `http://localhost:3000/users/confirmEmail/${token}`;
  // send confirmation email
  const checkSendEmail = await sendEmail(
    "m10063911@gmail.com",
    "helooo",
    `<a href = '${link}'>"confirmed" </a>`
  );
  // if sending email fails, return error
  if (!checkSendEmail) {
    return next(new appError("email not send", 401));
  }
  // hash user password using bcrypt
  const hash = bcrypt.hashSync(password, 8);
  // create new user document
  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password: hash,
    DOB,
    mobileNumber,
    role,
  });
  // return created data
  return res.json({ msg: "done", user });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  // destruct user token from request body
  const { token } = req.params;
  // verify jwt token
  const decoded = jwt.verify(token, process.env.jwt_email);
  // check that decoded not contain email , return error
  if (!decoded?.email) {
    return next(new appError("invalid payload", 402));
  }
  // find user by email and user confirmed must be false , then update user to be confirmed
  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    { confirmed: true }
  );
  // if user not found , return error
  if (!user) {
    return next(new appError("user not found", 403));
  }
  // return success message
  return res.json("done");
});

// 2 - signIn

export const signIn = asyncHandler(async (req, res, next) => {
  // destruct user details from request body
  const { email, recoveryEmail, mobileNumber, password } = req.body;
  // find user using one or more of user details , then update its status
  const userExisst = await userModel.findOneAndUpdate(
    {
      $or: [{ email }, { recoveryEmail }, { mobileNumber }],
      confirmed: true,
    },
    { status: "online" }
  );
  // check if user not exist or password is incorrect , return error
  if (!userExisst || !bcrypt.compareSync(password, userExisst.password)) {
    return next(new appError("user not exist or password is incorrect", 404));
  }
  // generate jwt token for using as authontication
  const token = jwt.sign({ id: userExisst._id, email }, process.env.jwt_signIn);
  // retutn token of user
  return res.json({ msg: "done", token });
});

// 3 - update account

export const updateAcc = asyncHandler(async (req, res, next) => {
  // destruct user id from params for using in find user and user details from request body to update it
  const { id } = req.params;
  const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } =
    req.body;
  // find user by its id and user must be loggedin , then update one of this data
  const user = await userModel.findOneAndUpdate(
    { _id: id, status: "online" },
    {
      $or: [
        { email },
        { mobileNumber },
        { recoveryEmail },
        { DOB },
        { lastName },
        { firstName },
      ],
    }
  );
  // check for unique fields(email , mobile number) and return error if value already exists
  if (req.body.email) {
    await checkUniqueField("email", req.body.email, req.user._id);
  }
  if (req.body.mobileNumber) {
    await checkUniqueField("mobileNumber", req.body.mobileNumber, req.user._id);
  }
  // if the user isn't found or user isn't authorized, return error
  if (!user) {
    return next(new appError("user not found or you not auth", 405));
  }
  // return updated data
  return res.json("done", user);
});

// 4 - delete account

export const deleteAcc = asyncHandler(async (req, res, next) => {
  // destruct id of user from params
  const { id } = req.params;
  // find user by its id and user must be loggedin , then delete it
  const user = await userModel.findOneAndDelete({ _id: id, status: "online" });
  // if the user isn't found or user isn't authorized, return error
  if (!user) {
    return next(new appError("user not found or you not auth", 405));
  }
  // return success message
  return res.json("done");
});

// 5 - Get user account data

export const userData = asyncHandler(async (req, res, next) => {
  // destruct email of user from body
  const { email } = req.body;
  // find user by its email and user must be loggedin
  const user = await userModel.findOne({ email, status: "online" });
  // return founded data
  return res.json({ msg: "done", user });
});

// 6 - Get profile data for another user

export const profileData = asyncHandler(async (req, res, next) => {
  // destruct id of user from params
  const { id } = req.params;
  // find user by its id
  const user = await userModel.findById({ _id: id });
  // if the user isn't found , return error
  if (!user) {
    return next(new appError("user not found", 403));
  }
  // return founded data
  return res.json({ msg: "done", user });
});

// 7 - Update password

export const updatePass = asyncHandler(async (req, res, next) => {
  // destruct old password and new password from request body
  const { password, newPass } = req.body;
  // compare old password with stored hashed password in DB
  const isMatch = await bcrypt.compare(password, req.user.password);
  // if the old password doesn't match, return error
  if (!isMatch) {
    return next(new appError("old password is incorrect", 406));
  }
  // hash new password
  const hashNewPass = await bcrypt.hashSync(newPass, 8);
  // find the user by its id and user must be loggedin, then update password
  const user = await userModel.findOneAndUpdate(
    { status: "online" },
    { password: hashNewPass }
  );
  // if the user isn't found or user isn't authorized, return error
  if (!user) {
    return next(new appError("user not found or you not auth", 405));
  }
  // return success message
  return res.json("done");
});

// 8 - Forget password

export const forgetPass = asyncHandler(async (req, res, next) => {
  // destruct email of user from body
  const { email } = req.body;
  // find user by its email
  const user = await userModel.findOne({ email });
  // if the user isn't found , return error
  if (!user) {
    return next(new appError("user not found", 403));
  }
  // generate otp(6 random digits) and hash it
  const otp = Math.floor(100000 + Math.random() * 900000);
  const hashedOtp = bcrypt.hashSync(otp.toString(), 10);
  // generate JWT token
  const token = jwt.sign(
    { userId: user._id, otp: hashedOtp },
    process.env.jwt_otp
  );
  // link that send to user for otp
  const link = `http://localhost:3000/users/resetpassword/${token}`;
  // send email
  const sendEmail = await sendEmail(
    "m10063911@gmail.com",
    "reset your password",
    `<a href = '${link}'>"otp password" </a>`
  );
  // if sending email fails, return error
  if (!sendEmail) {
    return next(new appError("email not send", 401));
  }
  // return token
  return res.json({ msg: "done", token });
});

export const resetPass = asyncHandler(async (req, res, next) => {
  // destruct otp and new password from request body
  const { otp, newPassword } = req.body;
  // verify JWT token and retrieve otp hash and user ID
  const decoded = jwt.verify(otp, process.env.jwt_otp);
  // if docoded not contain userId or otp , return error
  if (!decoded?.userId || !decoded?.otp) {
    return next(new appError("Invalid OTP token", 400));
  }
  // find user by its id
  const user = await userModel.findById(decoded.userId);
  // if the user isn't found , return error
  if (!user) {
    return next(new appError("user not found", 405));
  }
  // compare hashed OTP
  const isMatch = bcrypt.compareSync(otp.toString(), decoded.otp);
  if (!isMatch) {
    return next(new appError("invalid otp", 430));
  }
  // hash the new password
  const hashNewPass = bcrypt.hashSync(newPassword, 8);
  // update user's password
  user.password = await userModel.create({ password: hashNewPass });
  // return success message
  return res.json({ msg: "Password updated successfully" });
});

// 9 - Get all accounts associated to a specific recovery Email

export const accounts = asyncHandler(async (req, res, next) => {
  // destruct recoveryEmail of user from body
  const { recoveryEmail } = req.body;
  // find the users by their recoveryEmail
  const users = await userModel.find({ recoveryEmail });
  // if the user isn't found , return error
  if (!users) {
    return next(new appError("users not found", 403));
  }
  // return founded users
  return res.json({ msg: "done", users });
});
