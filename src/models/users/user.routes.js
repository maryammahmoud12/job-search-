import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as UC from "./user.controller.js";
import * as UV from "./user.validation.js";

const router = Router();

router.post("/signup", validation(UV.signUp), UC.signUp);
router.get("/confirmEmail/:token", UC.confirmEmail);

router.post("/signin", validation(UV.signIn), UC.signIn);

router.put(
  "/:id",
  auth(["User", "HR"]),
  validation(UV.updateAcc),
  UC.updateAcc
);

router.delete(
  "/:id",
  auth(["User", "HR"]),
  validation(UV.idParam),
  UC.deleteAcc
);

router.get(
  "/userData",
  auth(["User", "HR"]),
  validation(UV.userData),
  UC.userData
);

router.get("/:id", validation(UV.idParam), UC.profileData);

router.put(
  "/updatePass",
  auth(["User", "HR"]),
  validation(UV.updatePass),
  UC.updatePass
);

router.post(
  "/forgetPass",
  auth(["User", "HR"]),
  validation(UV.forgetPass),
  UC.forgetPass
);
router.put("/resetpassword/:token", auth(["User", "HR"]), UC.resetPass);

router.get("/accounts", validation(UV.accounts), UC.accounts);

export default router;
