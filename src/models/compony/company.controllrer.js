import { asyncHandler } from "../../middleware/errorHandle.js";
import { appError } from "../../utils/classError.js";

import applicationModel from "../../../DB/models/application.model.js";
import companyModel from "../../../DB/models/company.model.js";
import jobModel from "../../../DB/models/job.model.js";

// 1 - addCompany

export const addCompany = asyncHandler(async (req, res, next) => {
  // destruct company details from request body
  const {
    name,
    description,
    industry,
    address,
    numberOfEmployees,
    email,
    companyHR,
  } = req.body;
  // create new company document in data base using create method
  const company = await companyModel.create({
    name,
    description,
    industry,
    address,
    numberOfEmployees,
    email,
    companyHR,
  });
  // check if company exist return message that the company is exist
  if (company) {
    return next(new appError("company already exist", 410));
  }
  // if copmany not exist return it
  return res.json({ msg: "done", company });
});

// 2 - Update company data

export const updateCompany = asyncHandler(async (req, res, next) => {
  // destruct company id from params for using in find company and description from request body to update it
  const { id } = req.params;
  const { description } = req.body;
  // find company by id and ensure that only the owner update data , then update description of copmany
  const company = await companyModel.findByIdAndUpdate(
    { _id: id, companyHR: req.user._id },
    { description }
  );
  // if there isn't a company or user is not auth , return error
  if (!company) {
    return next(new appError("company not found or you not auth", 410));
  }
  // return updated data
  return res.json({ msg: "done", company });
});

// 3 - Delete company data

export const deleteCompany = asyncHandler(async (req, res, next) => {
  // destruct company id from params
  const { id } = req.params;
  // find company by id and ensure that only the owner delete data
  const company = await companyModel.findByIdAndDelete({
    _id: id,
    companyHR: req.user._id,
  });
  // if there isn't a company or user is not auth , return error
  if (!company) {
    return next(new appError("company not found or you not auth", 410));
  }
  // return success message
  return res.json({ msg: "done" });
});

// 4 - Get company data

export const getData = asyncHandler(async (req, res, next) => {
  // destruct company id from params
  const { id } = req.params;
  // find company by id
  const company = await companyModel.findById({ _id: id });
  // if there isn't a company or user is not auth , return error
  if (!company) {
    return next(new appError("company not found or you not auth", 410));
  }
  // return data of company
  return res.json({ msg: "done", company });
});

// 5 - Search for a company with a name.

export const searchcompany = asyncHandler(async (req, res, next) => {
  // destruct company name from body
  const { name } = req.body;
  // find company by its name
  const company = await companyModel.findOne({ name });
  // if there isn't a company or user is not auth , return error
  if (!company) {
    return next(new appError("company not found or you not auth", 410));
  }
  // return data of company
  return res.json({ msg: "done", company });
});

//  6 - Get all applications for specific Job

export const appData = asyncHandler(async (req, res, next) => {
  // destruct job id from params
  const { id } = req.params;
  // find job by id and ensure that the HR add job
  const job = await jobModel.findOne({ _id: id, addedBy: req.user._id });
  // if there isn't a job or user is not auth(not HR) , return error
  if (!job) {
    return next(new appError("job not found or you not auth", 410));
  }
  // find applications for the specified job using id and populate them with user details
  const app = await applicationModel.find({ jobId: id }).populate("userId");
  // return application data
  return res.json({ msg: "done", app });
});
