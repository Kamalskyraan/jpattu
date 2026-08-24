import express from "express";
import { rateLimit } from "express-rate-limit";
import { validateLogin } from "../validator/authValidator.js";
import {
  focusUserData,
  LoginAdmin,
  LogoutAdmin,
  newUserData,
  repeatUserData,
  TargetUserData,
  verifyStatus,
} from "../controllers/admin.controller.js";
import { verifyTTStatus } from "../controllers/users.controller.js";

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
router.get("/verify-tt-user", verifyTTStatus);
router.get("/get-target-userdata", TargetUserData);
router.get("/get-repeat-userdata", repeatUserData);
router.get("/get-new-userdata", newUserData);
router.get("/get-focus-userdata", focusUserData);

export default router;
