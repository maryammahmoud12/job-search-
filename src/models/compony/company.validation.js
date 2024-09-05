import Joi from "joi";

export const addCompany = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
};

export const updateCompany = {
  body: Joi.object({
    description: Joi.string().required(),
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

export const searchcompany = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
};
