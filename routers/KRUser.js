import express from "express";
import {
  getKRUser,
    getKRUserName,
  getPaymentDetailsTT,
  getRTUser,
  getRTUserName,
  getTempTTUser,
  getTTHomeDetails,
  updateTTUser,
} from "../controllers/users.controller.js";
import { verifyUser } from "../middlewares/auth.js";
import { updateValidation } from "../validator/authValidator.js";

const router = express.Router();

router.get("/", getKRUserName);


router.get("/:user_id", verifyUser, getKRUser);



router.put("/", verifyUser, updateValidation, updateTTUser);
router.get("/data/:user_id", verifyUser, getTTHomeDetails);
router.get("/payment-details", getPaymentDetailsTT);
router.get("/temp/:user_id", getTempTTUser);
export default router;
