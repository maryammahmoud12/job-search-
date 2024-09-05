import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  recoveryEmail: String,
  password: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  mobileNumber: {
    type: Number,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["User", "HR"],
    default: "User",
  },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
  confirmed: {
    type: Boolean,
    default: "false",
  },
  newPass: String,
});

userSchema.pre("save", function (next) {
  if (!this.username) {
    this.username = `${this.firstName}${this.lastName}`;
  }
  next();
});

const userModel = model("user", userSchema);
export default userModel;
