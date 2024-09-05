import Joi from "joi";

export const signUp = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        new RegExp("/^(?=.*d)(?=(.*W){2})(?=.*[a-zA-Z])(?!.*s).{1,15}$/")
      )
      .required(),
    recoveryEmail: Joi.string().email().optional(),
    DOB: Joi.date().required(),
    mobileNumber: Joi.number().min(11).max(11).required(),
    role: Joi.string().valid("User", "HR").required(),
  }),
};

export const signIn = {
  body: Joi.object({
    email: Joi.string().email().required(),
    recoveryEmail: Joi.string().email(),
    mobileNumber: Joi.number().min(11).max(11),
    password: Joi.string()
      .pattern(
        new RegExp("/^(?=.*d)(?=(.*W){2})(?=.*[a-zA-Z])(?!.*s).{1,15}$/")
      )
      .required(),
  }),
};

export const updateAcc = {
  body: Joi.object({
    email: Joi.string().email().required(),
    mobileNumber: Joi.number().min(11).max(11).required(),
    recoveryEmail: Joi.string().email().optional(),
    DOB: Joi.date().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

export const idParam = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

export const userData = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const updatePass = {
  body: Joi.object({
    password: Joi.string()
      .pattern(
        new RegExp("/^(?=.*d)(?=(.*W){2})(?=.*[a-zA-Z])(?!.*s).{1,15}$/")
      )
      .required(),
    newPass: Joi.string()
      .pattern(
        new RegExp("/^(?=.*d)(?=(.*W){2})(?=.*[a-zA-Z])(?!.*s).{1,15}$/")
      )
      .required(),
  }),
};

export const forgetPass = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const accounts = {
  body: Joi.object({
    recoveryEmail: Joi.string().email().required(),
  }),
};
