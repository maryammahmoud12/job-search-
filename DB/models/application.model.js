import { Schema, model } from "mongoose";

const applicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "job",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  userTechSkills: {
    typy: [String],
  },
  userSoftSkills: {
    type: [String],
    required: true,
  },
  userResume: {
    type: String,
  },
});

const applicationModel = model("application", applicationSchema);
export default applicationModel;
