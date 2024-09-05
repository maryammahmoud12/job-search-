import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { multerLocal } from "../../service/multerLocal.js";
import * as JC from "./job.controller.js";
import * as JV from "./job.validation.js";

const router = Router();

router.post("/addjob", auth(["HR"]), validation(JV.addJob), JC.addJob);

router.put(
  "/updatejob/:id",
  auth(["HR"]),
  validation(JV.updateJob),
  JC.updateJob
);

router.delete(
  "/deletejob/:id",
  auth(["HR"]),
  validation(JV.idParam),
  JC.deleteJob
);

router.get("/alljobs", auth(["User", "HR"]), JC.allJobs);

router.get(
  "/alljob/:id",
  auth(["User", "HR"]),
  validation(JV.idParam),
  JC.allJob
);

router.get(
  "/jobmatch",
  auth(["User", "HR"]),
  validation(JV.jobMatch),
  JC.jobMatch
);

router.post(
  "/applay/:id",
  auth(["User"]),
  validation(JV.applayJob),
  multerLocal().single("userResume"),
  JC.applayJob
);

export default router;
