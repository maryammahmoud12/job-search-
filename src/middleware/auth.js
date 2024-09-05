import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";
import { appError } from "../utils/classError.js";

export const auth = (roles = []) => {
  return async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
      return next(new appError("token not found", 205));
    }
    const decoded = jwt.verify(token, process.env.jwt_signIn);
    if (!decoded?.id) {
      return next(new appError("tinvalid token", 206));
    }
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return next(new appError("user not found", 403));
    }
    // Authorization
    if (!roles.includes(user.role)) {
      return next(new appError("you not have permission", 207));
    }
    req.user = user;
    next();
  };
};
