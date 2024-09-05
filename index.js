import dotenv from "dotenv";
dotenv.config();

import express from "express";

import connectionDB from "./DB/connectionDB.js";

import { appError } from "./src/utils/classError.js";

import userRouter from "./src/models/users/user.routes.js";
import companyRouter from "./src/models/compony/company.routes.js";
import jobRouter from "./src/models/jobs/job.routes.js";

const app = express();
const port = process.env.port || 4000;

app.use(express.json());
connectionDB();

app.use("/users", userRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);

app.use("*", (req, res, next) => {
  const err = new appError("invalid url");
  next(err);
});

// global error handle
app.use((err, req, res, next) => {
  res.status(err["cause"]).json({ msg: "error", err: err.message });
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
