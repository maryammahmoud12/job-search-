import { Schema, model } from "mongoose";

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  industry: {
    typy: String,
  },
  address: {
    type: String,
    required: true,
  },
  numberOfEmployees: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  companyHR: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const companyModel = model("company", companySchema);
export default companyModel;
