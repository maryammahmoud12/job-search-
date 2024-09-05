import { Schema, model } from "mongoose";

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    enum: ["onsite", "remotly", "hybrid"],
    required: true,
  },
  workingTime: {
    typy: String,
    enum: ["parttime", "fulltime"],
  },
  seniorityLevel: {
    type: String,
    enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  technicalSkills: {
    type: [String],
    required: true,
  },
  softSkills: {
    type: [String],
    required: true,
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "company",
  },
});

const jobModel = model("job", jobSchema);
export default jobModel;
