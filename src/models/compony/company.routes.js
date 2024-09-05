import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as CC from "./company.controllrer.js";
import * as CV from "./company.validation.js";

const router = Router();

router.post(
  "/addcompany",
  auth(["HR"]),
  validation(CV.addCompany),
  CC.addCompany
);
router.put(
  "/updatecompany/:id",
  auth(["HR"]),
  validation(CV.updateCompany),
  CC.updateCompany
);
router.put(
  "/deletecompany/:id",
  auth(["HR"]),
  validation(CV.idParam),
  CC.deleteCompany
);
router.get("/getdata/:id", auth(["HR"]), validation(CV.idParam), CC.getData);
router.get(
  "/searchcompany",
  auth(["User", "HR"]),
  validation(CV.searchcompany),
  CC.searchcompany
);
router.get(
  "/applicationdata/:id",
  auth(["HR"]),
  validation(CV.idParam),
  CC.appData
);

export default router;
