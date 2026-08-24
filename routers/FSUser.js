import express from "express";
import {
  getFSUser,
  getHomeDetails,
  getNPUser,
  getNPUserName,
  getPaymentDetails,
  getPaymentDetailsNP,
  getPaymentDetailsTT,
  getRTUser,
  getRTUserName,
  getTempTTUser,
  getTempUser,
  getTTHomeDetails,
  updateTTUser,
} from "../controllers/users.controller.js";
import { verifyUser } from "../middlewares/auth.js";
import { updateValidation } from "../validator/authValidator.js";

const router = express.Router();

router.get("/", getNPUserName);

router.get("/:user_id", verifyUser, getFSUser);



router.put("/", verifyUser, updateValidation, updateTTUser);
router.get("/data/:user_id", verifyUser, getTTHomeDetails);
router.get("/payment-details", getPaymentDetailsNP);
router.get("/temp/:user_id", getTempTTUser);
export default router;
