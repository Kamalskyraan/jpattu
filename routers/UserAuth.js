import express from "express";
import { rateLimit } from "express-rate-limit";
import { validateLogin, validateRegister } from "../validator/authValidator.js";
import {
  LoginUser,
  LogoutUser,
  RegisterUser,
  TTRegisterUser,
  UpdateUserToken,
  verifyStatus,
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

router.post("/update-user", UpdateUserToken);

router.post("/tt-register", validateRegister, TTRegisterUser);

export default router;
