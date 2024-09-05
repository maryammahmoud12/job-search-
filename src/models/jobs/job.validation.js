import Joi from "joi";

export const addJob = {
  body: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    workingTime: Joi.string().required(),
    seniorityLevel: Joi.string().required(),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.string().required(),
    softSkills: Joi.string().required(),
    addedBy: Joi.string().hex().length(24).required(),
  }),
};

export const updateJob = {
  body: Joi.object({
    location: Joi.string().required(),
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

export const jobMatch = {
  body: Joi.object({
    workingTime: Joi.string().required(),
    location: Joi.string().required(),
    seniorityLevel: Joi.string().required(),
    title: Joi.string().required(),
    technicalSkills: Joi.string().required(),
  }),
};

export const applayJob = {
  body: Joi.object({
    jobId: Joi.string().hex().length(24).required(),
    userId: Joi.string().hex().length(24).required(),
    userTechSkills: Joi.string().required(),
    userSoftSkills: Joi.string().required(),
  }),
  file: Joi.object({
    size: Joi.number().positive().required(),
    path: Joi.string().required(),
    filename: Joi.string().required(),
    destination: Joi.string().required(),
    mimetype: Joi.string().required(),
    encoding: Joi.string().required(),
    originalname: Joi.string().required(),
    feildname: Joi.string().required(),
  }).required(),
};
