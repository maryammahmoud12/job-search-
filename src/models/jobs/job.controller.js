import { asyncHandler } from "../../middleware/errorHandle.js";
import { appError } from "../../utils/classError.js";

import jobModel from "../../../DB/models/job.model.js";
import applicationModel from "../../../DB/models/application.model.js";

// 1 - Add Job

export const addJob = asyncHandler(async (req, res, next) => {
  // destruct job details from request body
  const {
    title,
    location,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy,
  } = req.body;
  // create new job document in data base using create method
  const job = await jobModel.create({
    title,
    location,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy,
  });
  // if user is not auth , return error
  if (!job) {
    return next(new appError("you not auth", 420));
  }
  // return data that created
  return res.json({ msg: "done", job });
});

//  2 - Update Job
export const updateJob = asyncHandler(async (req, res, next) => {
  // destruct job id from params for using in find job and location from request body to update it
  const { id } = req.params;
  const { location } = req.body;
  // find company by id  , then update location of job
  const job = await jobModel.findByIdAndUpdate({ _id: id }, { location });
  // if there isn't a job or user is not auth , return error
  if (!job) {
    return next(new appError("job not found or you not auth", 410));
  }
  // return updated data
  return res.json({ msg: "done", job });
});

// 3 - Delete Job

export const deleteJob = asyncHandler(async (req, res, next) => {
  // destruct job id from params
  const { id } = req.params;
  // find job by id to delete it
  const job = await jobModel.findByIdAndDelete({ _id: id });
  // if there isn't a job or user is not auth , return error
  if (!job) {
    return next(new appError("job not found or you not auth", 410));
  }
  // return success message
  return res.json({ msg: "done" });
});

// 4 - Get all Jobs with their company’s information.

export const allJobs = asyncHandler(async (req, res, next) => {
  // find all jobs and relate each one of them with its company
  const job = await jobModel.find().populate("companyId");
  // return data founded
  return res.json({ msg: "done", job });
});

// 5 - Get all Jobs for a specific company.

export const allJob = asyncHandler(async (req, res, next) => {
  // destruct job id from params
  const { id } = req.params;
  // find all jobs for specific company and relate it with its company
  const job = await jobModel.find({ _id: id }).populate("companyId");
  // return data founded
  return res.json({ msg: "done", job });
});

// 6 - Get all Jobs that match the following filters
export const jobMatch = asyncHandler(async (req, res, next) => {
  // destruct job details from request body
  const { workingTime, location, seniorityLevel, title, technicalSkills } =
    req.body;
  // find job that match one or more of job details
  const job = await jobModel.find({
    $or: [
      { workingTime },
      { location },
      { seniorityLevel },
      { title },
      { technicalSkills },
    ],
  });
  // return data founded
  return res.json({ msg: "done", job });
});

// 7 - Apply to Job

export const applayJob = asyncHandler(async (req, res, next) => {
  // destruct job id from params for using in find job and application details from request body
  const { id } = req.params;
  const { jobId, userId, userTechSkills, userSoftSkills, userResume } =
    req.body;
  // find job by its id
  const job = await jobModel.findById({ _id: id });
  // if there isn't a job , return error
  if (!job) {
    return next(new appError("job not found", 500));
  }
  // check if the user has already applied for the job or no
  const appliedJob = await applicationModel.findOne({ jobId: id, userId });
  // if user applied , return error
  if (appliedJob) {
    return next(new appError("you already applied to this job", 501));
  }
  // create new apllication document if user not applied to job before
  const newApp = await applicationModel.create({
    jobId,
    userId,
    userTechSkills,
    userSoftSkills,
    userResume,
  });
  // return created data
  return res.json({ msg: "done", newApp });
});
