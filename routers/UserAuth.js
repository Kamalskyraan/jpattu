import express from "express";
import { rateLimit } from "express-rate-limit";
import { validateLogin, validateRegister } from "../validator/authValidator.js";
import {
  FSRegisterUser,
  KRRegisterUser,
  LoginUser,
  LogoutUser,
  NPRegisterUser,
  RegisterUser,
  RTRegisterUser,
  TTRegisterUser,
  UpdateUserToken,
  verifyNPStatus,
  verifyRTStatus,
  verifyStatus,
  verifyTTStatus,
} from "../controllers/users.controller.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: (req, res) => {
    const status = res.statusCode;
    return status < 400;
  },

  message: "Too many failed attempts. Please try again later.",
});

const router = express.Router();

// router.use(limiter);

router.post("/register", validateRegister, RegisterUser);

router.post("/login", validateLogin, LoginUser);

router.post("/logout", LogoutUser);

router.get("/verify-user", verifyStatus);

router.get("/verify-tt-user", verifyTTStatus);
router.get("/verify-rt-user", verifyRTStatus);
router.get("/verify-np-user", verifyNPStatus);

router.post("/update-user", UpdateUserToken);

router.post("/tt-register", validateRegister, TTRegisterUser);
router.post("/rt-register", validateRegister, RTRegisterUser);
router.post("/np-register", validateRegister, NPRegisterUser);
router.post("/fs-register", validateRegister, FSRegisterUser);

router.post("/kr-register", validateRegister, KRRegisterUser);

export default router;
