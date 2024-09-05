import { appError } from "../utils/classError.js";


const dataMethods = ["body", "params", "query", "headers", "file", "files"];

export const validation = (schema) => {
  return (req, res, next) => {
    let arrErrors = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], { abortEarly: false });
      }
      if (error?.details) {
        error.details.forEach((err) => {
          arrErrors.push(err.message);
        });
      }
      if (arrErrors.length) {
        return next(new appError("validation error", 409));
      }
      next();
    });
  };
};
