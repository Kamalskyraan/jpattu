import express from "express";
import {
  getHomeDetails,
  getPaymentDetails,
  getPaymentDetailsTT,
  getTempTTUser,
  getTempUser,
  getTTHomeDetails,
  getTTUser,
  getTTUserName,
  updateTTUser,
} from "../controllers/users.controller.js";
import { verifyUser } from "../middlewares/auth.js";
import { updateValidation } from "../validator/authValidator.js";

const router = express.Router();

router.get("/", getTTUserName);
router.get("/:user_id", verifyUser, getTTUser);
router.put("/", verifyUser, updateValidation, updateTTUser);
router.get("/data/:user_id", verifyUser, getTTHomeDetails);
router.get("/payment-details", getPaymentDetailsTT);
router.get("/temp/:user_id", getTempTTUser);
export default router;
