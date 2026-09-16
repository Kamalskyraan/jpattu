import express from "express";
import {
  getKRHomeDetails,
  getKRUser,
    getKRUserName,
  getPaymentDetailsKR,
  getPaymentDetailsTT,
  getRTUser,
  getRTUserName,
  getTempTTUser,
  getTTHomeDetails,
  updateKRUser,
  updateTTUser,
} from "../controllers/users.controller.js";
import { verifyUser } from "../middlewares/auth.js";
import { updateValidation } from "../validator/authValidator.js";

const router = express.Router();

router.get("/", getKRUserName);


router.get("/:user_id", verifyUser, getKRUser);



router.put("/", verifyUser, updateValidation, updateKRUser);
router.get("/data/:user_id", verifyUser, getKRHomeDetails);
router.get("/payment-details", getPaymentDetailsKR);
router.get("/temp/:user_id", getTempTTUser);
export default router;
