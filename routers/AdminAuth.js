import express from "express";
import { rateLimit } from "express-rate-limit";
import { validateLogin } from "../validator/authValidator.js";
import {
  LoginAdmin,
  LogoutAdmin,
  TargetUserData,
  verifyStatus,
} from "../controllers/admin.controller.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const router = express.Router();

// router.use(limiter);

router.post("/login", validateLogin, LoginAdmin);

router.post("/logout", LogoutAdmin);

router.get("/verify-user", verifyStatus);
router.get("/get-target-userdata" , TargetUserData)
export default router;
