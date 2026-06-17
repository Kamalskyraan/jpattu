import express from "express";
import { getTTUser, getTTUserName, updateTTUser } from "../controllers/users.controller.js";
import { verifyUser } from "../middlewares/auth.js";
import { updateValidation } from "../validator/authValidator.js";

const router = express.Router();

router.get("/", getTTUserName);
router.get("/:user_id", verifyUser, getTTUser);
router.put("/", verifyUser, updateValidation, updateTTUser);
export default router;
